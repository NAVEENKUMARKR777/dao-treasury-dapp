import React, { createContext, useState, useEffect, useContext } from "react";
import { ethers } from "ethers";

// Create Wallet Context
const WalletContext = createContext();

// Wallet Provider component to wrap the app
export const WalletProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);       // State for Ethereum provider (e.g., Metamask)
  const [walletAddress, setWalletAddress] = useState(""); // State for connected wallet address
  const [balance, setBalance] = useState(null);          // State for user's ETH balance
  const [error, setError] = useState(null);              // State for any connection errors
  const [loading, setLoading] = useState(false);         // State to indicate loading status

  // Function to connect the wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setLoading(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []); // Request account access if needed
        const signer = provider.getSigner();
        const address = await signer.getAddress();      // Get wallet address
        const balance = await provider.getBalance(address); // Fetch balance

        setProvider(provider);
        setWalletAddress(address);
        setBalance(ethers.utils.formatEther(balance));  // Format balance to readable ETH
        setLoading(false);
      } catch (err) {
        setError("Failed to connect wallet.");
        setLoading(false);
      }
    } else {
      setError("Metamask not detected.");
    }
  };

  // Function to disconnect the wallet
  const disconnectWallet = () => {
    setProvider(null);
    setWalletAddress("");
    setBalance(null);
  };

  // Automatically check if the wallet is connected on component mount
  useEffect(() => {
    if (window.ethereum) {
      connectWallet();
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{ provider, walletAddress, balance, connectWallet, disconnectWallet, loading, error }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook to access wallet context
export const useWallet = () => {
  return useContext(WalletContext);
};

