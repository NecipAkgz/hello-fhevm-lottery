// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ConfidentialLottery {
    mapping(address => uint8) private tickets;
    address public winner;
    bool public isDrawn;
    uint256 public ticketPrice = 0.01 ether;
    address[] public participants;

    event TicketPurchased(address indexed buyer, uint8 ticket);
    event WinnerDrawn(address indexed winner, uint8 winningNumber);
    event PrizeClaimed(address indexed winner, uint256 amount);

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

        emit TicketPurchased(msg.sender, _ticketNumber);
    }

    // Draw random winner
    function drawWinner() external {
        require(!isDrawn, "Lottery already drawn");
        require(participants.length > 0, "No participants");

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

        // Announce winner
        uint8 winningNumber = tickets[winner];
        emit WinnerDrawn(winner, winningNumber);
    }

    // Winner claims prize
    function claimPrize() external {
        require(isDrawn, "Lottery not drawn yet");
        require(msg.sender == winner, "Not the winner");

        uint256 prize = address(this).balance;
        require(prize > 0, "No prize to claim");

        payable(winner).transfer(prize);
        emit PrizeClaimed(winner, prize);
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
}
