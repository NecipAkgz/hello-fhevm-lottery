// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint8} from "@fhevm/solidity/lib/FHE.sol";
import {externalEuint8} from "encrypted-types/EncryptedTypes.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

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
    bool public drawPending;
    uint256 public ticketPrice = 0.0001 ether;
    address[] public participants;
    address public admin;
    uint256 public lastDrawTime;
    PastRound[] public pastRounds;

    event TicketPurchased(
        address indexed buyer,
        externalEuint8 ticketHandle,
        bytes encryptedTicketProof
    );
    event WinnerDrawn(address indexed winner, bytes encryptedWinningNumber);
    event WinnerDecryptionRequested(uint256 indexed requestID, bytes32 randomIndexHandle);
    event PrizeClaimed(address indexed winner, uint256 amount);
    event LotteryReset(address indexed admin, uint256 timestamp);

    constructor() {
        admin = msg.sender;
    }

    // User buys a ticket with encrypted number
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

    // Draw random winner using FHE
    uint256 private pendingRequestId;
    bytes32 private pendingRandomIndexHandle;

    function drawWinner() external {
        require(!isDrawn, "Lottery already drawn");
        require(!drawPending, "Draw in progress");
        require(participants.length > 0, "No participants");
        require(
            msg.sender == admin || (block.timestamp >= lastDrawTime + 600),
            "Draw not available yet or not admin"
        );
        require(participants.length <= type(uint8).max, "Too many participants");

        euint8 randomIndexEncrypted = FHE.randEuint8(uint8(participants.length));
        bytes32[] memory handles = new bytes32[](1);
        handles[0] = euint8.unwrap(randomIndexEncrypted);

        pendingRandomIndexHandle = handles[0];
        pendingRequestId = FHE.requestDecryption(handles, this.fulfillRandomIndex.selector);
        drawPending = true;
        lastDrawTime = block.timestamp;

        emit WinnerDecryptionRequested(pendingRequestId, pendingRandomIndexHandle);
    }

    function fulfillRandomIndex(
        uint256 requestID,
        bytes memory decryptedResult,
        bytes memory decryptionProof
    ) external {
        require(drawPending, "No pending draw");
        require(requestID == pendingRequestId, "Unexpected request");

        FHE.checkSignatures(requestID, decryptedResult, decryptionProof);
        require(decryptedResult.length >= 32, "Invalid cleartext");

        uint256 randomIndex = uint256(bytes32(decryptedResult)) % participants.length;

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

    // Start new round (anyone can call after draw)
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

    // Winner claims prize
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

    // Claim prize from past rounds
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

    // Get user's own encrypted ticket (simplified for demo)
    function getMyTicket() external view returns (bytes memory) {
        euint8 ticket = encryptedTickets[msg.sender];
        return abi.encodePacked(euint8.unwrap(ticket));
    }

    // Check contract balance
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Get total participant count
    function getParticipantCount() external view returns (uint256) {
        return participants.length;
    }

    // Get past rounds length
    function getPastRoundsLength() external view returns (uint256) {
        return pastRounds.length;
    }

    // Get past round details
    function getPastRound(
        uint256 _roundIndex
    ) external view returns (address, uint256, uint256, bool) {
        require(_roundIndex < pastRounds.length, "Invalid round index");
        PastRound memory round = pastRounds[_roundIndex];
        return (round.winner, round.prize, round.drawTime, round.claimed);
    }
}
