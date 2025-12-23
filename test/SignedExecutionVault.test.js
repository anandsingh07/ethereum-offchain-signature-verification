const { expect } = require("chai");
const { ethers } = require("hardhat");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("SignedExecutionVault", function () {
  it("executes a valid signed action", async function () {
    const [executor, signer] = await ethers.getSigners();

    const Vault = await ethers.getContractFactory("SignedExecutionVault");
    const vault = await Vault.deploy();
    await vault.waitForDeployment();

    const nonce = 0;
    const actionData = ethers.solidityPacked(["string"], ["DO_SOMETHING"]);

    const chainId = (await ethers.provider.getNetwork()).chainId;

    const actionHash = ethers.keccak256(
      ethers.solidityPacked(
        ["address", "uint256", "address", "bytes", "uint256"],
        [vault.target, chainId, signer.address, actionData, nonce]
      )
    );

    const signature = await signer.signMessage(
      ethers.getBytes(actionHash)
    );

    await expect(
      vault
        .connect(executor)
        .execute(signer.address, actionData, nonce, signature)
    )
      .to.emit(vault, "Executed")
      .withArgs(
        signer.address,
        executor.address,
        nonce,
        actionHash,
        anyValue
      );

    expect(await vault.nonces(signer.address)).to.equal(1);
  });

  it("rejects replay attack", async function () {
    const [executor, signer] = await ethers.getSigners();

    const Vault = await ethers.getContractFactory("SignedExecutionVault");
    const vault = await Vault.deploy();
    await vault.waitForDeployment();

    const nonce = 0;
    const actionData = ethers.solidityPacked(["string"], ["REPLAY"]);

    const chainId = (await ethers.provider.getNetwork()).chainId;

    const actionHash = ethers.keccak256(
      ethers.solidityPacked(
        ["address", "uint256", "address", "bytes", "uint256"],
        [vault.target, chainId, signer.address, actionData, nonce]
      )
    );

    const signature = await signer.signMessage(
      ethers.getBytes(actionHash)
    );

    await vault.execute(signer.address, actionData, nonce, signature);

    await expect(
      vault.execute(signer.address, actionData, nonce, signature)
    ).to.be.revertedWith("INVALID_NONCE");
  });
});
