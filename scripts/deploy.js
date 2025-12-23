const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying with account:", deployer.address);
 

  const Vault = await ethers.getContractFactory("SignedExecutionVault");
  const vault = await Vault.deploy();

  await vault.waitForDeployment();

  console.log("SignedExecutionVault deployed to:", vault.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
