require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
const fs = require("fs");

// Ensure the .env file exists
const ENV_FILE = ".env";

if (!fs.existsSync(ENV_FILE)) {
  fs.writeFileSync(ENV_FILE, "");
}

// Read existing environment variables
let envVars = fs.readFileSync(ENV_FILE, "utf8").split("\n");

// Create a function to update the .env file
const updateEnvFile = (key, value) => {
  // Check if the key already exists
  const index = envVars.findIndex(line => line.startsWith(key));

  if (index !== -1) {
    // Update the existing key
    envVars[index] = `${key}=${value}`;
  } else {
    // Add a new key
    envVars.push(`${key}=${value}`);
  }

  // Write the updated environment variables back to the .env file
  fs.writeFileSync(ENV_FILE, envVars.join("\n"));
};

// Export the Hardhat configuration
module.exports = {
  solidity: "0.8.0", // Specify the Solidity version
  networks: {
    hardhat: {
      chainId: 1337, // Local Hardhat network
    },
    sepolia: {
      url: process.env.INFURA_SEPOLIA_URL || "", // Infura or Alchemy URL for Sepolia
      accounts: [`0x${process.env.WALLET_PRIVATE_KEY}`], // Wallet private key
    },
    mainnet: {
      url: process.env.INFURA_MAINNET_URL || "", // Infura or Alchemy URL for Mainnet
      accounts: [`0x${process.env.WALLET_PRIVATE_KEY}`], // Wallet private key
    },
  },
  paths: {
    artifacts: "./artifacts", // Specify where to save contract artifacts
  },
  // Add hooks to update .env file after deploying contracts
  afterDeploy: (contract, name) => {
    // For example, update the Permit2 contract address
    if (name === "Permit2Integration") {
      updateEnvFile("PERMIT2_CONTRACT_ADDRESS", contract.address);
    }
    // Add additional conditions for other contracts as needed
    // For example, for MultiSigWallet
    if (name === "MultiSigWallet") {
      updateEnvFile("MULTISIG_WALLET_ADDRESS", contract.address);
    }
  },
};

