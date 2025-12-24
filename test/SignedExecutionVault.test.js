const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SignedExecutionVault", function () {
  let vault;
  let signer;
  let relayer;

  beforeEach(async function () {
    [signer, relayer] = await ethers.getSigners();

    const Vault = await ethers.getContractFactory("SignedExecutionVault");
    vault = await Vault.deploy();
    await vault.waitForDeployment();
  });

  function buildHash(vaultAddress, chainId, signer, actionData, nonce) {
    return ethers.keccak256(
      ethers.solidityPacked(
        ["address", "uint256", "address", "bytes", "uint256"],
        [vaultAddress, chainId, signer, actionData, nonce]
      )
    );
  }

  it("executes with valid signature", async function () {
    const actionData = ethers.toUtf8Bytes("DO_SOMETHING");
    const nonce = 0;

    const chainId = (await ethers.provider.getNetwork()).chainId;
    const hash = buildHash(
      vault.target,
      chainId,
      signer.address,
      actionData,
      nonce
    );

    const signature = await signer.signMessage(
      ethers.getBytes(hash)
    );

    await expect(
      vault
        .connect(relayer)
        .execute(signer.address, actionData, nonce, signature)
    ).to.emit(vault, "Executed");
  });

  it("reverts on replay attack", async function () {
    const actionData = ethers.toUtf8Bytes("REPLAY");
    const nonce = 0;

    const chainId = (await ethers.provider.getNetwork()).chainId;
    const hash = buildHash(
      vault.target,
      chainId,
      signer.address,
      actionData,
      nonce
    );

    const signature = await signer.signMessage(
      ethers.getBytes(hash)
    );

    await vault
      .connect(relayer)
      .execute(signer.address, actionData, nonce, signature);

    await expect(
      vault
        .connect(relayer)
        .execute(signer.address, actionData, nonce, signature)
    ).to.be.revertedWith("INVALID_NONCE");
  });

  it("reverts with wrong signer", async function () {
    const actionData = ethers.toUtf8Bytes("INVALID_SIGNER");
    const nonce = 0;

    const chainId = (await ethers.provider.getNetwork()).chainId;
    const hash = buildHash(
      vault.target,
      chainId,
      signer.address,
      actionData,
      nonce
    );

    const badSignature = await relayer.signMessage(
      ethers.getBytes(hash)
    );

    await expect(
      vault
        .connect(relayer)
        .execute(signer.address, actionData, nonce, badSignature)
    ).to.be.revertedWith("INVALID_SIGNATURE");
  });
});    