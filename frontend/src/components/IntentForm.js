import React, { useState, useContext } from "react";
import { ethers } from "ethers";
import { WalletContext } from "../context/WalletContext";
import { IntentContext } from "../context/IntentContext";

const IntentForm = () => {
  const { walletAddress, provider } = useContext(WalletContext);
  const { createIntent } = useContext(IntentContext);
  
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [executionTime, setExecutionTime] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!provider || !walletAddress) {
      setStatus("Connect your wallet first.");
      return;
    }

    try {
      setStatus("Submitting intent...");
      const signer = provider.getSigner();

      // Convert amount and execution time to appropriate formats
      const parsedAmount = ethers.utils.parseEther(amount);
      const executionTimestamp = Math.floor(new Date(executionTime).getTime() / 1000);

      // Call createIntent function from IntentManager contract via IntentContext
      const tx = await createIntent(walletAddress, recipient, parsedAmount, executionTimestamp, signer);
      setStatus("Transaction submitted. Waiting for confirmation...");
      await tx.wait();

      setStatus("Intent created successfully!");
    } catch (error) {
      console.error(error);
      setStatus("Failed to create intent.");
    }
  };

  return (
    <div className="intent-form">
      <h2>Create Scheduled Intent</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Recipient Address:</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter recipient address"
            required
          />
        </div>
        <div>
          <label>Amount (ETH):</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
          />
        </div>
        <div>
          <label>Execution Time:</label>
          <input
            type="datetime-local"
            value={executionTime}
            onChange={(e) => setExecutionTime(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit Intent</button>
      </form>

      {status && <p>{status}</p>}
    </div>
  );
};

export default IntentForm;
 
