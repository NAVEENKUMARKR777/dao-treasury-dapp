// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Permit2Integration is Ownable {
    using ECDSA for bytes32;

    // Events
    event TokensTransferred(address indexed from, address indexed to, uint256 amount);

    // Function to handle gasless transfers
    function permitAndTransfer(
        address token,
        address from,
        address to,
        uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        // Verify the signature
        bytes32 hash = keccak256(abi.encodePacked(token, from, to, amount, deadline));
        address signer = hash.toEthSignedMessageHash().recover(v, r, s);
        
        require(signer == from, "Invalid signature");
        require(deadline >= block.timestamp, "Signature expired");

        // Transfer tokens
        IERC20(token).transferFrom(from, to, amount);
        emit TokensTransferred(from, to, amount);
    }
    
    // Owner-only function to set the contract address in .env file
    function updateEnv() external onlyOwner {
        // Logic to write to .env (to be called from deploy script)
        // This could be an event that the deploy script listens to
        emit EnvUpdated(address(this));
    }

    // Event to notify that the environment has been updated
    event EnvUpdated(address indexed contractAddress);
}

