// deploy.js
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    // Get the contract factories
    const Permit2Integration = await hre.ethers.getContractFactory("Permit2Integration");
    const IntentManager = await hre.ethers.getContractFactory("IntentManager");
    const CrossChainBridge = await hre.ethers.getContractFactory("CrossChainBridge");
    const MultiSigWallet = await hre.ethers.getContractFactory("MultiSigWallet");

    // Deploy the contracts
    const permit2Integration = await Permit2Integration.deploy();
    await permit2Integration.deployed();
    console.log("Permit2Integration deployed to:", permit2Integration.address);

    const intentManager = await IntentManager.deploy();
    await intentManager.deployed();
    console.log("IntentManager deployed to:", intentManager.address);

    const crossChainBridge = await CrossChainBridge.deploy();
    await crossChainBridge.deployed();
    console.log("CrossChainBridge deployed to:", crossChainBridge.address);

    // Here, you can customize the owners and required confirmations for the MultiSigWallet
    const owners = [/* Add wallet addresses here */];
    const requiredConfirmations = 2; // For example
    const multiSigWallet = await MultiSigWallet.deploy(owners, requiredConfirmations);
    await multiSigWallet.deployed();
    console.log("MultiSigWallet deployed to:", multiSigWallet.address);

    // Update the .env file with the deployed contract addresses
    const envPath = path.join(__dirname, "../.env");
    let envContents = fs.readFileSync(envPath, "utf8");

    envContents = envContents
        .replace(/PERMIT2_INTEGRATION_ADDRESS=.*/, `PERMIT2_INTEGRATION_ADDRESS=${permit2Integration.address}`)
        .replace(/INTENT_MANAGER_ADDRESS=.*/, `INTENT_MANAGER_ADDRESS=${intentManager.address}`)
        .replace(/CROSS_CHAIN_BRIDGE_ADDRESS=.*/, `CROSS_CHAIN_BRIDGE_ADDRESS=${crossChainBridge.address}`)
        .replace(/MULTI_SIG_WALLET_ADDRESS=.*/, `MULTI_SIG_WALLET_ADDRESS=${multiSigWallet.address}`);

    fs.writeFileSync(envPath, envContents);
    console.log(".env file updated with contract addresses");
}

// Execute the deploy script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
 
