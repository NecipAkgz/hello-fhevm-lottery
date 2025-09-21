import * as dotenv from "dotenv";
import "@fhevm/hardhat-plugin";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";

dotenv.config();

const config = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 800,
          },
          evmVersion: "cancun",
        },
      },
    ],
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
      accounts: process.env.PRIVATE_KEY && process.env.PRIVATE_KEY !== 'your_private_key_here'
        ? [process.env.PRIVATE_KEY]
        : [],
      chainId: 11155111,
    },
    hardhat: {
      chainId: 31337,
    },
  },
  fhevm: {
    networkId: 11155111, // Sepolia testnet
    gatewayUrl: "https://sepolia.fhevm.zama.ai"
  },
  gasReporter: {
    currency: "USD",
    gasPrice: 3,
    token: "ETH",
    tokenPrice: "4700",
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
    outputFile: "reports/gas-report.txt",
    noColors: true,
    showMethodSig: true,
  },
};

export default config;
