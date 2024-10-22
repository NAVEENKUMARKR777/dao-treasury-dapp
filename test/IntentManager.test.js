// IntentManager.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("IntentManager Contract Tests", function () {
    let IntentManager;
    let intentManager;
    let owner, user1, user2;

    before(async () => {
        // Get signers (accounts)
        [owner, user1, user2] = await ethers.getSigners();

        // Deploy the IntentManager contract
        IntentManager = await ethers.getContractFactory("IntentManager");
        intentManager = await IntentManager.deploy();
        await intentManager.deployed();
    });

    it("should allow users to create a new intent", async function () {
        const amount = ethers.utils.parseEther("1");
        const triggerTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

        // User1 creates a new intent
        await expect(intentManager.connect(user1).createIntent(user2.address, amount, triggerTime))
            .to.emit(intentManager, "IntentCreated")
            .withArgs(user1.address, user2.address, amount, triggerTime);

        // Verify the intent was stored correctly
        const intent = await intentManager.intents(0);
        expect(intent.from).to.equal(user1.address);
        expect(intent.to).to.equal(user2.address);
        expect(intent.amount).to.equal(amount);
        expect(intent.triggerTime).to.equal(triggerTime);
    });

    it("should not allow creating intent with trigger time in the past", async function () {
        const amount = ethers.utils.parseEther("1");
        const pastTriggerTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour in the past

        // Attempt to create an intent with a past trigger time
        await expect(intentManager.connect(user1).createIntent(user2.address, amount, pastTriggerTime))
            .to.be.revertedWith("Trigger time must be in the future");
    });

    it("should allow executing an intent if the trigger time has passed", async function () {
        const amount = ethers.utils.parseEther("1");
        const triggerTime = Math.floor(Date.now() / 1000) + 1; // Trigger time is 1 second from now

        // User1 creates a new intent
        await intentManager.connect(user1).createIntent(user2.address, amount, triggerTime);

        // Wait for the trigger time to pass
        await ethers.provider.send("evm_increaseTime", [2]); // Increase time by 2 seconds
        await ethers.provider.send("evm_mine", []); // Mine the next block

        // Execute the intent
        await expect(intentManager.connect(user1).executeIntent(0))
            .to.emit(intentManager, "IntentExecuted")
            .withArgs(user1.address, user2.address, amount);
    });

    it("should not allow executing an intent before the trigger time", async function () {
        const amount = ethers.utils.parseEther("1");
        const triggerTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

        // User1 creates a new intent
        await intentManager.connect(user1).createIntent(user2.address, amount, triggerTime);

        // Try executing the intent before the trigger time
        await expect(intentManager.connect(user1).executeIntent(0))
            .to.be.revertedWith("Trigger time not reached");
    });

    it("should allow users to cancel an intent", async function () {
        const amount = ethers.utils.parseEther("1");
        const triggerTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

        // User1 creates a new intent
        await intentManager.connect(user1).createIntent(user2.address, amount, triggerTime);

        // Cancel the intent
        await expect(intentManager.connect(user1).cancelIntent(0))
            .to.emit(intentManager, "IntentCancelled")
            .withArgs(user1.address, 0);

        // Verify the intent was marked as cancelled
        const intent = await intentManager.intents(0);
        expect(intent.cancelled).to.be.true;
    });

    it("should not allow executing a cancelled intent", async function () {
        const amount = ethers.utils.parseEther("1");
        const triggerTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

        // User1 creates a new intent
        await intentManager.connect(user1).createIntent(user2.address, amount, triggerTime);

        // Cancel the intent
        await intentManager.connect(user1).cancelIntent(0);

        // Try executing the cancelled intent
        await expect(intentManager.connect(user1).executeIntent(0))
            .to.be.revertedWith("Intent is cancelled");
    });
});
 
