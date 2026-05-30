const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CreditScore", function () {
  it("calculates scores from contribution and loan history", async function () {
    const [owner, member] = await ethers.getSigners();
    const CreditScore = await ethers.getContractFactory("CreditScore");
    const creditScore = await CreditScore.deploy();

    expect(await creditScore.calculateScore(member.address)).to.equal(500);

    await creditScore.recordContribution(member.address, true);
    await creditScore.recordContribution(member.address, false);
    await creditScore.recordLoanResult(member.address, true);

    expect(await creditScore.calculateScore(member.address)).to.equal(529);
    expect((await creditScore.profiles(member.address)).score).to.equal(529);
    expect(await creditScore.owner()).to.equal(owner.address);
  });
});
