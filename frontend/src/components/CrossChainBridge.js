import React, { useState, useContext } from "react";
import { ethers } from "ethers";
import { WalletContext } from "../context/WalletContext";
import CrossChainBridgeABI from "../abis/CrossChainBridge.json"; // Import ABI of the CrossChainBridge contract

const CrossChainBridge = () => {
  const { walletAddress, provider } = useContext(WalletContext);
  const [bridgeAddress, setBridgeAddress] = useState(""); // Address of deployed CrossChainBridge contract
  const [amount, setAmount] = useState("");
  const [destinationChainId, setDestinationChainId] = useState("");
  const [status, setStatus] = useState("");
  
  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!provider || !walletAddress || !bridgeAddress || !amount || !destinationChainId) {
      setStatus("Please connect wallet and fill in all fields.");
      return;
    }

    try {
      setStatus("Initiating cross-chain transfer...");
      const signer = provider.getSigner();
      const bridgeContract = new ethers.Contract(bridgeAddress, CrossChainBridgeABI, signer);

      const parsedAmount = ethers.utils.parseEther(amount);
      
      // Initiate cross-chain asset transfer
      const tx = await bridgeContract.transferToChain(parsedAmount, destinationChainId, { value: parsedAmount });
      setStatus("Transaction submitted. Waiting for confirmation...");
      await tx.wait();

      setStatus("Cross-chain transfer successful!");
    } catch (error) {
      console.error(error);
      setStatus("Failed to initiate cross-chain transfer.");
    }
  };

  return (
    <div className="cross-chain-bridge-form">
      <h2>Cross-Chain Bridge</h2>

      <form onSubmit={handleTransfer}>
        <div>
          <label>Bridge Contract Address:</label>
          <input
            type="text"
            value={bridgeAddress}
            onChange={(e) => setBridgeAddress(e.target.value)}
            placeholder="Enter Bridge contract address"
            required
          />
        </div>
        <div>
          <label>Amount (ETH):</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount to transfer"
            required
          />
        </div>
        <div>
          <label>Destination Chain ID:</label>
          <input
            type="text"
            value={destinationChainId}
            onChange={(e) => setDestinationChainId(e.target.value)}
            placeholder="Enter destination chain ID"
            required
          />
        </div>
        <button type="submit">Transfer</button>
      </form>

      {status && <p>{status}</p>}
    </div>
  );
};

export default CrossChainBridge;

