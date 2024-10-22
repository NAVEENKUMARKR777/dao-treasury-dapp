import React, { useState, useContext } from "react";
import { ethers } from "ethers";
import { WalletContext } from "../context/WalletContext";
import MultiSigWalletABI from "../abis/MultiSigWallet.json"; // Import ABI of the MultiSigWallet

const MultiSig = () => {
  const { walletAddress, provider } = useContext(WalletContext);
  const [contractAddress, setContractAddress] = useState(""); // Address of deployed MultiSigWallet contract
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [status, setStatus] = useState("");
  const [transactions, setTransactions] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!provider || !walletAddress || !contractAddress) {
      setStatus("Please connect wallet and enter contract address.");
      return;
    }

    try {
      setStatus("Submitting transaction...");
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, MultiSigWalletABI, signer);

      const parsedAmount = ethers.utils.parseEther(amount);

      // Submit transaction to the MultiSigWallet contract
      const tx = await contract.submitTransaction(recipient, parsedAmount);
      setStatus("Transaction submitted. Waiting for confirmation...");
      await tx.wait();

      setStatus("Transaction submitted successfully!");
    } catch (error) {
      console.error(error);
      setStatus("Failed to submit transaction.");
    }
  };

  const handleApprove = async (e) => {
    e.preventDefault();
    if (!provider || !walletAddress || !contractAddress || !transactionId) {
      setStatus("Please connect wallet and enter contract address and transaction ID.");
      return;
    }

    try {
      setStatus("Approving transaction...");
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, MultiSigWalletABI, signer);

      // Approve transaction in the MultiSigWallet contract
      const tx = await contract.confirmTransaction(transactionId);
      setStatus("Transaction approved. Waiting for confirmation...");
      await tx.wait();

      setStatus("Transaction approved successfully!");
    } catch (error) {
      console.error(error);
      setStatus("Failed to approve transaction.");
    }
  };

  const fetchTransactions = async () => {
    if (!provider || !contractAddress) {
      setStatus("Please connect wallet and enter contract address.");
      return;
    }

    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, MultiSigWalletABI, signer);

      const txCount = await contract.getTransactionCount();
      const txs = [];
      for (let i = 0; i < txCount; i++) {
        const tx = await contract.transactions(i);
        txs.push(tx);
      }

      setTransactions(txs);
    } catch (error) {
      console.error(error);
      setStatus("Failed to fetch transactions.");
    }
  };

  return (
    <div className="multi-sig-form">
      <h2>Multi-Signature Wallet</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>MultiSig Contract Address:</label>
          <input
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder="Enter MultiSig contract address"
            required
          />
        </div>
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
        <button type="submit">Submit Transaction</button>
      </form>

      <h3>Approve Transaction</h3>
      <form onSubmit={handleApprove}>
        <div>
          <label>Transaction ID:</label>
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Enter transaction ID"
            required
          />
        </div>
        <button type="submit">Approve Transaction</button>
      </form>

      {status && <p>{status}</p>}

      <button onClick={fetchTransactions}>Fetch Transactions</button>

      <h3>Transaction List</h3>
      <ul>
        {transactions.map((tx, index) => (
          <li key={index}>
            <p>To: {tx.destination}</p>
            <p>Amount: {ethers.utils.formatEther(tx.value)} ETH</p>
            <p>Executed: {tx.executed ? "Yes" : "No"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MultiSig;
 
