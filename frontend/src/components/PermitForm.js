import React, { useState, useContext } from "react";
import { WalletContext } from "../context/WalletContext";
import { ethers } from "ethers";

const PermitForm = () => {
  const { walletAddress, provider } = useContext(WalletContext);
  const [spender, setSpender] = useState("");
  const [amount, setAmount] = useState("");
  const [permitData, setPermitData] = useState(null);
  const [status, setStatus] = useState("");

  const handlePermitSubmit = async (e) => {
    e.preventDefault();
    if (!provider || !walletAddress) {
      setStatus("Connect your wallet first.");
      return;
    }

    try {
      setStatus("Generating permit...");

      const signer = provider.getSigner();
      const nonce = await provider.getTransactionCount(walletAddress, "latest");
      const deadline = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour from now

      // Mock data for domain and permit2 parameters, adjust based on your setup
      const domain = {
        name: "Permit2",
        version: "1",
        chainId: 5, // Goerli testnet
        verifyingContract: process.env.PERMIT2_CONTRACT_ADDRESS
      };

      const permit = {
        owner: walletAddress,
        spender,
        value: ethers.utils.parseEther(amount),
        nonce,
        deadline
      };

      const types = {
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" }
        ]
      };

      const signature = await signer._signTypedData(domain, types, permit);
      setPermitData({ ...permit, signature });

      setStatus("Permit generated successfully!");
    } catch (error) {
      console.error(error);
      setStatus("Failed to generate permit.");
    }
  };

  return (
    <div className="permit-form">
      <h2>Generate Permit</h2>
      <form onSubmit={handlePermitSubmit}>
        <div>
          <label>Spender Address:</label>
          <input
            type="text"
            value={spender}
            onChange={(e) => setSpender(e.target.value)}
            placeholder="Enter spender address"
            required
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
          />
        </div>
        <button type="submit">Generate Permit</button>
      </form>

      {status && <p>{status}</p>}

      {permitData && (
        <div className="permit-output">
          <h3>Permit Data:</h3>
          <pre>{JSON.stringify(permitData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default PermitForm;
 
