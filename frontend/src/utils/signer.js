import { ethers } from "ethers";
import { VAULT_ADDRESS } from "../config/env";

export async function signExecution({
  signer,
  provider,
  actionData,
  nonce
}) {
  if (!VAULT_ADDRESS) {
    throw new Error("VAULT_ADDRESS is undefined (env not loaded)");
  }

  if (!signer) {
    throw new Error("Signer is null (wallet not connected)");
  }

  if (!provider) {
    throw new Error("Provider is null");
  }

  const userAddress = await signer.getAddress();

  if (!ethers.isAddress(userAddress)) {
    throw new Error("Invalid userAddress: " + userAddress);
  }

  if (!ethers.isAddress(VAULT_ADDRESS)) {
    throw new Error("Invalid VAULT_ADDRESS: " + VAULT_ADDRESS);
  }

  const chainId = (await provider.getNetwork()).chainId;

  console.log("DEBUG VAULT_ADDRESS:", VAULT_ADDRESS);
  console.log("DEBUG userAddress:", userAddress);
  console.log("DEBUG chainId:", chainId);

  const hash = ethers.keccak256(
    ethers.solidityPacked(
      ["address", "uint256", "address", "bytes", "uint256"],
      [VAULT_ADDRESS, chainId, userAddress, actionData, nonce]
    )
  );

  const signature = await signer.signMessage(
    ethers.getBytes(hash)
  );

  return {
    signer: userAddress,
    actionData: ethers.hexlify(actionData),
    nonce,
    signature
  };
}
