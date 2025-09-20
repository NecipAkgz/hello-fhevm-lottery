import { ethers } from "ethers";

async function main() {
  console.log("🚀 Starting contract deployment to Sepolia testnet...");

  try {
    // Create Sepolia provider
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    console.log("✅ Provider and signer created");

    // Read contract bytecode
    const fsModule = await import("fs");
    const contractData = JSON.parse(fsModule.readFileSync("./artifacts/contracts/ConfidentialLottery.sol/ConfidentialLottery.json", "utf8"));

    console.log("✅ Contract ABI and bytecode loaded");

    // Create contract factory
    const ConfidentialLottery = new ethers.ContractFactory(contractData.abi, contractData.bytecode, signer);
    console.log("✅ Contract factory created");

    // Deploy contract
    console.log("📤 Starting contract deployment...");
    const lottery = await ConfidentialLottery.deploy();

    console.log("⏳ Waiting for deployment completion...");
    await lottery.waitForDeployment();

    // Get contract address
    const address = await lottery.getAddress();
    console.log("🎉 Contract deployed successfully!");
    console.log("📍 Contract address:", address);
    console.log("🌐 Network: Sepolia Testnet");
    console.log("💰 Ticket price:", ethers.formatEther(await lottery.ticketPrice()), "ETH");

    // Save deployment information
    const deploymentInfo = {
      contractAddress: address,
      network: "sepolia",
      deploymentTime: new Date().toISOString(),
      ticketPrice: ethers.formatEther(await lottery.ticketPrice()),
      explorerUrl: `https://sepolia.etherscan.io/address/${address}`
    };

    fsModule.writeFileSync("deployment-sepolia.json", JSON.stringify(deploymentInfo, null, 2));
    console.log("📄 Deployment information saved to 'deployment-sepolia.json'");
    console.log("🔗 Etherscan:", deploymentInfo.explorerUrl);

    return address;

  } catch (error) {
    console.error("❌ Deployment error:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
