// CrossChainBridge.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrossChainBridge Contract Tests", function () {
    let CrossChainBridge;
    let crossChainBridge;
    let owner, user1, user2, otherChain;

    before(async () => {
        // Get signers (accounts)
        [owner, user1, user2, otherChain] = await ethers.getSigners();

        // Deploy the CrossChainBridge contract
        CrossChainBridge = await ethers.getContractFactory("CrossChainBridge");
        crossChainBridge = await CrossChainBridge.deploy();
        await crossChainBridge.deployed();
    });

    it("should allow users to lock tokens for cross-chain transfer", async function () {
        const amount = ethers.utils.parseEther("10");

        // User1 locks tokens for cross-chain transfer
        await expect(crossChainBridge.connect(user1).lockTokens(user2.address, amount, otherChain.address))
            .to.emit(crossChainBridge, "TokensLocked")
            .withArgs(user1.address, user2.address, amount, otherChain.address);

        // Verify the balance was updated
        const lockedBalance = await crossChainBridge.getLockedBalance(user1.address);
        expect(lockedBalance).to.equal(amount);
    });

    it("should allow unlocking tokens when tokens are received on another chain", async function () {
        const amount = ethers.utils.parseEther("5");

        // Simulate receiving tokens from another chain and unlocking them for user1
        await expect(crossChainBridge.connect(owner).unlockTokens(user1.address, amount))
            .to.emit(crossChainBridge, "TokensUnlocked")
            .withArgs(user1.address, amount);

        // Verify the balance was updated
        const lockedBalance = await crossChainBridge.getLockedBalance(user1.address);
        expect(lockedBalance).to.equal(ethers.utils.parseEther("5")); // Initially locked 10, now 5 are unlocked
    });

    it("should not allow unlocking more tokens than locked", async function () {
        const amount = ethers.utils.parseEther("20");

        // Try unlocking more tokens than the user locked
        await expect(crossChainBridge.connect(owner).unlockTokens(user1.address, amount))
            .to.be.revertedWith("Insufficient locked balance");
    });

    it("should not allow non-admins to unlock tokens", async function () {
        const amount = ethers.utils.parseEther("5");

        // User1 tries to unlock tokens without admin privileges
        await expect(crossChainBridge.connect(user1).unlockTokens(user1.address, amount))
            .to.be.revertedWith("Caller is not the admin");
    });

    it("should allow admins to update cross-chain addresses", async function () {
        // Owner (admin) updates the cross-chain address
        await expect(crossChainBridge.connect(owner).updateCrossChainAddress(user1.address, otherChain.address))
            .to.emit(crossChainBridge, "CrossChainAddressUpdated")
            .withArgs(user1.address, otherChain.address);

        // Verify the cross-chain address was updated
        const crossChainAddress = await crossChainBridge.getCrossChainAddress(user1.address);
        expect(crossChainAddress).to.equal(otherChain.address);
    });

    it("should not allow non-admins to update cross-chain addresses", async function () {
        // User1 tries to update the cross-chain address without admin privileges
        await expect(crossChainBridge.connect(user1).updateCrossChainAddress(user1.address, otherChain.address))
            .to.be.revertedWith("Caller is not the admin");
    });

    it("should allow querying of locked balances", async function () {
        const lockedBalance = await crossChainBridge.getLockedBalance(user1.address);
        expect(lockedBalance).to.equal(ethers.utils.parseEther("5"));
    });

    it("should emit an event when cross-chain transfer is completed", async function () {
        const amount = ethers.utils.parseEther("3");

        // Simulate cross-chain transfer completion
        await expect(crossChainBridge.connect(owner).completeCrossChainTransfer(user1.address, amount))
            .to.emit(crossChainBridge, "CrossChainTransferCompleted")
            .withArgs(user1.address, amount);
    });
});

