import React, { useState } from 'react';
import { BrowserProvider, Contract, parseEther, formatEther } from 'ethers';
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
  const [ticketNumber, setTicketNumber] = useState('');
  const [txStatus, setTxStatus] = useState('');

  // Contract address - Sepolia testnet
  const contractAddress = "0x06bBCb0a34eeF521290fE7AE9e085FB9167b2B70";

  const { messages, showToast } = useToast();
  const { account, isConnected, connectWallet } = useWallet(showToast, contractAddress);
  const {
    contract,
    lotteryState,
    loading,
    buyTicket,
    drawWinner,
    claimPrize,
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

          {/* Wallet Connection Section */}
          <div className="section wallet-section">
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
                <strong>Transaction in progress:</strong> {txStatus}
              </StatusMessage>
            )}
          </div>

          {isConnected && (
            <>
              {/* Lottery Stats Section */}
              <div className="section stats-section">
                <LotteryStats lotteryState={lotteryState} />
              </div>

              {/* Main Actions Section */}
              <div className="section actions-section">
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



              {/* Contract Info Section */}
              <div className="section contract-section">
                <ContractInfo contractAddress={contractAddress} />
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
