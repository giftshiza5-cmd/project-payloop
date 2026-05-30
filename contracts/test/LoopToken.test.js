const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LoopToken", function () {
  it("mints LoopPoints rewards for authorized minters", async function () {
    const [owner, minter, member] = await ethers.getSigners();
    const LoopToken = await ethers.getContractFactory("LoopToken");
    const loopToken = await LoopToken.deploy();

    await loopToken.setRewardMinter(minter.address, true);
    await loopToken.connect(minter).rewardOnTimeContribution(member.address, ethers.parseUnits("10", 18));

    expect(await loopToken.name()).to.equal("LoopPoints");
    expect(await loopToken.symbol()).to.equal("LOOP");
    expect(await loopToken.balanceOf(member.address)).to.equal(ethers.parseUnits("10", 18));

    await expect(
      loopToken.connect(member).rewardOnTimeContribution(member.address, ethers.parseUnits("1", 18)),
    ).to.be.revertedWith("Not authorized");

    expect(await loopToken.owner()).to.equal(owner.address);
  });
});
