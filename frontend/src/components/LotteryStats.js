const LotteryStats = ({ lotteryState }) => {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-label">Participants</div>
        <div className="stat-value">{lotteryState.participantCount}</div>
        <div className="stat-desc">Total players</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Prize Pool</div>
        <div className="stat-value">{lotteryState.balance} ETH</div>
        <div className="stat-desc">Total rewards</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Ticket Price</div>
        <div className="stat-value">{lotteryState.ticketPrice} ETH</div>
        <div className="stat-desc">Per ticket</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Status</div>
        <div className="stat-value">
          {lotteryState.isDrawn ? "🎉 Drawn" : "🎯 Active"}
        </div>
        <div className="stat-desc">
          {lotteryState.isDrawn ? "Winner selected" : "Accepting tickets"}
        </div>
      </div>
    </div>
  );
};

export default LotteryStats;
