import hre from "hardhat";
import { writeFileSync } from "fs";

async function main() {
  console.log("Deploying ConfidentialLotteryFHE to Sepolia...");

  // Get the ContractFactory and Signers here
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Deploy ConfidentialLotteryFHE contract
  const ConfidentialLotteryFHE = await hre.ethers.getContractFactory("ConfidentialLotteryFHE");
  const lottery = await ConfidentialLotteryFHE.deploy();

  await lottery.waitForDeployment();

  console.log("ConfidentialLotteryFHE deployed to:", await lottery.getAddress());

  // Save the contract address to a file
  const deploymentInfo = {
    contractAddress: await lottery.getAddress(),
    deployer: deployer.address,
    network: "sepolia",
    deploymentTime: new Date().toISOString()
  };

  writeFileSync("deployment-fhevm.json", JSON.stringify(deploymentInfo, null, 2));
  console.log("Deployment info saved to deployment-fhevm.json");

  return lottery.address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
