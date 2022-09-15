const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const AbiCoder = require("web3-eth-abi");
const { ethers } = require("hardhat");

describe("CallRelayer", function () {
  // Basic function signature for NumTracker
  const functionSignature = AbiCoder.encodeFunctionSignature("setNum(uint256)");
  const incorrectFunctionSignature = AbiCoder.encodeFunctionSignature("setNum(uint256,uint256)");

  // Setup
  async function deployContractsFixture() {
    // Deploy contracts
    const CallRelayerFactory = await ethers.getContractFactory("CallRelayer");
    const callRelayer = await CallRelayerFactory.deploy();

    const NumTrackerFactory = await ethers.getContractFactory("NumTracker");
    const numTracker = await NumTrackerFactory.deploy();

    // Create a signer for convenience
    const signers = await ethers.getSigners();
    const user = signers[0];
    return { callRelayer, numTracker, user };
  }

  it("Should correctly multicall", async function () {
    const { callRelayer, numTracker, user } = await loadFixture(deployContractsFixture);
    const originalUpdateNum = await numTracker.timesNumHasBeenUpdated();

    const calldatas = [
      functionSignature + (AbiCoder.encodeParameters(["uint256"], [1])).substring(2),
      functionSignature + (AbiCoder.encodeParameters(["uint256"], [5])).substring(2),
      functionSignature + (AbiCoder.encodeParameters(["uint256"], [10])).substring(2)
    ];

    const targetAddresses = [
      numTracker.address,
      numTracker.address,
      numTracker.address
    ]

    await callRelayer.multicall(targetAddresses, calldatas);

    // Validate successful execution
    expect(await numTracker.num()).to.equal(10);
    expect(await numTracker.timesNumHasBeenUpdated()).to.equal(originalUpdateNum + 3);
    expect(await callRelayer.numCallsFailed(user.address)).to.equal(0);
  });

  it("Should revert all calls if one fails, but not revert overall transaction", async function () {
    const { callRelayer, numTracker, user } = await loadFixture(deployContractsFixture);
    const originalNum = await numTracker.num();
    const originalUpdateNum = await numTracker.timesNumHasBeenUpdated();

    const calldatas = [
      functionSignature + (AbiCoder.encodeParameters(["uint256"], [1])).substring(2),
      incorrectFunctionSignature + (AbiCoder.encodeParameters(["uint256"], [5])).substring(2),
      functionSignature + (AbiCoder.encodeParameters(["uint256"], [1000])).substring(2)
    ];

    const targetAddresses = [
      numTracker.address,
      numTracker.address,
      numTracker.address
    ]

    await callRelayer.multicall(targetAddresses, calldatas);

    // Validate unsuccessful execution
    expect(await numTracker.num()).to.equal(originalNum);
    expect(await numTracker.timesNumHasBeenUpdated()).to.equal(originalUpdateNum);
    expect(await callRelayer.numCallsFailed(user.address)).to.equal(1);
  });
});
