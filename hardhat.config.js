import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const config = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      type: "edr-simulated",
      chainId: 1337
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
      gasPrice: 20000000000, // 20 gwei
      type: "http"
    }
  }
};

export default config;
