import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWallet } from "./useWallet"; // Import wallet hook for managing connections
import IntentManagerABI from "../contracts/IntentManager.json"; // Import ABI for the IntentManager contract

export const useIntent = (contractAddress) => {
  const { provider, walletAddress } = useWallet(); // Access wallet-related state
  const [intents, setIntents] = useState([]);      // Stores the list of intents
  const [loading, setLoading] = useState(false);   // Loading state for async actions
  const [error, setError] = useState("");          // Stores any errors encountered

  // Function to fetch the intents for the connected wallet
  const fetchIntents = async () => {
    if (!provider || !walletAddress) {
      setError("Wallet not connected.");
      return;
    }

    try {
      setLoading(true);
      const signer = provider.getSigner();
      const intentManager = new ethers.Contract(contractAddress, IntentManagerABI, signer);

      const userIntents = await intentManager.getIntents(walletAddress);
      setIntents(userIntents); // Update intents state with fetched data
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch intents.");
      setLoading(false);
    }
  };

  // Function to create a new intent
  const createIntent = async (to, amount, executionTime) => {
    if (!provider || !walletAddress) {
      setError("Wallet not connected.");
      return;
    }

    try {
      setLoading(true);
      const signer = provider.getSigner();
      const intentManager = new ethers.Contract(contractAddress, IntentManagerABI, signer);

      const tx = await intentManager.scheduleIntent(to, ethers.utils.parseEther(amount), executionTime);
      await tx.wait(); // Wait for the transaction to be mined
      setLoading(false);
      fetchIntents(); // Refresh the intent list
    } catch (err) {
      console.error(err);
      setError("Failed to create intent.");
      setLoading(false);
    }
  };

  // Function to cancel an intent by its ID
  const cancelIntent = async (intentId) => {
    if (!provider || !walletAddress) {
      setError("Wallet not connected.");
      return;
    }

    try {
      setLoading(true);
      const signer = provider.getSigner();
      const intentManager = new ethers.Contract(contractAddress, IntentManagerABI, signer);

      const tx = await intentManager.cancelIntent(intentId);
      await tx.wait(); // Wait for the transaction to be mined
      setLoading(false);
      fetchIntents(); // Refresh the intent list
    } catch (err) {
      console.error(err);
      setError("Failed to cancel intent.");
      setLoading(false);
    }
  };

  // Automatically fetch intents when the wallet is connected or when the contract address changes
  useEffect(() => {
    if (provider && walletAddress && contractAddress) {
      fetchIntents();
    }
  }, [provider, walletAddress, contractAddress]);

  return {
    intents,
    loading,
    error,
    fetchIntents,
    createIntent,
    cancelIntent
  };
};

