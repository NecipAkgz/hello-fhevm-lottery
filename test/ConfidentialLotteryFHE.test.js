import chai from "chai";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import hardhat from "hardhat";

const { expect } = chai;
const { ethers } = hardhat;
const hre = hardhat;

// Deploy fixture for testing - sets up the lottery contract and test accounts
// Creates a ConfidentialLotteryFHE contract instance with 5 test signers (admin, alice, bob, charlie, dave)
// Also initializes the FHEVM coprocessor for encrypted computations
async function deployLotteryFixture() {
  const [admin, alice, bob, charlie, dave] = await ethers.getSigners();
  const factory = await ethers.getContractFactory("ConfidentialLotteryFHE");
  const contract = await factory.connect(admin).deploy();
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  await hre.fhevm.assertCoprocessorInitialized(contract, "ConfidentialLotteryFHE");

  return { contract, contractAddress, admin, alice, bob, charlie, dave };
}

// Encrypts a ticket value using FHE (Fully Homomorphic Encryption)
// Creates an encrypted input for the specified contract and signer, adds the ticket value,
// then encrypts it and returns the encryption handle and proof for use in transactions
async function encryptTicket(contractAddress, signer, value) {
  const input = hre.fhevm.createEncryptedInput(contractAddress, signer.address);
  input.add8(value);
  const encrypted = await input.encrypt();
  return { handle: encrypted.handles[0], proof: encrypted.inputProof };
}

// Helper function to buy a lottery ticket with encrypted value
// Encrypts the ticket value, submits the buyTicket transaction with correct price,
// waits for confirmation, and returns the encryption artifacts
async function buyTicket(contract, contractAddress, signer, ticketValue, ticketPrice) {
  const { handle, proof } = await encryptTicket(contractAddress, signer, ticketValue);
  const tx = await contract.connect(signer).buyTicket(handle, proof, { value: ticketPrice });
  await tx.wait();
  return { handle, proof };
}

