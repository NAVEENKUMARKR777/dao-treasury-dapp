/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
      ALCHEMY_GOERLI_API_KEY: process.env.ALCHEMY_GOERLI_API_KEY,
      WALLET_PRIVATE_KEY: process.env.WALLET_PRIVATE_KEY,
      PERMIT2_CONTRACT_ADDRESS: process.env.PERMIT2_CONTRACT_ADDRESS,
      MULTISIG_WALLET_ADDRESS: process.env.MULTISIG_WALLET_ADDRESS,
      ACROSS_BRIDGE_ADDRESS: process.env.ACROSS_BRIDGE_ADDRESS,
    },
    images: {
      domains: ['your-image-host.com'], // Add domains for images to be loaded
    },
  };
  
  module.exports = nextConfig;
  
