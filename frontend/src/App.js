import React from 'react';
import Header from './components/Header';
import WalletConnect from './components/WalletConnect';
import LotteryStats from './components/LotteryStats';
import BuyTicket from './components/BuyTicket';
import WinnerDisplay from './components/WinnerDisplay';
import ContractInfo from './components/ContractInfo';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import StatusMessage from './components/StatusMessage';
import { useLottery } from './hooks/useLottery';
import { useWallet } from './hooks/useWallet';
import { useToast } from './hooks/useToast';

function App() {
  const [txStatus, setTxStatus] = React.useState('');

  const contractAddress = '0x6c90d81B332b01e6aa284a8B95245093C43e011B';

  const { messages, showToast } = useToast();
  const { account, isConnected, connectWallet } = useWallet(showToast);
  const {
    lotteryState,
    loading,
    buyTicket,
    drawWinner,
    claimPrize,
    startNewRound,
    claimPastPrize
  } = useLottery(account, showToast, setTxStatus, contractAddress);

  React.useEffect(() => {
    const handleDrawWinner = () => {
      drawWinner();
    };

    window.addEventListener('drawWinner', handleDrawWinner);
    return () => window.removeEventListener('drawWinner', handleDrawWinner);
  }, [drawWinner]);

  return (
    <div className="app">
      <div className="container">
        <div className="app-content">
          <Header />

          <ToastContainer messages={messages} />

          <div className="section wallet-section stack">
            <WalletConnect
              isConnected={isConnected}
              account={account}
              onConnect={connectWallet}
              txStatus={txStatus}
              pastRounds={lotteryState.pastRounds}
              onClaimPastPrize={claimPastPrize}
              loading={loading}
            />

            {isConnected && txStatus && (
              <StatusMessage type="info">
                Processing transaction: {txStatus}
              </StatusMessage>
            )}
          </div>

          {isConnected && (
            <div className="layout-grid">
              <div className="layout-column">
                <LotteryStats lotteryState={lotteryState} />
              </div>
              <div className="layout-column">
                <WinnerDisplay
                  lotteryState={lotteryState}
                  account={account}
                  loading={loading}
                  onClaimPrize={claimPrize}
                  onStartNewRound={startNewRound}
                />
                <BuyTicket
                  lotteryState={lotteryState}
                  loading={loading}
                  onBuyTicket={buyTicket}
                />
              </div>
              <div className="layout-column layout-column--full">
                <ContractInfo contractAddress={contractAddress} />
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
