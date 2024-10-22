const { ethers, upgrades } = require("hardhat");
const fs = require("fs");
const path = require("path");

// Path to the .env file
const envFilePath = path.join(__dirname, "../.env");

// Function to update the .env file with contract addresses
async function updateEnvFile(permit2Address, multiSigAddress, acrossBridgeAddress) {
  const envContents = `
ALCHEMY_GOERLI_API_KEY=${process.env.ALCHEMY_GOERLI_API_KEY}
WALLET_PRIVATE_KEY=${process.env.WALLET_PRIVATE_KEY}
PERMIT2_CONTRACT_ADDRESS=${permit2Address}
MULTISIG_WALLET_ADDRESS=${multiSigAddress}
ACROSS_BRIDGE_ADDRESS=${acrossBridgeAddress}
`;
  fs.writeFileSync(envFilePath, envContents.trim());
  console.log(".env file updated with contract addresses.");
}

async function main() {
  // Deploy Permit2Integration contract
  const Permit2Integration = await ethers.getContractFactory("Permit2Integration");
  const permit2 = await Permit2Integration.deploy();
  await permit2.deployed();
  console.log("Permit2Integration deployed to:", permit2.address);

  // Deploy MultiSigWallet contract
  const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
  const multiSig = await MultiSigWallet.deploy();
  await multiSig.deployed();
  console.log("MultiSigWallet deployed to:", multiSig.address);

  // Deploy CrossChainBridge contract
  const CrossChainBridge = await ethers.getContractFactory("CrossChainBridge");
  const crossChainBridge = await CrossChainBridge.deploy();
  await crossChainBridge.deployed();
  console.log("CrossChainBridge deployed to:", crossChainBridge.address);

  // Update .env file with deployed contract addresses
  await updateEnvFile(permit2.address, multiSig.address, crossChainBridge.address);
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

