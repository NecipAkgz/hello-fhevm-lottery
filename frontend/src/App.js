import React, { useState } from 'react';
import { BrowserProvider, Contract, parseEther, formatEther } from 'ethers';
import Header from './components/Header';
import WalletConnect from './components/WalletConnect';
import LotteryStats from './components/LotteryStats';
import BuyTicket from './components/BuyTicket';
import WinnerDisplay from './components/WinnerDisplay';
import AdminPanel from './components/AdminPanel';
import PastRounds from './components/PastRounds';
import ContractInfo from './components/ContractInfo';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import StatusMessage from './components/StatusMessage';
import { useLottery } from './hooks/useLottery';
import { useWallet } from './hooks/useWallet';
import { useToast } from './hooks/useToast';

function App() {
  const [ticketNumber, setTicketNumber] = useState('');
  const [txStatus, setTxStatus] = useState('');

  // Contract address - Sepolia testnet
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || "0x775a2EE67f89C222BD778315cd1a18770843Ab5b";

  const { messages, showToast } = useToast();
  const { account, isConnected, connectWallet } = useWallet(showToast, contractAddress);
  const {
    contract,
    lotteryState,
    loading,
    buyTicket,
    drawWinner,
    claimPrize,
    resetLottery,
    startNewRound,
    claimPastPrize
  } = useLottery(account, showToast, setTxStatus, contractAddress);

  // Listen for draw winner event
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

          {!isConnected ? (
            <WalletConnect
              isConnected={isConnected}
              account={account}
              onConnect={connectWallet}
              txStatus={txStatus}
            />
          ) : (
            <>
              <WalletConnect
                isConnected={isConnected}
                account={account}
                onConnect={connectWallet}
                txStatus={txStatus}
              />

              <PastRounds
                pastRounds={lotteryState.pastRounds}
                account={account}
                onClaimPastPrize={claimPastPrize}
                loading={loading}
              />

              {txStatus && (
                <StatusMessage type="info">
                  <strong>Transaction in progress:</strong> {txStatus}
                </StatusMessage>
              )}

              <LotteryStats lotteryState={lotteryState} />

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

              <ContractInfo contractAddress={contractAddress} />
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
