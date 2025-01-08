const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("IPFSStorage", function () {
  // We define a fixture to reuse the same setup in every test
  async function deployIPFSStorageFixture() {
    const pricePerBlock = ethers.parseEther("0.01"); // 0.01 UOMI
    const minDuration = 28800; // 24 hours in blocks

    // Get the signers
    const [owner, otherAccount] = await ethers.getSigners();

    // Deploy the mock IPFS precompile
    const MockIpfs = await ethers.getContractFactory("MockIpfs");
    const mockIpfs = await MockIpfs.deploy();

    // Deploy IPFSStorage contract
    const IPFSStorage = await ethers.getContractFactory("IPFSStorage");
    const ipfsStorage = await IPFSStorage.deploy(owner.address);

    return { 
      ipfsStorage, 
      mockIpfs, 
      pricePerBlock, 
      minDuration, 
      owner, 
      otherAccount 
    };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { ipfsStorage, owner } = await loadFixture(deployIPFSStorageFixture);
      expect(await ipfsStorage.owner()).to.equal(owner.address);
    });
  });

  describe("PinAgent", function () {
    it("Should allow anyone to pin agent data", async function () {
      const { ipfsStorage, otherAccount } = await loadFixture(deployIPFSStorageFixture);
      
      const testCid = ethers.toUtf8Bytes("QmTest123");
      const testNftId = 1;

      await expect(ipfsStorage.connect(otherAccount).pinAgent(testCid, testNftId))
        .not.to.be.reverted;
    });
  });

  describe("PinFile", function () {
    it("Should revert if duration is less than minimum", async function () {
      const { ipfsStorage, minDuration, pricePerBlock } = await loadFixture(
        deployIPFSStorageFixture
      );

      const testCid = ethers.toUtf8Bytes("QmTest456");
      const invalidDuration = minDuration - 1;
      const payment = pricePerBlock * BigInt(invalidDuration);

      await expect(ipfsStorage.pinFile(testCid, invalidDuration, { value: payment }))
        .to.be.revertedWith("IPFSStorage: min duration should be >= 28800");
    });

    it("Should revert if payment is insufficient", async function () {
      const { ipfsStorage, minDuration, pricePerBlock } = await loadFixture(
        deployIPFSStorageFixture
      );

      const testCid = ethers.toUtf8Bytes("QmTest456");
      const payment = pricePerBlock * BigInt(minDuration - 1);

      await expect(ipfsStorage.pinFile(testCid, minDuration, { value: payment }))
        .to.be.revertedWith("IPFSStorage: not enough payment");
    });

    it("Should accept correct payment and duration", async function () {
      const { ipfsStorage, minDuration, pricePerBlock } = await loadFixture(
        deployIPFSStorageFixture
      );

      const testCid = ethers.toUtf8Bytes("QmTest456");
      const payment = pricePerBlock * BigInt(minDuration);

      await expect(ipfsStorage.pinFile(testCid, minDuration, { value: payment }))
        .not.to.be.reverted;
    });
  });

  describe("Withdrawals", function () {
    describe("Validations", function () {
      it("Should revert if called from another account", async function () {
        const { ipfsStorage, otherAccount } = await loadFixture(
          deployIPFSStorageFixture
        );

        await expect(ipfsStorage.connect(otherAccount).withdraw())
          .to.be.revertedWith("IPFSStorage: only owner can withdraw");
      });

      it("Should allow owner to withdraw", async function () {
        const { ipfsStorage, owner, minDuration, pricePerBlock } = await loadFixture(
          deployIPFSStorageFixture
        );

        // First, let's add some funds to the contract
        const testCid = ethers.toUtf8Bytes("QmTest456");
        const payment = pricePerBlock * BigInt(minDuration);
        await ipfsStorage.pinFile(testCid, minDuration, { value: payment });

        await expect(ipfsStorage.connect(owner).withdraw())
          .not.to.be.reverted;
      });
    });

    describe("Transfers", function () {
      it("Should transfer all funds to the owner", async function () {
        const { ipfsStorage, owner, minDuration, pricePerBlock } = await loadFixture(
          deployIPFSStorageFixture
        );

        // Add funds to the contract
        const testCid = ethers.toUtf8Bytes("QmTest456");
        const payment = pricePerBlock * BigInt(minDuration);
        await ipfsStorage.pinFile(testCid, minDuration, { value: payment });

        // Check the transfer of funds
        await expect(ipfsStorage.withdraw())
          .to.changeEtherBalances(
            [owner, ipfsStorage],
            [payment, -payment]
          );
      });
    });
  });
});