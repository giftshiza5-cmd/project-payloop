const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CircleVault", function () {
  it("creates a group, accepts contributions, and executes multi-sig withdrawals", async function () {
    const [creator, signerTwo, member, recipient] = await ethers.getSigners();
    const CircleVault = await ethers.getContractFactory("CircleVault");
    const vault = await CircleVault.deploy();

    await vault.createGroup("Nairobi Chama", [member.address], [creator.address, signerTwo.address], 2);

    await vault.connect(member).contribute(0, { value: ethers.parseEther("1") });

    expect(await vault.contributions(0, member.address)).to.equal(ethers.parseEther("1"));

    await vault.requestWithdrawal(0, recipient.address, ethers.parseEther("0.4"), "Emergency loan");
    await vault.approveWithdrawal(0);

    await expect(vault.connect(signerTwo).approveWithdrawal(0)).to.changeEtherBalances(
      [vault, recipient],
      [-ethers.parseEther("0.4"), ethers.parseEther("0.4")],
    );

    const request = await vault.withdrawalRequests(0);
    expect(request.executed).to.equal(true);
  });
});
