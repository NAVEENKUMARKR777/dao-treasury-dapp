// Permit2Integration.test.js
const { expect } = require("chai");
const hre = require("hardhat");

describe("Permit2Integration Contract Tests", function () {
    let Permit2Integration;
    let permit2Integration;

    before(async () => {
        // Deploy the Permit2Integration contract
        Permit2Integration = await hre.ethers.getContractFactory("Permit2Integration");
        permit2Integration = await Permit2Integration.deploy();
        await permit2Integration.deployed();
    });

    it("should correctly set the permit", async function () {
        const userAddress = "0xYourUserAddressHere"; // Replace with actual address
        const amount = 1000; // Example amount
        const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

        // Call the function to set the permit
        await permit2Integration.approvePermit(userAddress, amount, deadline);

        // Verify that the permit was set correctly
        const permit = await permit2Integration.getPermit(userAddress);
        expect(permit.amount).to.equal(amount);
        expect(permit.deadline).to.be.greaterThan(Math.floor(Date.now() / 1000));
    });

    it("should revert if the permit is expired", async function () {
        const expiredDeadline = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
        await expect(permit2Integration.approvePermit("0xAnotherAddressHere", 1000, expiredDeadline))
            .to.be.revertedWith("Permit has expired");
    });

    it("should emit PermitApproved event", async function () {
        const userAddress = "0xYourUserAddressHere"; // Replace with actual address
        const amount = 1000; // Example amount
        const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

        // Check for event emission
        await expect(permit2Integration.approvePermit(userAddress, amount, deadline)
        ).to.emit(permit2Integration, "PermitApproved")
        .withArgs(userAddress, amount, deadline);
    });

    // Additional tests can be added here
});
 
