# File Directory Structure

/dao-treasury-dapp                  # Root directory for the project
│
├── /contracts                   # Contains all Solidity smart contracts
│   ├── Permit2Integration.sol   # Contract handling Permit2 integration for gasless transfers
│   ├── IntentManager.sol        # Contract for managing automated intents for fund transfers
│   ├── CrossChainBridge.sol     # Contract integrating Across for cross-chain transfers
│   └── MultiSigWallet.sol       # Multi-signature wallet contract for transaction approvals
│
├── /scripts                     # Scripts for deployment and testing
│   ├── deploy.js                # Deployment script for deploying contracts to the blockchain
│   ├── interact.js              # Script for interacting with the deployed contracts
│   └── test.js                  # Testing script to run automated tests for contracts
│
├── /test                        # Contains test files for smart contracts
│   ├── Permit2Integration.test.js  # Unit tests for Permit2 integration contract
│   ├── IntentManager.test.js      # Tests for the Intent Manager functionality
│   ├── CrossChainBridge.test.js   # Tests for the Across integration
│   └── MultiSigWallet.test.js     # Tests for the multi-signature wallet contract
│
├── /frontend                    # Frontend application directory
│   ├── /public                  # Static files like images and icons
│   ├── /src                     # Source files for the React/Next.js application
│   │   ├── /components          # Reusable UI components
│   │   │   ├── PermitForm.js    # Component for handling Permit2 approvals
│   │   │   ├── IntentForm.js     # Component for scheduling intents
│   │   │   ├── MultiSig.js       # Component for multi-signature wallet functionalities
│   │   │   └── CrossChainBridge.js # Component for triggering cross-chain transfers
│   │   ├── /hooks               # Custom React hooks
│   │   │   ├── useWallet.js      # Hook for managing wallet connection
│   │   │   └── useIntent.js      # Hook for managing intents
│   │   ├── /context             # Context providers for state management
│   │   │   ├── WalletContext.js   # Context for wallet-related state
│   │   │   └── IntentContext.js    # Context for intent-related state
│   │   ├── /styles              # CSS or styled-components for styling
│   │   ├── App.js               # Main app component
│   │   └── index.js             # Entry point for React app
│
├── .env                         # Environment variables (e.g., API keys, contract addresses)
├── package.json                 # Project metadata and dependencies
├── next.config.js               # Configuration for Next.js
│
├── /migrations                  # Contains migration scripts for deploying contracts
│   └── 1_deploy_contracts.js    # Script to deploy all contracts in the project
│
├── .gitignore                   # Files and folders to ignore in Git
├── README.md                    # Documentation for project setup and usage
└── hardhat.config.js            # Hardhat configuration for the project

# Prerequisites
Before you begin, ensure you have the following installed on your machine:

Node.js (version 16.x or later)
npm (Node package manager)
Hardhat
A wallet (e.g., MetaMask) with some Sepolia ETH for gas fees

# Clone the Repository
git clone https://github.com/NAVEENKUMARKR777/dao-treasury-dapp.git
cd dao-treasury-dapp

# Install Dependencies
Install the required npm packages:
npm install

# Configure Environment Variables
Create a .env file in the root directory of the project with the following variables:

# Infura or Alchemy URLs for Ethereum networks
INFURA_SEPOLIA_URL=
INFURA_MAINNET_URL=

# Wallet private key for deploying contracts (ensure this is kept secure)
WALLET_PRIVATE_KEY=

# Deployed contract addresses (will be updated automatically)
PERMIT2_CONTRACT_ADDRESS=
MULTISIG_WALLET_ADDRESS=
CROSS_CHAIN_BRIDGE_ADDRESS=
INTENT_MANAGER_ADDRESS=

# Compile the Smart Contracts
Compile the contracts using Hardhat:

npx hardhat compile

# Deploy the Smart Contracts
Deploy the contract to the Sepolia network:  // Goerli is deprected outdated so i used 'Sepoli'

npx hardhat run scripts/deploy.js --network sepolia


# After deployment, you can interact using:
Hardhat Console: Access the console for direct contract interaction.
npx hardhat console --network sepolia


# Testing
To run the tests for your contracts, use:
npx hardhat test


# Run the Frontend Locally:
Start the development server:
npm start


Access it via http://localhost:3000