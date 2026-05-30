const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LendingPool", function () {
  it("handles loan requests, voting, disbursement, and repayment", async function () {
    const [owner, borrower, voterOne, voterTwo] = await ethers.getSigners();
    const LendingPool = await ethers.getContractFactory("LendingPool");
    const pool = await LendingPool.deploy();

    await owner.sendTransaction({ to: await pool.getAddress(), value: ethers.parseEther("3") });
    await pool.registerGroupMember(0, borrower.address);
    await pool.registerGroupMember(0, voterOne.address);
    await pool.registerGroupMember(0, voterTwo.address);

    await pool.connect(borrower).requestLoan(0, ethers.parseEther("1"), "School fees");
    await pool.connect(voterOne).voteOnLoan(0, true);
    await pool.connect(voterTwo).voteOnLoan(0, true);

    expect((await pool.loans(0)).status).to.equal(1);

    await expect(pool.disburseLoan(0)).to.changeEtherBalances(
      [pool, borrower],
      [-ethers.parseEther("1"), ethers.parseEther("1")],
    );

    await pool.connect(borrower).repayLoan(0, { value: ethers.parseEther("1") });

    expect((await pool.loans(0)).status).to.equal(4);
  });
});
