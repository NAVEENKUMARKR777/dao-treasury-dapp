// interact.js
const hre = require("hardhat");
const fs = require("fs");
require("dotenv").config();

async function main() {
    // Get the contract addresses from the .env file
    const permit2IntegrationAddress = process.env.PERMIT2_INTEGRATION_ADDRESS;
    const intentManagerAddress = process.env.INTENT_MANAGER_ADDRESS;
    const crossChainBridgeAddress = process.env.CROSS_CHAIN_BRIDGE_ADDRESS;
    const multiSigWalletAddress = process.env.MULTI_SIG_WALLET_ADDRESS;

    // Get the contract instances
    const Permit2Integration = await hre.ethers.getContractFactory("Permit2Integration");
    const IntentManager = await hre.ethers.getContractFactory("IntentManager");
    const CrossChainBridge = await hre.ethers.getContractFactory("CrossChainBridge");
    const MultiSigWallet = await hre.ethers.getContractFactory("MultiSigWallet");

    const permit2Integration = Permit2Integration.attach(permit2IntegrationAddress);
    const intentManager = IntentManager.attach(intentManagerAddress);
    const crossChainBridge = CrossChainBridge.attach(crossChainBridgeAddress);
    const multiSigWallet = MultiSigWallet.attach(multiSigWalletAddress);

    // Example: Call a method from the Permit2Integration contract
    const examplePermitData = {
        // Add necessary permit data here
    };

    // Interact with the Permit2Integration contract
    try {
        const result = await permit2Integration.someMethod(examplePermitData);
        console.log("Permit2Integration method result:", result);
    } catch (error) {
        console.error("Error interacting with Permit2Integration:", error);
    }

    // Add additional interactions with other contracts here
    // For example, calling methods from IntentManager, CrossChainBridge, and MultiSigWallet
}

// Execute the interact script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
 
