const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MultiSigWallet Contract", function () {
    let MultiSigWallet;
    let multiSigWallet;
    let owner, user1, user2, user3;

    before(async () => {
        // Get signers (accounts)
        [owner, user1, user2, user3] = await ethers.getSigners();

        // Deploy the MultiSigWallet contract
        MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
        multiSigWallet = await MultiSigWallet.deploy([owner.address, user1.address, user2.address], 2); // 2 approvals required
        await multiSigWallet.deployed();
    });

    it("should have the correct owners and approval requirement", async function () {
        const owners = await multiSigWallet.getOwners();
        const requiredApprovals = await multiSigWallet.required();

        expect(owners).to.include.members([owner.address, user1.address, user2.address]);
        expect(requiredApprovals).to.equal(2);
    });

    it("should allow submitting a transaction", async function () {
        const to = user3.address;
        const value = ethers.utils.parseEther("1");
        const data = "0x"; // no specific data for this test

        // Submit transaction
        await expect(multiSigWallet.connect(owner).submitTransaction(to, value, data))
            .to.emit(multiSigWallet, "SubmitTransaction")
            .withArgs(owner.address, 0, to, value, data); // transaction ID is 0 for the first one
    });

    it("should allow owners to approve a transaction", async function () {
        // Owner approves the transaction
        await expect(multiSigWallet.connect(owner).approveTransaction(0))
            .to.emit(multiSigWallet, "ApproveTransaction")
            .withArgs(owner.address, 0);

        // User1 approves the transaction
        await expect(multiSigWallet.connect(user1).approveTransaction(0))
            .to.emit(multiSigWallet, "ApproveTransaction")
            .withArgs(user1.address, 0);
    });

    it("should execute a transaction once it reaches the required number of approvals", async function () {
        const to = user3.address;
        const value = ethers.utils.parseEther("1");

        // User2 executes the transaction after approvals
        await expect(multiSigWallet.connect(user2).executeTransaction(0))
            .to.emit(multiSigWallet, "ExecuteTransaction")
            .withArgs(user2.address, 0);

        // Check the balance of user3 to confirm the transaction went through
        const balance = await ethers.provider.getBalance(user3.address);
        expect(balance).to.equal(value); // Expect user3 to have received 1 ether
    });

    it("should not allow a non-owner to submit or approve a transaction", async function () {
        const to = user3.address;
        const value = ethers.utils.parseEther("1");
        const data = "0x"; // no specific data for this test

        // Non-owner tries to submit a transaction
        await expect(multiSigWallet.connect(user3).submitTransaction(to, value, data))
            .to.be.revertedWith("Not an owner");

        // Non-owner tries to approve a transaction
        await expect(multiSigWallet.connect(user3).approveTransaction(0))
            .to.be.revertedWith("Not an owner");
    });

    it("should not allow executing a transaction without enough approvals", async function () {
        const to = user3.address;
        const value = ethers.utils.parseEther("1");
        const data = "0x"; // no specific data for this test

        // Submit another transaction
        await multiSigWallet.connect(owner).submitTransaction(to, value, data);

        // Try to execute the transaction with only 1 approval (insufficient)
        await expect(multiSigWallet.connect(owner).executeTransaction(1))
            .to.be.revertedWith("Not enough approvals");
    });

    it("should allow revoking approval for a pending transaction", async function () {
        // Owner revokes their approval for the second transaction
        await expect(multiSigWallet.connect(owner).revokeApproval(1))
            .to.emit(multiSigWallet, "RevokeApproval")
            .withArgs(owner.address, 1);

        // Try to execute the transaction and it should fail due to revoked approval
        await expect(multiSigWallet.connect(user1).executeTransaction(1))
            .to.be.revertedWith("Not enough approvals");
    });
});

