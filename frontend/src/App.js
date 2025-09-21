import React, { useState } from 'react';
import { BrowserProvider, Contract, parseEther, formatEther } from 'ethers';
import Header from './components/Header';
import WalletConnect from './components/WalletConnect';
import LotteryStats from './components/LotteryStats';
import BuyTicket from './components/BuyTicket';
import WinnerDisplay from './components/WinnerDisplay';
import AdminPanel from './components/AdminPanel';
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
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || "0x63Cf79cC631699356775d3c6b277A94D64737F18";

  const { messages, showToast } = useToast();
  const { account, isConnected, connectWallet } = useWallet(showToast, contractAddress);
  const {
    contract,
    lotteryState,
    loading,
    buyTicket,
    drawWinner,
    claimPrize,
    resetLottery
  } = useLottery(account, showToast, setTxStatus, contractAddress);

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
              />

              <BuyTicket
                lotteryState={lotteryState}
                loading={loading}
                onBuyTicket={buyTicket}
              />

              <AdminPanel
                loading={loading}
                onDrawWinner={drawWinner}
                onResetLottery={resetLottery}
                lotteryState={lotteryState}
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
