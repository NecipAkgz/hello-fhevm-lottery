// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint8} from "@fhevm/solidity/lib/FHE.sol";
import {externalEuint8} from "encrypted-types/EncryptedTypes.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

// Confidential Lottery contract using Fully Homomorphic Encryption (FHE)
// This contract allows users to participate in a lottery with encrypted ticket numbers
// The winner selection process maintains confidentiality using FHE operations
contract ConfidentialLotteryFHE is SepoliaConfig {
    struct PastRound {
        address winner;
        uint256 prize;
        uint256 drawTime;
        bool claimed;
    }

    mapping(address => euint8) private encryptedTickets;
    address public winner;
    bool public isDrawn;
    bool public drawPending;
    uint256 public ticketPrice = 0.0001 ether;
    address[] public participants;
    address public admin;
    uint256 public lastDrawTime;
    PastRound[] public pastRounds;

    // Emitted when a user successfully purchases a lottery ticket
    event TicketPurchased(
        address indexed buyer,
        externalEuint8 ticketHandle,
        bytes encryptedTicketProof
    );
    // Emitted when a winner is selected and their encrypted winning number is revealed
    event WinnerDrawn(address indexed winner, bytes encryptedWinningNumber);
    // Emitted when a decryption request is made for the random winner index
    event WinnerDecryptionRequested(
        uint256 indexed requestID,
        bytes32 randomIndexHandle
    );
    // Emitted when a winner claims their prize
    event PrizeClaimed(address indexed winner, uint256 amount);
    // Emitted when the lottery is reset for a new round
    event LotteryReset(address indexed admin, uint256 timestamp);

    // Constructor: Sets the contract deployer as the administrator
    constructor() {
        admin = msg.sender;
    }

    // Allows a user to purchase a lottery ticket with an encrypted ticket number
    // The ticket number remains encrypted throughout the process for confidentiality
    // @param encryptedTicketHandle: Handle to the externally encrypted ticket
    // @param encryptedTicketProof: Proof for the encrypted ticket verification
    function buyTicket(
        externalEuint8 encryptedTicketHandle,
        bytes calldata encryptedTicketProof
    ) external payable {
        require(msg.value == ticketPrice, "Incorrect ticket price");
        require(!isDrawn, "Lottery already drawn");
        require(!drawPending, "Draw in progress");

        // Verify the externally encrypted ticket and store the resulting ciphertext handle
        encryptedTickets[msg.sender] = FHE.fromExternal(
            encryptedTicketHandle,
            encryptedTicketProof
        );

        // Add participant to list
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

        // Start countdown when first participant joins
        if (participants.length == 1 && lastDrawTime == 0) {
            lastDrawTime = block.timestamp;
        }

        emit TicketPurchased(
            msg.sender,
            encryptedTicketHandle,
            encryptedTicketProof
        );
    }

    // Private variables to track pending decryption requests
    uint256 private pendingRequestId;
    bytes32 private pendingRandomIndexHandle;

    // Initiates the winner selection process using FHE for random number generation
    // Generates an encrypted random index and requests its decryption from the FHE oracle
    // Can be called by admin or automatically after 10 minutes (600 seconds) from last draw/first participant
    function drawWinner() external {
        require(!isDrawn, "Lottery already drawn");
        require(!drawPending, "Draw in progress");
        require(participants.length > 0, "No participants");
        require(
            msg.sender == admin || (block.timestamp >= lastDrawTime + 600),
            "Draw not available yet or not admin"
        );
        require(
            participants.length <= type(uint8).max,
            "Too many participants"
        );

        euint8 randomIndexEncrypted = FHE.randEuint8(
            uint8(participants.length)
        );
        bytes32[] memory handles = new bytes32[](1);
        handles[0] = euint8.unwrap(randomIndexEncrypted);

        pendingRandomIndexHandle = handles[0];
        pendingRequestId = FHE.requestDecryption(
            handles,
            this.fulfillRandomIndex.selector
        );
        drawPending = true;
        lastDrawTime = block.timestamp;

        emit WinnerDecryptionRequested(
            pendingRequestId,
            pendingRandomIndexHandle
        );
    }

    // Callback function called by the FHE oracle with the decrypted random index
    // Selects the winner based on the decrypted random number and records the round
    // @param requestID: The ID of the decryption request
    // @param decryptedResult: The decrypted random index as bytes
    // @param decryptionProof: Proof of the decryption operation
    function fulfillRandomIndex(
        uint256 requestID,
        bytes memory decryptedResult,
        bytes memory decryptionProof
    ) external {
        require(drawPending, "No pending draw");
        require(requestID == pendingRequestId, "Unexpected request");

        FHE.checkSignatures(requestID, decryptedResult, decryptionProof);
        require(decryptedResult.length >= 32, "Invalid cleartext");

        uint256 randomIndex = uint256(bytes32(decryptedResult)) %
            participants.length;

        winner = participants[randomIndex];
        isDrawn = true;
        drawPending = false;
        lastDrawTime = block.timestamp;

        pastRounds.push(
            PastRound({
                winner: winner,
                prize: address(this).balance,
                drawTime: block.timestamp,
                claimed: false
            })
        );

        euint8 winningNumber = encryptedTickets[winner];
        bytes memory encryptedWinningNumber = abi.encodePacked(
            euint8.unwrap(winningNumber)
        );

        emit WinnerDrawn(winner, encryptedWinningNumber);
    }

    // Resets the lottery state to start a new round
    // Can be called by anyone after a winner has been drawn
    // Clears all participants and resets flags for the next lottery round
    function startNewRound() external {
        require(isDrawn, "Lottery not drawn yet");
        require(!drawPending, "Draw in progress");

        // Reset all state variables
        isDrawn = false;
        winner = address(0);
        lastDrawTime = block.timestamp;

        // Clear participants array
        delete participants;

        emit LotteryReset(msg.sender, block.timestamp);
    }

    // Allows the current winner to claim their prize from the most recent lottery round
    // Transfers the entire contract balance to the winner and marks the prize as claimed
    function claimPrize() external {
        require(isDrawn, "Lottery not drawn yet");
        require(!drawPending, "Draw in progress");
        require(msg.sender == winner, "Not the winner");

        uint256 prize = address(this).balance;
        require(prize > 0, "No prize to claim");

        payable(winner).transfer(prize);

        // Mark as claimed in past rounds
        if (pastRounds.length > 0) {
            pastRounds[pastRounds.length - 1].claimed = true;
        }

        emit PrizeClaimed(winner, prize);
    }

    // Allows winners to claim prizes from historical lottery rounds
    // @param _roundIndex: The index of the past round to claim the prize from
    function claimPastPrize(uint256 _roundIndex) external {
        require(_roundIndex < pastRounds.length, "Invalid round index");
        require(
            msg.sender == pastRounds[_roundIndex].winner,
            "Not the winner of this round"
        );
        require(!pastRounds[_roundIndex].claimed, "Prize already claimed");

        uint256 prize = pastRounds[_roundIndex].prize;
        require(prize > 0, "No prize to claim");

        pastRounds[_roundIndex].claimed = true;
        payable(msg.sender).transfer(prize);

        emit PrizeClaimed(msg.sender, prize);
    }

    // View Functions

    // Returns the encrypted ticket handle for the calling user (for demonstration purposes)
    function getMyTicket() external view returns (bytes memory) {
        euint8 ticket = encryptedTickets[msg.sender];
        return abi.encodePacked(euint8.unwrap(ticket));
    }

    // Returns the current balance of the contract (total prize pool)
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Returns the number of participants in the current lottery round
    function getParticipantCount() external view returns (uint256) {
        return participants.length;
    }

    // Returns the total number of past lottery rounds that have been completed
    function getPastRoundsLength() external view returns (uint256) {
        return pastRounds.length;
    }

    // Returns detailed information about a specific past lottery round
    // @param _roundIndex: The index of the past round to query
    // @return winner: Address of the winner
    // @return prize: Prize amount for that round
    // @return drawTime: Timestamp when the draw occurred
    // @return claimed: Whether the prize has been claimed
    function getPastRound(
        uint256 _roundIndex
    ) external view returns (address, uint256, uint256, bool) {
        require(_roundIndex < pastRounds.length, "Invalid round index");
        PastRound memory round = pastRounds[_roundIndex];
        return (round.winner, round.prize, round.drawTime, round.claimed);
    }
}
