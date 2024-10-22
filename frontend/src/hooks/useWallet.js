import { useState, useEffect } from "react";
import { ethers } from "ethers";

export const useWallet = () => {
  const [walletAddress, setWalletAddress] = useState(null); // Stores the connected wallet address
  const [provider, setProvider] = useState(null);           // Stores the provider from ethers.js
  const [error, setError] = useState("");                   // Stores any errors encountered

  // Function to connect the user's wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError("MetaMask is not installed.");
        return;
      }

      const ethereumProvider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await ethereumProvider.send("eth_requestAccounts", []);
      
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);      // Set the first connected account
        setProvider(ethereumProvider);      // Set the provider instance for ethers.js
        setError("");                       // Clear any previous errors
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to wallet. Please try again.");
    }
  };

  // Function to disconnect the wallet
  const disconnectWallet = () => {
    setWalletAddress(null);  // Reset the wallet address to null
    setProvider(null);       // Reset the provider to null
    setError("");            // Clear errors if any
  };

  // Automatically detect if the user has changed accounts or networks
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          disconnectWallet();
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload(); // Reload the page when chain/network is changed
      });
    }
  }, []);

  return {
    walletAddress,
    provider,
    connectWallet,
    disconnectWallet,
    error
  };
};

