
const hre = require("hardhat");

async function main() {
  const SignatureVerifier = await hre.ethers.getContractFactory(
    "SignatureVerifier"
  );

  const verifier = await SignatureVerifier.deploy();

  await verifier.waitForDeployment();

  console.log("SignatureVerifier deployed to:", verifier.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
