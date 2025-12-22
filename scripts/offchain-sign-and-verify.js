const hre = require("hardhat");

async function main() {
  const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const [signer] = await hre.ethers.getSigners();

  console.log("Signer address:", signer.address);

  const SignatureVerifier = await hre.ethers.getContractFactory("SignatureVerifier");
  const verifier = await SignatureVerifier.attach(CONTRACT_ADDRESS);

  const amount = hre.ethers.parseEther("0.006");
  const nonce = 0;

  //  Off-chain hash (contract read)
  const messageHash = await verifier.getMessageHash(
    signer.address,
    amount,
    nonce
  );

  console.log("Message hash:", messageHash);

  // Off-chain signing (NO TX, NO GAS)
  const signature = await signer.signMessage(
    hre.ethers.getBytes(messageHash)
  );

  console.log("Signature:", signature);

  // On-chain verification
  const isValid = await verifier.verify(
    signer.address,
    amount,
    nonce,
    signature
  );

  console.log("Signature valid:", isValid);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