describe("ConfidentialLotteryFHE", function () {
  // Test 1: Verifies that users can buy encrypted tickets exactly once per round
  // and that the contract properly tracks the initial timestamp when first ticket is bought
  it("allows users to buy encrypted tickets exactly once and tracks initial timestamp", async function () {
    const { contract, contractAddress, alice } = await deployLotteryFixture();
    const ticketPrice = await contract.ticketPrice();

    const { handle, proof } = await encryptTicket(contractAddress, alice, 42);
    const tx = await contract.connect(alice).buyTicket(handle, proof, { value: ticketPrice });
    const receipt = await tx.wait();

    expect(await contract.getParticipantCount()).to.equal(1n);
    const lastDrawTime = await contract.lastDrawTime();
    const block = await ethers.provider.getBlock(receipt.blockNumber);
    expect(lastDrawTime).to.equal(BigInt(block.timestamp));

    const second = await encryptTicket(contractAddress, alice, 7);
    await expect(
      contract.connect(alice).buyTicket(second.handle, second.proof, { value: ticketPrice }),
    ).to.not.be.reverted;
    expect(await contract.getParticipantCount()).to.equal(1n);

    await expect(
      contract.connect(alice).buyTicket(second.handle, second.proof, { value: ticketPrice - 1n }),
    ).to.be.revertedWith("Incorrect ticket price");
  });

  // Test 2: Ensures that winner drawing is prevented until all requirements are met
  // Tests: no participants scenario, insufficient participants, unauthorized access, and time restrictions
  it("prevents drawing before requirements are met", async function () {
    const { contract, contractAddress, admin, alice, bob } = await deployLotteryFixture();
    await expect(contract.connect(admin).drawWinner()).to.be.revertedWith("No participants");

    const ticketPrice = await contract.ticketPrice();
    await buyTicket(contract, contractAddress, alice, 11, ticketPrice);
    await buyTicket(contract, contractAddress, bob, 22, ticketPrice);

    await expect(contract.connect(alice).drawWinner()).to.be.revertedWith("Draw not available yet or not admin");

    await time.increase(601);
    await expect(contract.connect(alice).drawWinner()).to.not.be.reverted;
  });

  // Test 3: Comprehensive end-to-end test that validates the complete lottery lifecycle
  // Tests: ticket purchases, winner selection, prize claiming, balance transfers, and state reset
  it("runs a full round where the winner claims the prize and state resets", async function () {
    const { contract, contractAddress, admin, alice, bob, charlie, dave } = await deployLotteryFixture();
    const ticketPrice = await contract.ticketPrice();

    await buyTicket(contract, contractAddress, alice, 10, ticketPrice);
    await buyTicket(contract, contractAddress, bob, 20, ticketPrice);
    await buyTicket(contract, contractAddress, charlie, 30, ticketPrice);
    await buyTicket(contract, contractAddress, dave, 40, ticketPrice);

    const drawTx = await contract.connect(admin).drawWinner();
    await drawTx.wait();
    expect(await contract.drawPending()).to.equal(true);

    await hre.fhevm.awaitDecryptionOracle();

    expect(await contract.drawPending()).to.equal(false);
    expect(await contract.isDrawn()).to.equal(true);

    const winnerAddress = await contract.winner();
    expect([alice.address, bob.address, charlie.address, dave.address]).to.include(winnerAddress);

    const participantsPrize = ticketPrice * 4n;
    const round = await contract.getPastRound(0);
    expect(round[0]).to.equal(winnerAddress);
    expect(round[1]).to.equal(participantsPrize);
    expect(round[3]).to.equal(false);

    const winnerSigner = [alice, bob, charlie, dave].find((signer) => signer.address === winnerAddress);
    const balanceBefore = await ethers.provider.getBalance(winnerSigner.address);
    const contractBalanceBefore = await ethers.provider.getBalance(contractAddress);
    expect(contractBalanceBefore).to.equal(participantsPrize);

    const claimTx = await contract.connect(winnerSigner).claimPrize();
    await claimTx.wait();

    const balanceAfter = await ethers.provider.getBalance(winnerSigner.address);
    const contractBalanceAfter = await ethers.provider.getBalance(contractAddress);
    expect(balanceAfter).to.be.greaterThan(balanceBefore);
    expect(contractBalanceAfter).to.equal(0n);

    const updatedRound = await contract.getPastRound(0);
    expect(updatedRound[3]).to.equal(true);

    await expect(contract.startNewRound()).to.not.be.reverted;
    expect(await contract.isDrawn()).to.equal(false);
    expect(await contract.winner()).to.equal(ethers.ZeroAddress);
    expect(await contract.getParticipantCount()).to.equal(0n);
  });

  // Test 4: Validates that past rounds are properly recorded and winners can claim prizes later
  // Tests the persistence of round data across new rounds and delayed prize claiming
  it("records past rounds so winners can claim later", async function () {
    const { contract, contractAddress, admin, alice, bob, charlie, dave } = await deployLotteryFixture();
    const ticketPrice = await contract.ticketPrice();

    await buyTicket(contract, contractAddress, alice, 1, ticketPrice);
    await buyTicket(contract, contractAddress, bob, 2, ticketPrice);
    await buyTicket(contract, contractAddress, charlie, 3, ticketPrice);
    await buyTicket(contract, contractAddress, dave, 4, ticketPrice);

    const firstDrawTx = await contract.connect(admin).drawWinner();
    await firstDrawTx.wait();
    await hre.fhevm.awaitDecryptionOracle();

    const firstRound = await contract.getPastRound(0);
    const firstWinnerAddress = firstRound[0];
    const firstPrize = firstRound[1];
    const firstWinnerSigner = [alice, bob, charlie, dave].find((signer) => signer.address === firstWinnerAddress);
    expect(firstWinnerSigner).to.not.equal(undefined);

    await contract.startNewRound();

    await buyTicket(contract, contractAddress, alice, 5, ticketPrice);
    await buyTicket(contract, contractAddress, bob, 6, ticketPrice);

    const balanceBefore = await ethers.provider.getBalance(firstWinnerSigner.address);
    const contractBalanceBefore = await ethers.provider.getBalance(contractAddress);

    const claimPastTx = await contract.connect(firstWinnerSigner).claimPastPrize(0);
    await claimPastTx.wait();

    const balanceAfter = await ethers.provider.getBalance(firstWinnerSigner.address);
    const contractBalanceAfter = await ethers.provider.getBalance(contractAddress);

    expect(balanceAfter).to.be.greaterThan(balanceBefore);
    expect(contractBalanceAfter).to.equal(contractBalanceBefore - firstPrize);

    const updatedFirstRound = await contract.getPastRound(0);
    expect(updatedFirstRound[3]).to.equal(true);
  });

  // Test 5: Security test to ensure only winners can claim prizes
  // Verifies that non-winning participants cannot claim the current round's prize
  it("prevents non-winners from claiming the current prize", async function () {
    const { contract, contractAddress, admin, alice, bob, charlie, dave } = await deployLotteryFixture();
    const ticketPrice = await contract.ticketPrice();

    await buyTicket(contract, contractAddress, alice, 12, ticketPrice);
    await buyTicket(contract, contractAddress, bob, 13, ticketPrice);
    await buyTicket(contract, contractAddress, charlie, 14, ticketPrice);
    await buyTicket(contract, contractAddress, dave, 15, ticketPrice);

    const drawTx = await contract.connect(admin).drawWinner();
    await drawTx.wait();
    await hre.fhevm.awaitDecryptionOracle();

    const winnerAddress = await contract.winner();
    const losers = [alice, bob, charlie, dave].filter((signer) => signer.address !== winnerAddress);
    expect(losers.length).to.be.greaterThan(0);

    for (const loser of losers) {
      await expect(contract.connect(loser).claimPrize()).to.be.revertedWith("Not the winner");
    }
  });

  // Test 6: Ensures that new rounds cannot be started while current draw is incomplete
  // Tests state management and prevents premature round transitions during FHE decryption process
  it("rejects starting a new round while the draw is incomplete", async function () {
    const { contract, contractAddress, admin, alice, bob } = await deployLotteryFixture();
    const ticketPrice = await contract.ticketPrice();

    await buyTicket(contract, contractAddress, alice, 21, ticketPrice);
    await buyTicket(contract, contractAddress, bob, 22, ticketPrice);

    await expect(contract.startNewRound()).to.be.revertedWith("Lottery not drawn yet");

    const drawTx = await contract.connect(admin).drawWinner();
    await drawTx.wait();

    await expect(contract.startNewRound()).to.be.revertedWith("Lottery not drawn yet");

    await hre.fhevm.awaitDecryptionOracle();

    await expect(contract.startNewRound()).to.not.be.reverted;
  });

  // Test 7: Security and integrity test for past prize claiming system
  // Tests: unauthorized access prevention, duplicate claim blocking, and proper prize distribution
  it("blocks unauthorized or duplicate past prize claims", async function () {
    const { contract, contractAddress, admin, alice, bob, charlie, dave } = await deployLotteryFixture();
    const ticketPrice = await contract.ticketPrice();

    await buyTicket(contract, contractAddress, alice, 31, ticketPrice);
    await buyTicket(contract, contractAddress, bob, 32, ticketPrice);
    await buyTicket(contract, contractAddress, charlie, 33, ticketPrice);
    await buyTicket(contract, contractAddress, dave, 34, ticketPrice);

    const drawTx = await contract.connect(admin).drawWinner();
    await drawTx.wait();
    await hre.fhevm.awaitDecryptionOracle();

    const firstRound = await contract.getPastRound(0);
    const winnerAddress = firstRound[0];
    const prizeAmount = firstRound[1];

    const nonWinner = [alice, bob, charlie, dave].find((signer) => signer.address !== winnerAddress);
    if (!nonWinner) {
      throw new Error("Expected at least one non-winner");
    }
    await expect(contract.connect(nonWinner).claimPastPrize(0)).to.be.revertedWith("Not the winner of this round");

    const winnerSigner = [alice, bob, charlie, dave].find((signer) => signer.address === winnerAddress);
    if (!winnerSigner) {
      throw new Error("Expected winner signer to be present");
    }

    const contractBalanceBefore = await ethers.provider.getBalance(contractAddress);
    expect(contractBalanceBefore).to.be.greaterThanOrEqual(prizeAmount);

    await expect(contract.connect(winnerSigner).claimPastPrize(0)).to.not.be.reverted;

    await expect(contract.connect(winnerSigner).claimPastPrize(0)).to.be.revertedWith("Prize already claimed");
  });
});
