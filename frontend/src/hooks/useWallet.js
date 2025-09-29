import { useState } from 'react';

// Provides wallet connection helpers tailored for the FHE learning demo UI.
export const useWallet = (showToast) => {
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  // Switches or adds Sepolia in MetaMask so FHE-enabled contracts are reachable.
  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }],
      });
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xaa36a7',
              chainName: 'Sepolia Testnet',
              nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['https://sepolia.infura.io/v3/54d227d3f34347b5b4ba31bbfdb83093'],
              blockExplorerUrls: ['https://sepolia.etherscan.io/']
            }]
          });
        } catch (addError) {
          console.error('Error adding Sepolia network:', addError);
        }
      } else {
        console.error('Error switching to Sepolia:', error);
      }
    }
  };

  // Requests wallet access and updates local state once the user approves.
  const connectWallet = async () => {
    if (!window.ethereum) {
      showToast('Please install MetaMask browser extension', 'error');
      return;
    }

    try {
      showToast('Connecting...', 'info');

      await switchToSepolia();

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setIsConnected(true);

      showToast('Wallet connected successfully!', 'success');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      showToast('Connection failed: ' + error.message, 'error');
    }
  };

  return { account, isConnected, connectWallet };
};
