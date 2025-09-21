// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

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

    event TicketPurchased(address indexed buyer, uint8 ticket);
    event WinnerDrawn(address indexed winner, uint8 winningNumber);
    event PrizeClaimed(address indexed winner, uint256 amount);
    event LotteryReset(address indexed admin, uint256 timestamp);

    constructor() {
        admin = msg.sender;
    }

    // User buys a ticket
    function buyTicket(uint8 _ticketNumber) external payable {
        require(msg.value == ticketPrice, "Incorrect ticket price");
        require(!isDrawn, "Lottery already drawn");
        require(
            _ticketNumber >= 1 && _ticketNumber <= 100,
            "Ticket must be between 1-100"
        );

        tickets[msg.sender] = _ticketNumber;

        // Add participant to list (to keep winner secret until drawing)
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

        emit TicketPurchased(msg.sender, _ticketNumber);
    }

    // Draw random winner
    function drawWinner() external {
        require(!isDrawn, "Lottery already drawn");
        require(participants.length > 0, "No participants");
        require(
            msg.sender == admin || (block.timestamp >= lastDrawTime + 600),
            "Draw not available yet or not admin"
        );

        // Select random winner
        uint256 randomIndex = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    participants.length
                )
            )
        ) % participants.length;
        winner = participants[randomIndex];

        isDrawn = true;
        lastDrawTime = block.timestamp;

        // Save to past rounds
        pastRounds.push(
            PastRound({
                winner: winner,
                prize: address(this).balance,
                drawTime: block.timestamp,
                claimed: false
            })
        );

        // Announce winner
        uint8 winningNumber = tickets[winner];
        emit WinnerDrawn(winner, winningNumber);
    }

    // Start new round (anyone can call after draw)
    function startNewRound() external {
        require(isDrawn, "Lottery not drawn yet");

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

    // Get user's own ticket
    function getMyTicket() external view returns (uint8) {
        return tickets[msg.sender];
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

    // Reset lottery for new round (admin only)
    function resetLottery() external {
        require(msg.sender == admin, "Only admin can reset lottery");
        require(isDrawn, "Lottery not drawn yet");

        // Reset all state variables
        isDrawn = false;
        winner = address(0);
        lastDrawTime = block.timestamp;

        // Clear participants array
        delete participants;

        emit LotteryReset(msg.sender, block.timestamp);
    }

    // Update admin (admin only)
    function updateAdmin(address _newAdmin) external {
        require(msg.sender == admin, "Only admin can update admin");
        require(_newAdmin != address(0), "Invalid admin address");
        admin = _newAdmin;
    }
}
