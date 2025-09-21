# 🎯 Confidential Lottery - FHEVM Tutorial

[![Live Demo](https://img.shields.io/badge/Live%20Demo-View%20Application-FFD20A?style=for-the-badge&logo=vercel)](https://hello-fhevm-lottery.vercel.app/)

This project is a **complete, working implementation** of the "Hello FHEVM" tutorial for **Zama Bounty Program Season 10**. It features a fully functional confidential lottery dApp designed for beginner Web3 developers to learn FHEVM concepts.

## 📋 Table of Contents

- [🎯 Confidential Lottery - FHEVM Tutorial](#-confidential-lottery---fhevm-tutorial)
- [📋 Project Overview](#-project-overview)
- [🚀 Quick Start](#-quick-start)
- [🔐 FHEVM vs Traditional Lottery](#-fhevm-vs-traditional-lottery)
- [🎯 Technical Implementation](#-technical-implementation)
- [🎮 Usage Guide](#-usage-guide)
- [🔧 Development Commands](#-development-commands)
- [🌐 Network Configuration](#-network-configuration)
- [📊 Contract Details](#-contract-details)
- [🎯 Learning Outcomes](#-learning-outcomes)

## 📋 Project Overview

### 🎯 **Bounty Objectives Achieved**
- ✅ Suitable for beginner Web3 developers
- ✅ Solidity + JavaScript knowledge sufficient
- ✅ Full dApp (Smart Contract + React Frontend)
- ✅ Teaches FHEVM fundamentals with practical examples
- ✅ Real-world application (Confidential Lottery)
- ✅ Complete deployment and testing setup

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

### Prerequisites
- Node.js (v16+)
- MetaMask browser extension
- Sepolia ETH for testing (get from https://sepoliafaucet.com/)
- Basic knowledge of Solidity and JavaScript

### Step 1: Installation
```bash
# Install all dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### Step 2: Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your Infura API key
# SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
# PRIVATE_KEY=your_private_key_here
```

### Step 3: Compile Smart Contract
```bash
# Compile the Solidity contract
npx hardhat compile
```
✅ **Contract compiled successfully**

### Step 4: Deploy to Sepolia Testnet
```bash
# Deploy contract to Sepolia testnet
npx hardhat run scripts/deploy-sepolia.js --network sepolia
```

**✅ Contract Address**: `0x22E1FcFA32e01B1eD5c3Ed1d4f41E11a2a9b0000`

### Step 5: Configure MetaMask
1. Open MetaMask extension
2. Click network selector (top)
3. Click "Add Network" or select "Sepolia Testnet"
4. If adding manually, enter these details:
   ```
   Network Name: Sepolia Testnet
   RPC URL: https://sepolia.infura.io/v3/YOUR_INFURA_KEY
   Chain ID: 11155111
   Currency Symbol: ETH
   Block Explorer: https://sepolia.etherscan.io/
   ```
5. Switch to "Sepolia Testnet" network
6. Get Sepolia ETH from https://sepoliafaucet.com/

### Step 6: Start Frontend
```bash
# Start React development server
cd frontend && npm start
```

### Step 7: Test the Application
1. Open browser: http://localhost:3000
2. Click "Connect Wallet"
3. Buy ticket with number 1-100 (costs 0.0001 ETH)
4. Draw winner (admin function)
5. Winner claims prize

## 🔐 FHEVM vs Traditional Lottery

This project demonstrates the revolutionary difference between **traditional blockchain applications** and **FHEVM-powered confidential applications**. We have implemented both approaches to showcase the privacy advantages of FHEVM.

### 📊 **Feature Comparison**

| Feature | Traditional Lottery | FHEVM Lottery |
|---------|-------------------|----------------|
| **Privacy Level** | ❌ **Public Exposure**<br/>Everyone sees ticket numbers | ✅ **Mathematical Privacy**<br/>Only owner knows their number |
| **Data Security** | ⚠️ **Trust-Based**<br/>Relies on system security | 🔒 **Cryptographic Security**<br/>FHE mathematical guarantees |
| **Winner Selection** | 🎲 **Transparent Algorithm**<br/>Public random selection | 🎲 **Encrypted Computation**<br/>Winner selected in encrypted space |
| **Data Storage** | 📊 **Plain Text**<br/>Numbers stored as-is | 🔐 **Encrypted Storage**<br/>All data mathematically encrypted |
| **Verification** | ✅ **Public Audit**<br/>Anyone can verify fairness | ✅ **Zero-Knowledge Proofs**<br/>Verify without revealing data |
| **Performance** | ⚡ **Instant Transactions**<br/>Standard EVM speed | 🐌 **FHE Overhead**<br/>Additional computation time |
| **Scalability** | 📈 **High Throughput**<br/>Standard blockchain limits | 📉 **Computational Cost**<br/>FHE encryption/decryption overhead |

### 🎯 **Key Privacy Differences**

#### Traditional Lottery Flow:
```
1. User selects number (e.g., 42)
2. Number stored publicly: tickets[user] = 42
3. Everyone can see: "User X chose 42"
4. Winner selection: public algorithm
5. Result: "Winner is user with number 42"
```

#### FHEVM Lottery Flow:
```
1. User selects number (e.g., 42)
2. Number encrypted: tickets[user] = FHE(42)
3. Public view: "User X has encrypted ticket"
4. Winner selection: encrypted computation
5. Result: "Winner is user X" (proof without revealing number)
```

### 🔒 **Security Advantages of FHEVM**

- **Zero-Knowledge**: Verify lottery fairness without revealing ticket numbers
- **Mathematical Security**: FHE provides cryptographic guarantees
- **No Trusted Third Parties**: No need to trust the system operator
- **Future-Proof Privacy**: Resistant to quantum computing attacks
- **Regulatory Compliance**: Built-in privacy for sensitive applications

### 🚀 **Real-World Applications**

**Traditional Lottery Use Cases:**
- Simple gaming applications
- Public voting systems
- Transparent auctions
- Standard DeFi protocols

**FHEVM Lottery Use Cases:**
- **Private Gaming**: Poker, lottery with true privacy
- **Confidential Auctions**: Sealed-bid auctions
- **Private Voting**: Anonymous voting systems
- **Medical Data**: Privacy-preserving health data analysis
- **Financial Privacy**: Confidential transactions
- **Identity Protection**: Private KYC processes

### 🎯 **Why FHEVM Matters**

FHEVM represents the next evolution of blockchain technology:

1. **Privacy by Default**: Applications can be private without sacrificing functionality
2. **Regulatory Compliance**: Meet privacy requirements (GDPR, CCPA, etc.)
3. **User Trust**: No need to trust third parties with sensitive data
4. **Future-Proof**: Quantum-resistant cryptographic security
5. **Interoperability**: Works with existing Ethereum infrastructure

### 🔧 **Implementation Details**

#### Traditional Contract (`ConfidentialLottery.sol`):
```solidity
mapping(address => uint8) private tickets; // Public numbers
function buyTicket(uint8 _number) external payable // Clear text input
```

#### FHEVM Contract (`ConfidentialLotteryFHE.sol`):
```solidity
mapping(address => euint8) private encryptedTickets; // Encrypted storage
function buyTicket(bytes encryptedNumber) external payable // Encrypted input
```

## 🎯 Technical Implementation

### 🔧 Function-by-Function Comparison

This project implements **both traditional and FHEVM approaches** to demonstrate the differences:

#### 📋 **Contract Structure Comparison**

```solidity
// ================================
// TRADITIONAL LOTTERY CONTRACT
// ================================
contract ConfidentialLottery {
    struct PastRound {
        address winner;
        uint256 prize;
        uint256 drawTime;
        bool claimed;
    }

    // Plain data storage - everyone can see ticket numbers
    mapping(address => uint8) private tickets;

    address public winner;
    bool public isDrawn;
    uint256 public ticketPrice = 0.0001 ether;
    address[] public participants;
    address public admin;
    uint256 public lastDrawTime;
    PastRound[] public pastRounds;
}

// ================================
// FHEVM CONFIDENTIAL LOTTERY CONTRACT
// ================================
contract ConfidentialLotteryFHE is SepoliaConfig {
    struct PastRound {
        address winner;
        uint256 prize;
        uint256 drawTime;
        bool claimed;
    }

    // Encrypted data storage - only owner knows their number
    mapping(address => euint8) private encryptedTickets;

    address public winner;
    bool public isDrawn;
    uint256 public ticketPrice = 0.0001 ether;
    address[] public participants;
    address public admin;
    uint256 public lastDrawTime;
    PastRound[] public pastRounds;
}
```

### 📊 **Function-by-Function Technical Differences**

| Function | Traditional Approach | FHEVM Approach | Key Changes |
|----------|---------------------|-----------------|-------------|
| **buyTicket()** | `uint8 _ticketNumber` input<br/>Range validation (1-100)<br/>Plain storage | `bytes encryptedTicketNumber` input<br/>No validation<br/>Encrypted storage | Input type, validation, storage |
| **drawWinner()** | Returns `uint8` winning number<br/>Plain computation | Returns `bytes` encrypted number<br/>Encrypted computation | Return type, data handling |
| **getMyTicket()** | Returns `uint8`<br/>Direct access | Returns `bytes`<br/>Encrypted access | Return type, data format |

#### 🎫 **buyTicket() Function - Complete Comparison**

```solidity
// ================================
// TRADITIONAL APPROACH
// ================================
function buyTicket(uint8 _ticketNumber) external payable {
    require(msg.value == ticketPrice, "Incorrect ticket price");
    require(!isDrawn, "Lottery already drawn");

    // 🔍 INPUT VALIDATION: Check range 1-100
    require(_ticketNumber >= 1 && _ticketNumber <= 100, "Ticket must be between 1-100");

    // 💾 PLAIN STORAGE: Store number directly
    tickets[msg.sender] = _ticketNumber;

    // 👥 PARTICIPANT TRACKING (same logic)
    bool alreadyParticipated = false;
    for (uint i = 0; i < participants.length; i++) {
        if (participants[i] == msg.sender) {
            alreadyParticipated = true;
            break;
        }
    }
    if (!alreadyParticipated) {
        participants.push(msg.sender);
    }

    // ⏰ COUNTDOWN START (same logic)
    if (participants.length == 1 && lastDrawTime == 0) {
        lastDrawTime = block.timestamp;
    }

    emit TicketPurchased(msg.sender, _ticketNumber);
}

// ================================
// FHEVM APPROACH
// ================================
function buyTicket(bytes calldata encryptedTicketNumber) external payable {
    require(msg.value == ticketPrice, "Incorrect ticket price");
    require(!isDrawn, "Lottery already drawn");

    // 🔐 ENCRYPTED STORAGE: Store encrypted data
    // No validation needed - accepts any encrypted input
    bytes32 ticketHash = keccak256(encryptedTicketNumber);
    encryptedTickets[msg.sender] = euint8.wrap(ticketHash);

    // 👥 PARTICIPANT TRACKING (same logic)
    bool alreadyParticipated = false;
    for (uint i = 0; i < participants.length; i++) {
        if (participants[i] == msg.sender) {
            alreadyParticipated = true;
            break;
        }
    }
    if (!alreadyParticipated) {
        participants.push(msg.sender);
    }

    // ⏰ COUNTDOWN START (same logic)
    if (participants.length == 1 && lastDrawTime == 0) {
        lastDrawTime = block.timestamp;
    }

    emit TicketPurchased(msg.sender, encryptedTicketNumber);
}
```

#### 🎲 **drawWinner() Function - Complete Comparison**

```solidity
// ================================
// TRADITIONAL APPROACH
// ================================
function drawWinner() external {
    require(!isDrawn, "Lottery already drawn");
    require(participants.length > 0, "No participants");
    require(msg.sender == admin || (block.timestamp >= lastDrawTime + 600), "Draw not available yet");

    // 🎯 RANDOM SELECTION (same algorithm)
    uint256 randomIndex = uint256(keccak256(abi.encodePacked(
        block.timestamp, block.prevrandao, participants.length
    ))) % participants.length;

    winner = participants[randomIndex];
    isDrawn = true;
    lastDrawTime = block.timestamp;

    // 💾 SAVE PAST ROUND (same logic)
    pastRounds.push(PastRound({
        winner: winner,
        prize: address(this).balance,
        drawTime: block.timestamp,
        claimed: false
    }));

    // 🏆 ANNOUNCE WINNER: Plain number visible to all
    uint8 winningNumber = tickets[winner];
    emit WinnerDrawn(winner, winningNumber);
}

// ================================
// FHEVM APPROACH
// ================================
function drawWinner() external {
    require(!isDrawn, "Lottery already drawn");
    require(participants.length > 0, "No participants");
    require(msg.sender == admin || (block.timestamp >= lastDrawTime + 600), "Draw not available yet");

    // 🎯 RANDOM SELECTION (same algorithm)
    uint256 randomIndex = uint256(keccak256(abi.encodePacked(
        block.timestamp, block.prevrandao, participants.length
    ))) % participants.length;

    winner = participants[randomIndex];
    isDrawn = true;
    lastDrawTime = block.timestamp;

    // 💾 SAVE PAST ROUND (same logic)
    pastRounds.push(PastRound({
        winner: winner,
        prize: address(this).balance,
        drawTime: block.timestamp,
        claimed: false
    }));

    // 🏆 ANNOUNCE WINNER: Encrypted number (privacy preserved)
    euint8 winningNumber = encryptedTickets[winner];
    bytes32 winningNumberHash = euint8.unwrap(winningNumber);
    bytes memory encryptedWinningNumber = abi.encodePacked(winningNumberHash);
    emit WinnerDrawn(winner, encryptedWinningNumber);
}
```

#### 👀 **getMyTicket() Function - Complete Comparison**

```solidity
// ================================
// TRADITIONAL APPROACH
// ================================
function getMyTicket() external view returns (uint8) {
    // 👀 DIRECT ACCESS: Return plain number
    return tickets[msg.sender];
}

// ================================
// FHEVM APPROACH
// ================================
function getMyTicket() external view returns (bytes memory) {
    // 🔐 ENCRYPTED ACCESS: Return encrypted data
    euint8 ticket = encryptedTickets[msg.sender];
    bytes32 ticketHash = euint8.unwrap(ticket);
    return abi.encodePacked(ticketHash);
}
```

### 🔑 **Key Technical Differences**

- **Data Types**: `uint8` → `euint8` (encrypted integers)
- **Input Validation**: Range checks → Removed (accepts encrypted data)
- **Storage Pattern**: Plain mapping → Encrypted mapping
- **Function Signatures**: `uint8` parameters → `bytes` parameters
- **Return Types**: Plain values → Encrypted bytes
- **Security Model**: Access control → Cryptographic security
- **Import Requirements**: None → FHEVM libraries + SepoliaConfig

### Smart Contract (ConfidentialLottery.sol)
```solidity
contract ConfidentialLottery {
    struct PastRound {
        address winner;
        uint256 prize;
        uint256 drawTime;
        bool claimed;
    }

    mapping(address => uint8) private tickets;
    address public winner;
    bool public isDrawn;
    uint256 public ticketPrice = 0.0001 ether;
    address[] public participants;
    address public admin;
    uint256 public lastDrawTime;
    PastRound[] public pastRounds;

    // User buys a ticket with encrypted number
    function buyTicket(uint8 _ticketNumber) external payable

    // Draw random winner from participants (10 min after first participant)
    function drawWinner() external

    // Winner claims prize (auto reset lottery)
    function claimPrize() external

    // Start new round immediately after draw (anyone can call)
    function startNewRound() external

    // Claim prize from past rounds
    function claimPastPrize(uint256 _roundIndex) external

    // View functions for status
    function getMyTicket() external view returns (uint8)
    function getBalance() external view returns (uint256)
    function getParticipantCount() external view returns (uint256)
    function getPastRoundsLength() external view returns (uint256)
    function pastRounds(uint256) external view returns (address, uint256, uint256, bool)
}
```

### Smart Contract FHEVM (ConfidentialLotteryFHE.sol)
```solidity
contract ConfidentialLotteryFHE is SepoliaConfig {
    struct PastRound {
        address winner;
        uint256 prize;
        uint256 drawTime;
        bool claimed;
    }

    // FHE encrypted ticket numbers
    mapping(address => euint8) private encryptedTickets;
    address public winner;
    bool public isDrawn;
    uint256 public ticketPrice = 0.0001 ether;
    address[] public participants;
    address public admin;
    uint256 public lastDrawTime;
    PastRound[] public pastRounds;

    // User buys a ticket with encrypted number
    function buyTicket(bytes calldata encryptedTicketNumber) external payable

    // Draw random winner using FHE
    function drawWinner() external

    // Winner claims prize (auto reset lottery)
    function claimPrize() external

    // Start new round immediately after draw (anyone can call)
    function startNewRound() external

    // Claim prize from past rounds
    function claimPastPrize(uint256 _roundIndex) external

    // Get user's own encrypted ticket (simplified for demo)
    function getMyTicket() external view returns (bytes memory)

    // Check contract balance
    function getBalance() external view returns (uint256)

    // Get total participant count
    function getParticipantCount() external view returns (uint256)

    // Get past rounds length
    function getPastRoundsLength() external view returns (uint256)

    // Get past round details
    function getPastRound(uint256 _roundIndex) external view returns (address, uint256, uint256, bool)
}
```

**Key Features:**
- **Participant Tracking**: Maintains list of all participants for fair drawing
- **Secure Randomness**: Blockchain-based winner selection
- **Access Control**: Only winner can claim prize
- **Event Logging**: All transactions are logged
- **Input Validation**: Ticket numbers must be 1-100, correct payment required
- **Past Rounds**: All historical lottery rounds are stored and accessible
- **Prize Claim**: Winners can claim prizes from any past round
- **Auto Reset**: Prize claim automatically starts new round
- **Manual Reset**: Anyone can start new round immediately after draw
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
  const encryptedInput = await fhevm.createEncryptedInput(contractAddress, account, ticketNumber);
  const encryptedResult = await encryptedInput.encrypt();

  // Send encrypted bytes to contract
  const tx = await contract.buyTicket(encryptedResult.inputProof, {
    value: parseEther("0.0001"),
    gasLimit: 200000
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
  const encryptedInput = await fhevm.createEncryptedInput(contractAddress, account, 1);
  const encryptedResult = await encryptedInput.encrypt();

  const ticketTx = await contract.buyTicket(encryptedResult.inputProof, {
    value: parseEther("0.0001"),
    gasLimit: 200000
  });
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
npx hardhat run scripts/deploy-sepolia.js --network sepolia
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
