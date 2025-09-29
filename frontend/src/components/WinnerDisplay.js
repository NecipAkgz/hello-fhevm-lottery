const WinnerDisplay = ({ lotteryState, account, loading, onClaimPrize, onStartNewRound }) => {
  if (!lotteryState.isDrawn) {
    return null;
  }

  const isWinner = lotteryState.winner.toLowerCase() === account.toLowerCase();
  const formattedWinner = `${lotteryState.winner.slice(0, 8)}...${lotteryState.winner.slice(-6)}`;

  return (
    <div className="panel panel-primary">
      <h2 className="panel-title">Winner announced</h2>
      <p className="panel-description">This round was won by:</p>
      <span className="winner-address mono">{formattedWinner}</span>

      {isWinner ? (
        <div className="status-message status-success">
          Congratulations. You can claim the pool and immediately start the next round.
        </div>
      ) : (
        <div className="status-message status-info">
          The winner has been revealed. Start a new round to take another shot.
        </div>
      )}

      {isWinner ? (
        <>
          <button
            type="button"
            onClick={onClaimPrize}
            disabled={loading}
            className={`btn ${loading ? 'btn-loading' : 'btn-success'}`}
          >
            {loading ? 'Sending prize...' : `Claim ${lotteryState.balance} ETH`}
          </button>

          <button
            type="button"
            onClick={onStartNewRound}
            disabled={loading}
            className={`btn ${loading ? 'btn-loading' : 'btn-primary'}`}
          >
            Start a new round
          </button>
          <p className="form-helper">The first ticket is reserved for you as the previous winner.</p>
        </>
      ) : (
        <button
          type="button"
          onClick={onStartNewRound}
          disabled={loading}
          className={`btn ${loading ? 'btn-loading' : 'btn-secondary'}`}
        >
          Start a new round
        </button>
      )}
    </div>
  );
};

export default WinnerDisplay;
