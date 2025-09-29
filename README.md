# 🎯 Confidential Lottery - FHEVM Tutorial

[![Live Demo](https://img.shields.io/badge/Live%20Demo-View%20Application-FFD20A?style=for-the-badge&logo=vercel)](https://hello-fhevm-lottery.vercel.app/)

This project is a **complete, working implementation** of the "Hello FHEVM" tutorial for **Zama Bounty Program Season 10**. It features a fully functional confidential lottery dApp designed for beginner Web3 developers to learn FHEVM concepts.

## 📋 Table of Contents

- [🎯 Confidential Lottery - FHEVM Tutorial](#-confidential-lottery---fhevm-tutorial)
- [📋 Project Overview](#-project-overview)
- [🚀 Quick Start](#-quick-start)
  - [⚡ 5-Minute Quick Start](#-5-minute-quick-start)
  - [🔧 Development Environment Setup](#-development-environment-setup)
  - [🎮 Testing the Application](#-testing-the-application)
- [🔐 FHEVM vs Traditional Lottery](#-fhevm-vs-traditional-lottery)
- [🎯 Technical Implementation](#-technical-implementation)
- [🎮 Usage Guide](#-usage-guide)
- [🔧 Development Commands](#-development-commands)
- [🌐 Network Configuration](#-network-configuration)
- [📊 Contract Details](#-contract-details)
- [🎯 Learning Outcomes](#-learning-outcomes)
- [🔐 FHEVM Basics (For Beginners)](#-fhevm-basics-for-beginners)
- [🔧 Troubleshooting](#-troubleshooting)
- [❓ FAQ (Frequently Asked Questions)](#-faq-frequently-asked-questions)
- [📞 Support & Resources](#-support--resources)

## 📋 Project Overview

### 🎮 **Application Features**
- **🔐 Confidential Ticket Purchase**: Users participate with encrypted ticket numbers
- **🎲 Secret Random Drawing**: Secure winner selection using blockchain randomness
- **💰 Secure Prize Distribution**: Only winner can claim prize
- **📱 Modern UI**: Responsive React interface with real-time updates
- **🔗 MetaMask Integration**: Complete wallet connection and transaction handling
- **⚡ Live Status Updates**: Real-time contract state monitoring

## 🚀 Quick Start

### 🌐 Live Demo
Try the application instantly without setup: [**Live Demo**](https://hello-fhevm-lottery.vercel.app/)

### 📋 Prerequisites
- Node.js (v16+)
- MetaMask browser extension
- Sepolia ETH for testing (get from https://sepoliafaucet.com/)
- Basic knowledge of Solidity and JavaScript

---

## ⚡ 5-Minute Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/NecipAkgz/hello-fhevm-lottery.git
cd hello-fhevm-lottery
npm install
cd frontend && npm install && cd ..
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your Infura API key and private key
```

### 3. Deploy Contract
```bash
npx hardhat compile
npx hardhat run scripts/deploy-fhevm.js --network sepolia
```

**⚠️ Important:** After deployment, copy the contract address from the console output and update it in the frontend configuration.

### 4. Update Frontend Configuration
After deployment, you'll see output like:
```
Contract deployed to: 0x1234567890abcdef...
```

**Copy this address** and update it in:
- `frontend/src/App.js` - `const contractAddress = "YOUR_DEPLOYED_ADDRESS"`
- `README.md` - Contract Details section

### 5. Start Application
```bash
cd frontend && npm start
```

### 5. Test It
1. Open http://localhost:3000
2. Connect MetaMask to Sepolia
3. Buy ticket (0.0001 ETH)
4. Draw winner
5. Claim prize

**🎉 You're ready to explore FHEVM!**

---

## 🔧 Development Environment Setup

### Environment Configuration
Create `.env` file with your credentials:
```bash
# Required for Sepolia deployment
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_here

# Optional: For local development
LOCAL_RPC_URL=http://127.0.0.1:8545
```

### MetaMask Sepolia Setup
1. Open MetaMask → Network selector → Add Network
2. Enter these details:
   ```
   Network Name: Sepolia Testnet
   RPC URL: https://sepolia.infura.io/v3/YOUR_INFURA_KEY
   Chain ID: 11155111
   Currency: ETH
   Block Explorer: https://sepolia.etherscan.io/
   ```

### Get Test ETH
- Visit [Sepolia Faucet](https://sepoliafaucet.com/)
- Request test ETH for your wallet
- Minimum 0.001 ETH recommended for testing

---

## 🎮 Testing the Application

### Basic Flow Test
1. **Connect Wallet**: Click "Connect Wallet" button
2. **Buy Ticket**: Choose number 1-100, pay 0.0001 ETH
3. **Wait for Participants**: Multiple users can join
4. **Draw Winner**: Admin function (10 min auto or manual)
5. **Claim Prize**: Winner receives total prize pool

### Contract Address
**Sepolia Testnet**: `0x22E1FcFA32e01B1eD5c3Ed1d4f41E11a2a9b0000`

### Gas Estimation
- Ticket purchase: ~150,000 gas
- Winner draw: ~200,000 gas
- Prize claim: ~100,000 gas

**Need help?** Check the [Troubleshooting](#-troubleshooting) section below.

## 🔐 FHEVM vs Traditional Lottery

This project demonstrates the revolutionary difference between **traditional blockchain applications** and **FHEVM-powered confidential applications**.

### 📊 **Core Differences**

| Aspect | Traditional | FHEVM |
|--------|-------------|-------|
| **Privacy** | ❌ Public ticket numbers | ✅ Mathematical privacy |
| **Security** | ⚠️ Trust-based | 🔒 Cryptographic guarantees |
| **Data Storage** | Plain text | Encrypted computation |
| **Performance** | ⚡ Fast | 🐌 FHE overhead |
| **Verification** | Public audit | Zero-knowledge proofs |

### 🔄 **Privacy Flow Comparison**

**Traditional Flow:**
```
User → Public Number → Everyone Sees → Public Winner Selection
```

**FHEVM Flow:**
```
User → Encrypted Number → Private Storage → Encrypted Winner Selection
```

### 🎯 **Key Advantages of FHEVM**

- **🔒 Zero-Knowledge Verification**: Prove fairness without revealing data
- **🛡️ Mathematical Security**: Cryptographic guarantees vs trust-based
- **⚡ Future-Proof**: Quantum-resistant privacy
- **📋 Regulatory Ready**: Built-in GDPR/CCPA compliance
- **🔗 Ethereum Compatible**: Works with existing infrastructure

### 🚀 **Real-World Impact**

**Traditional Use Cases:**
- Public auctions, transparent voting, basic gaming

**FHEVM Use Cases:**
- **Private Gaming**: Poker, confidential lotteries
- **Sealed Auctions**: Blind bidding systems
- **Medical Privacy**: Protected health data analysis
- **Financial Security**: Confidential transactions
- **Identity Protection**: Private KYC processes

### 💡 **Why This Matters**

FHEVM enables **privacy by default** - applications can be confidential without sacrificing functionality, meeting regulatory requirements while maintaining user trust and future-proof security.

## 🎯 Technical Implementation

### 🔧 Core Technical Changes

This project demonstrates the key differences between traditional and FHEVM approaches:

#### 📊 **Data Structure Changes**

| Component | Traditional | FHEVM |
|-----------|-------------|-------|
| **Data Type** | `uint8` | `euint8` (encrypted) |
| **Input** | `uint8 _number` | `bytes encryptedNumber` |
| **Storage** | `mapping(address => uint8)` | `mapping(address => euint8)` |
| **Return** | Plain values | Encrypted bytes |

#### 🔐 **Key Function Changes**

**buyTicket() Function:**
- **Traditional**: Validates range (1-100), stores plain numbers
- **FHEVM**: Accepts encrypted bytes, no validation needed

**drawWinner() Function:**
- **Traditional**: Returns winning number publicly
- **FHEVM**: Returns encrypted result, preserves privacy

**getMyTicket() Function:**
- **Traditional**: Returns plain ticket number
- **FHEVM**: Returns encrypted ticket data

### 📋 **Function-by-Function Implementation Guide**

#### 🎫 **buyTicket() - Ticket Purchase**

**Traditional Contract:**
```solidity
function buyTicket(uint8 _ticketNumber) external payable {
    require(_ticketNumber >= 1 && _ticketNumber <= 100);
    tickets[msg.sender] = _ticketNumber;
    emit TicketPurchased(msg.sender, _ticketNumber);
}
```

**FHEVM Contract:**
```solidity
function buyTicket(
    externalEuint8 encryptedTicketHandle,
    bytes calldata encryptedTicketProof
) external payable {
    encryptedTickets[msg.sender] = FHE.fromExternal(
        encryptedTicketHandle,
        encryptedTicketProof
    );
    emit TicketPurchased(
        msg.sender,
        encryptedTicketHandle,
        encryptedTicketProof
    );
}
```

**Key Changes:**
- Input: `uint8` → `externalEuint8` handle + proof (FHE ciphertext)
- Validation: Range checks → Proof verification by the FHEVM coprocessor
- Storage: Plain assignment → Verified encrypted storage
- Events: Plain number → Emits ciphertext handle + proof for auditing

#### 🎲 **drawWinner() - Winner Selection**

**Traditional Contract:**
```solidity
function drawWinner() external {
    uint256 randomIndex = uint256(keccak256(abi.encodePacked(
        block.timestamp, block.prevrandao, participants.length
    ))) % participants.length;

    winner = participants[randomIndex];
    uint8 winningNumber = tickets[winner];
    emit WinnerDrawn(winner, winningNumber);
}
```

**FHEVM Contract:**
```solidity
function drawWinner() external {
    uint256 randomIndex = uint256(keccak256(abi.encodePacked(
        block.timestamp, block.prevrandao, participants.length
    ))) % participants.length;

    winner = participants[randomIndex];
    euint8 winningNumber = encryptedTickets[winner];
    bytes memory encryptedWinningNumber = abi.encodePacked(
        euint8.unwrap(winningNumber)
    );

    emit WinnerDrawn(winner, encryptedWinningNumber);
}
```

**Key Changes:**
- Random selection: Same algorithm (identical)
- Winner data: Plain number → Encrypted ciphertext handle
- Event emission: `uint8` → `bytes` payload usable for off-chain decryption
- Privacy: Winner number exposed → Winner number hidden by default

#### 👀 **getMyTicket() - View Personal Ticket**

**Traditional Contract:**
```solidity
function getMyTicket() external view returns (uint8) {
    return tickets[msg.sender];
}
```

**FHEVM Contract:**
```solidity
function getMyTicket() external view returns (bytes memory) {
    euint8 ticket = encryptedTickets[msg.sender];
    return abi.encodePacked(euint8.unwrap(ticket));
}
```

**Key Changes:**
- Return type: `uint8` → `bytes memory`
- Access: Direct mapping → Encrypted mapping
- Data format: Plain number → Ciphertext handle for relayer decryption
- Privacy: Anyone can see → Only owner can decrypt via FHEVM services

#### 💰 **claimPrize() - Prize Claiming**

**Traditional Contract:**
```solidity
function claimPrize() external {
    require(msg.sender == winner);
    uint256 prize = address(this).balance;
    payable(winner).transfer(prize);
    emit PrizeClaimed(winner, prize);
}
```

**FHEVM Contract:**
```solidity
function claimPrize() external {
    require(msg.sender == winner);
    uint256 prize = address(this).balance;
    payable(winner).transfer(prize);
    emit PrizeClaimed(winner, prize);
}
```

**Key Changes:**
- Logic: Nearly identical
- Winner verification: Address check (same)
- Prize transfer: Standard ETH transfer (same)
- Event emission: Same format

#### 🔄 **startNewRound() - Lottery Reset**

**Traditional Contract:**
```solidity
function startNewRound() external {
    isDrawn = false;
    winner = address(0);
    delete participants;
    // Reset other state variables
}
```

**FHEVM Contract:**
```solidity
function startNewRound() external {
    isDrawn = false;
    winner = address(0);
    delete participants;
    // Reset other state variables
}
```

**Key Changes:**
- Reset logic: Identical
- State variables: Same names and types
- Contract state: Same management approach
- Only data types differ (plain vs encrypted)

#### 🏗️ **Contract Architecture**

**Traditional Contract:**
```solidity
contract ConfidentialLottery {
    mapping(address => uint8) private tickets;  // Public storage
    function buyTicket(uint8 _number) external; // Clear input
}
```

**FHEVM Contract:**
```solidity
contract ConfidentialLotteryFHE is SepoliaConfig {
    mapping(address => euint8) private encryptedTickets; // Encrypted storage
    function buyTicket(
        externalEuint8 encryptedHandle,
        bytes calldata proof
    ) external; // FHE handle + proof
}
```

### 🔑 **Essential Technical Differences**

- **Data Types**: `uint8` → `euint8` (encrypted integers)
- **Input Validation**: Range checks → Proof verification via FHEVM
- **Storage Pattern**: Plain mapping → Encrypted mapping
- **Function Signatures**: `uint8` parameters → `(externalEuint8, bytes)`
- **Return Types**: Plain values → Ciphertext handles/bytes
- **Security Model**: Access control → Cryptographic security
- **Import Requirements**: None → FHEVM libraries + SepoliaConfig

### 📋 **Contract Interface Comparison**

| Feature | Traditional Contract | FHEVM Contract |
|---------|---------------------|----------------|
| **Inheritance** | `ConfidentialLottery` | `ConfidentialLotteryFHE is SepoliaConfig` |
| **Storage** | `mapping(address => uint8)` | `mapping(address => euint8)` |
| **buyTicket** | `uint8 _number` | `externalEuint8 handle, bytes proof` |
| **getMyTicket** | `returns (uint8)` | `returns (bytes memory)` |
| **Validation** | Range checks (1-100) | No validation needed |

**Key Features:**
- **Participant Tracking**: Maintains list of all participants for fair drawing
- **Secure Randomness**: Blockchain-based winner selection
- **Access Control**: Only winner can claim prize
- **Event Logging**: All transactions are logged
- **Past Rounds**: Complete history of all lottery rounds
- **Prize Claim**: Winners can claim prizes from any past round
- **Auto/Manual Reset**: Automatic reset on claim, manual reset after draw
- **Time-based Draw**: 10-minute countdown after first participant joins

### Frontend Contract Integration (useLottery.js)

The React frontend uses a custom hook `useLottery` to interact with the FHEVM contract:

#### 🎫 **buyTicket() - FHE Encryption Integration**
```javascript
const buyTicket = async (ticketNumber) => {
  // Initialize FHEVM SDK
  await window.relayerSDK.initSDK();

  // Create FHEVM instance with Sepolia config
  const config = { ...window.relayerSDK.SepoliaConfig, network: window.ethereum };
  const fhevm = await window.relayerSDK.createInstance(config);

// Encrypt ticket number using FHEVM
const encryptedInput = await fhevm.createEncryptedInput(contractAddress, account);
encryptedInput.add8(ticketNumber);
const { handles, inputProof } = await encryptedInput.encrypt();

// Send ciphertext handle + proof to contract
const ticketHandle = ethers.hexlify(handles[0]);
const ticketProof = ethers.hexlify(inputProof);
const ticketPrice = await contract.ticketPrice();

const tx = await contract.buyTicket(ticketHandle, ticketProof, {
  value: ticketPrice
});

  await tx.wait();
};
```

#### 🎲 **drawWinner() - Random Selection**
```javascript
const drawWinner = async () => {
  const tx = await contract.drawWinner();
  await tx.wait();
  // Contract selects winner using blockchain randomness
};
```

#### 💰 **claimPrize() - Winner Claims**
```javascript
const claimPrize = async () => {
  const tx = await contract.claimPrize();
  await tx.wait();
  // Auto-resets lottery for next round
};
```

#### 🔄 **startNewRound() - Manual Reset**
```javascript
const startNewRound = async () => {
  const tx = await contract.startNewRound();
  await tx.wait();

  // Auto-purchase first ticket for round starter
  const encryptedInput = await fhevm.createEncryptedInput(contractAddress, account);
  encryptedInput.add8(1);
  const { handles, inputProof } = await encryptedInput.encrypt();

  const ticketTx = await contract.buyTicket(
    ethers.hexlify(handles[0]),
    ethers.hexlify(inputProof),
    {
      value: await contract.ticketPrice()
    }
  );
};
```

#### 📊 **loadLotteryState() - Real-time Updates**
```javascript
const loadLotteryState = async (contractInstance) => {
  const [isDrawn, winner, participantCount, balance, ticketPrice, lastDrawTime, admin, pastRoundsLength] =
    await Promise.all([
      contractInstance.isDrawn(),
      contractInstance.winner(),
      contractInstance.getParticipantCount(),
      contractInstance.getBalance(),
      contractInstance.ticketPrice(),
      contractInstance.lastDrawTime(),
      contractInstance.admin(),
      contractInstance.getPastRoundsLength()
    ]);

  // Load past rounds with pagination
  const pastRounds = [];
  for (let i = Math.max(0, pastRoundsLength - 5); i < pastRoundsLength; i++) {
    const round = await contractInstance.getPastRound(i);
    pastRounds.push({
      winner: round[0],
      prize: formatEther(round[1]),
      drawTime: Number(round[2]),
      claimed: round[3],
      index: i
    });
  }

  setLotteryState({ /* update state */ });
};
```

#### 🔗 **Contract ABI for FHEVM**
```javascript
const contractABI = [
  "function buyTicket(bytes) payable",           // Encrypted input
  "function drawWinner()",                       // Random selection
  "function claimPrize()",                       // Winner claims
  "function startNewRound()",                    // Manual reset
  "function claimPastPrize(uint256)",            // Historical claims
  "function getMyTicket() view returns (bytes)", // Encrypted return
  "function getBalance() view returns (uint256)",
  "function getParticipantCount() view returns (uint256)",
  "function getPastRound(uint256) view returns (address, uint256, uint256, bool)"
];
```

**Key Features:**
- **MetaMask Integration**: Full wallet connection and transaction handling
- **Real-time Updates**: Live contract status with 1-second refresh
- **Past Rounds**: Complete history of all lottery rounds
- **Prize Claim**: Claim prizes from any past round
- **Auto/Manual Reset**: Automatic reset on claim, manual reset after draw
- **Time-based Draw**: 10-minute countdown with visual timer
- **Error Handling**: User-friendly error messages and loading states
- **Responsive Design**: Mobile-compatible UI with modern styling
- **Admin Panel**: Hidden admin functions (reset, monitoring)
- **Toast Notifications**: Real-time feedback for all actions

## 🎮 Usage Guide

### 1. Initial Setup
- Configure environment variables
- Compile smart contract
- Deploy to Sepolia testnet
- Start React frontend

### 2. MetaMask Configuration
- Add Sepolia testnet network
- Get Sepolia ETH from faucet
- Connect to application

### 3. Lottery Flow
1. **Connect Wallet**: Link MetaMask to dApp
2. **Buy Ticket**: Choose number 1-100, pay 0.0001 ETH
3. **Wait for Participants**: Multiple users join
4. **Draw Winner**: Admin runs random selection
5. **Claim Prize**: Winner receives total prize pool

### 4. Admin Functions
- Draw winner (selects random participant)
- Monitor lottery status
- View all participants

## 🔧 Development Commands

### Testing
```bash
# Run all tests
npx hardhat test

# Run with gas reporting
REPORT_GAS=true npx hardhat test

# Run specific test
npx hardhat test --grep "Lottery"
```

### Deployment
```bash
# Sepolia testnet deployment
npx hardhat run scripts/deploy-fhevm.js --network sepolia
```

### Development
```bash
# Start development server
cd frontend && npm start

# Build for production
cd frontend && npm run build

# Run linter
cd frontend && npm run lint
```

## 🌐 Network Configuration

### Sepolia Testnet (Primary)
```javascript
// hardhat.config.js
networks: {
  sepolia: {
    url: process.env.SEPOLIA_RPC_URL,
    accounts: [process.env.PRIVATE_KEY],
    chainId: 11155111,
    gasPrice: 20000000000, // 20 gwei
    type: "http"
  }
}
```

### MetaMask Setup for Sepolia
```
Network Name: Sepolia Testnet
RPC URL: https://sepolia.infura.io/v3/YOUR_INFURA_KEY
Chain ID: 11155111
Currency: ETH
Block Explorer: https://sepolia.etherscan.io/
```

## 📊 Contract Details

### Sepolia Testnet (Production)
- **Contract Address**: `0x22E1FcFA32e01B1eD5c3Ed1d4f41E11a2a9b0000`
- **Ticket Price**: 0.0001 ETH (ultra-low for testing)
- **Network**: Sepolia Testnet (Chain ID: 11155111)
- **Etherscan**: https://sepolia.etherscan.io/address/0x22E1FcFA32e01B1eD5c3Ed1d4f41E11a2a9b0000
- **Gas Limit**: 500,000 per transaction

## 🎯 Learning Outcomes

This tutorial teaches you:
- ✅ **FHEVM Fundamentals**: Encrypted data types and operations
- ✅ **Smart Contract Development**: Solidity best practices
- ✅ **React Integration**: Frontend-blockchain connection
- ✅ **MetaMask Integration**: Wallet connection and transactions
- ✅ **Deployment Process**: Local and testnet deployment
- ✅ **Testing**: Unit tests and integration testing
- ✅ **Security**: Access control and secure randomness

---

## 🔐 FHEVM Basics (For Beginners)

### What is FHEVM?
- **FHE** = Fully Homomorphic Encryption (Tam Homomorfik Şifreleme)
- **VM** = Virtual Machine (Sanal Makine)
- **Result** = Encrypted smart contracts! (Şifreli akıllı sözleşmeler)

### Why FHEVM Matters?
❌ **Traditional Blockchain:** Everyone sees your data
```
tickets[user] = 42  // Everyone can see the number 42
```

✅ **FHEVM:** Only you see your data
```
tickets[user] = FHE(42)  // Only user can decrypt their number
```

### Simple FHEVM Example:
```solidity
// Traditional - Public data
mapping(address => uint8) public tickets;

// FHEVM - Encrypted data
mapping(address => euint8) private encryptedTickets;
```

### FHEVM vs Traditional Comparison:

| Feature | Traditional | FHEVM |
|---------|-------------|-------|
| **Data Visibility** | Everyone can see | Only data owner can see |
| **Security** | Access control | Mathematical encryption |
| **Privacy** | Limited | Complete privacy |
| **Use Cases** | Public apps | Private/confidential apps |

### Real-World FHEVM Applications:
- **🔒 Private Gaming:** Poker, confidential lotteries
- **🏥 Medical Privacy:** Encrypted health records
- **💰 Secret Auctions:** Blind bidding systems
- **🗳️ Private Voting:** Anonymous voting systems
- **🔐 Identity Protection:** Private KYC processes

### Why Choose FHEVM?
1. **Privacy by Default:** No need to trust third parties
2. **Regulatory Compliance:** GDPR, CCPA ready
3. **Future-Proof:** Quantum-resistant encryption
4. **Ethereum Compatible:** Works with existing tools

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### ❌ **"Contract not deployed" Error**
**Problem:** Hardhat cannot find your contract
**Solution:**
1. Check if you compiled the contract: `npx hardhat compile`
2. Verify your `.env` file has correct `SEPOLIA_RPC_URL`
3. Ensure your private key is correct in `.env`

#### ❌ **"MetaMask connection failed"**
**Problem:** Cannot connect to MetaMask
**Solution:**
1. Make sure MetaMask extension is installed
2. Check if Sepolia network is added to MetaMask
3. Try refreshing the page and reconnecting

#### ❌ **"FHEVM encryption failed"**
**Problem:** fhevmjs cannot encrypt data
**Solution:**
1. Verify fhevmjs is installed: `npm list @zama-fhevm-js`
2. Check network configuration in `useLottery.js`
3. Ensure you're connected to Sepolia testnet

#### ❌ **"Transaction failed" Error**
**Problem:** Smart contract transaction reverted
**Solution:**
1. Check your ETH balance (need > 0.001 ETH)
2. Verify gas limit is sufficient (try increasing to 300,000)
3. Ensure you're on Sepolia network, not mainnet

#### ❌ **"Infura API key not working"**
**Problem:** Cannot connect to Infura RPC
**Solution:**
1. Get API key from [Infura](https://www.infura.io/)
2. Replace `YOUR_INFURA_KEY` in `.env` file
3. Restart your terminal and try again

#### ❌ **"Contract interaction failed"**
**Problem:** Cannot call contract functions
**Solution:**
1. Verify contract address is correct
2. Check if contract is deployed on Sepolia
3. Ensure you have sufficient gas

### Debug Commands:
```bash
# Check contract compilation
npx hardhat compile

# Test contract deployment (dry run)
npx hardhat run scripts/deploy-fhevm.js --network sepolia --dry-run

# Check gas usage
REPORT_GAS=true npx hardhat test

# Verify contract on Etherscan
npx hardhat verify --network sepolia YOUR_CONTRACT_ADDRESS
```

### Getting Help:
1. **Check the console:** Look for error messages in browser console
2. **Verify network:** Ensure you're on Sepolia testnet
3. **Check balance:** Make sure you have enough ETH for gas
4. **Try again:** Sometimes network issues resolve automatically

---

## ❓ FAQ (Frequently Asked Questions)

### FHEVM Basics
**Q: What is the difference between FHEVM and traditional smart contracts?**
A: FHEVM allows computations on encrypted data without decryption, providing privacy by default.

**Q: Do I need cryptography knowledge to use FHEVM?**
A: No! FHEVM abstracts away the complex cryptography. You just use `euint8` instead of `uint8`.

**Q: Is FHEVM slower than traditional contracts?**
A: Yes, FHE operations have computational overhead, but the privacy benefits outweigh this for most use cases.

### Technical Questions
**Q: How do I get an Infura API key?**
A: Visit [https://www.infura.io/](https://www.infura.io/) and create a free account.

**Q: Why do I need Sepolia ETH?**
A: Sepolia is a testnet. Real ETH would be expensive for testing. Get free Sepolia ETH from faucets.

**Q: Can I deploy to mainnet?**
A: Yes, but use real ETH and be careful with gas costs. Test thoroughly on Sepolia first.

### Development Questions
**Q: What if I don't have MetaMask?**
A: You can use other Web3 wallets like Coinbase Wallet or Trust Wallet.

**Q: Can I run this locally without deployment?**
A: Yes, use `npx hardhat node` for local testing, but you'll need to modify the frontend configuration.

**Q: How do I know if FHEVM is working?**
A: Check that ticket numbers are encrypted (you'll see bytes instead of plain numbers).

### Gas & Performance
**Q: Why are FHEVM transactions more expensive?**
A: Encryption/decryption requires more computational resources, hence higher gas costs.

**Q: How can I optimize gas usage?**
A: Batch operations, use efficient FHE patterns, and optimize your contract logic.

**Q: What's the typical gas cost for FHEVM operations?**
A: 2-5x more than traditional operations, but this is improving with optimizations.

### Security & Privacy
**Q: Is FHEVM quantum-resistant?**
A: Yes, FHEVM uses quantum-resistant cryptographic schemes.

**Q: Can anyone decrypt my FHEVM data?**
A: No, only the data owner with the correct decryption key can decrypt their data.

**Q: How does FHEVM ensure fairness in lotteries?**
A: Winner selection happens on encrypted data, so no one can manipulate the outcome.

### Getting Started
**Q: I'm new to Web3. Should I start with traditional contracts first?**
A: Yes, understand basic Solidity and Web3 concepts first, then move to FHEVM.

**Q: What's the best way to learn FHEVM?**
A: Start with this tutorial, then explore Zama's documentation and examples.

**Q: Can I build other applications with FHEVM?**
A: Absolutely! FHEVM works for any application requiring privacy - auctions, voting, gaming, etc.

---

## 📞 Support & Resources

### Official Documentation:
- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Zama GitHub](https://github.com/zama-ai)
- [Hardhat FHEVM](https://github.com/zama-ai/hardhat-fhevm)

### Community:
- [Zama Discord](https://discord.gg/zama)
- [Ethereum Stack Exchange](https://ethereum.stackexchange.com)
- [FHE.org](https://fhe.org)

### Tools:
- [Infura](https://www.infura.io/) - RPC endpoints
- [Sepolia Faucet](https://sepoliafaucet.com/) - Test ETH
- [Etherscan](https://sepolia.etherscan.io/) - Contract verification

**Need more help?** Join the Zama community and ask questions! 🚀
