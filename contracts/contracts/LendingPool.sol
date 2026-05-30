// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract LendingPool is Ownable, ReentrancyGuard {
    enum LoanStatus {
        Pending,
        Approved,
        Rejected,
        Disbursed,
        Repaid
    }

    struct LoanRequest {
        uint256 groupId;
        address borrower;
        uint256 amount;
        string purpose;
        uint256 approvals;
        uint256 rejections;
        uint256 voteDeadline;
        LoanStatus status;
    }

    uint256 public nextLoanId;
    uint256 public approvalThreshold = 2;
    uint256 public votingPeriod = 3 days;

    mapping(uint256 => LoanRequest) public loans;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => mapping(address => bool)) public isGroupMember;

    event MemberRegistered(uint256 indexed groupId, address indexed member);
    event LoanRequested(uint256 indexed loanId, uint256 indexed groupId, address indexed borrower, uint256 amount);
    event LoanVoted(uint256 indexed loanId, address indexed voter, bool approved);
    event LoanApproved(uint256 indexed loanId);
    event LoanRejected(uint256 indexed loanId);
    event LoanDisbursed(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event LoanRepaid(uint256 indexed loanId, address indexed borrower, uint256 amount);

    constructor() Ownable(msg.sender) {}

    receive() external payable {}

    modifier onlyGroupMember(uint256 groupId) {
        require(isGroupMember[groupId][msg.sender], "Not a group member");
        _;
    }

    function registerGroupMember(uint256 groupId, address member) external onlyOwner {
        require(member != address(0), "Invalid member");
        isGroupMember[groupId][member] = true;
        emit MemberRegistered(groupId, member);
    }

    function setApprovalThreshold(uint256 threshold) external onlyOwner {
        require(threshold > 0, "Threshold required");
        approvalThreshold = threshold;
    }

    function requestLoan(uint256 groupId, uint256 amount, string calldata purpose)
        external
        onlyGroupMember(groupId)
        returns (uint256 loanId)
    {
        require(amount > 0, "Amount required");

        loanId = nextLoanId++;
        loans[loanId] = LoanRequest({
            groupId: groupId,
            borrower: msg.sender,
            amount: amount,
            purpose: purpose,
            approvals: 0,
            rejections: 0,
            voteDeadline: block.timestamp + votingPeriod,
            status: LoanStatus.Pending
        });

        emit LoanRequested(loanId, groupId, msg.sender, amount);
    }

    function voteOnLoan(uint256 loanId, bool approved) external {
        LoanRequest storage loan = loans[loanId];

        require(loan.borrower != address(0), "Loan does not exist");
        require(loan.status == LoanStatus.Pending, "Voting closed");
        require(block.timestamp <= loan.voteDeadline, "Voting expired");
        require(isGroupMember[loan.groupId][msg.sender], "Not a group member");
        require(msg.sender != loan.borrower, "Borrower cannot vote");
        require(!hasVoted[loanId][msg.sender], "Already voted");

        hasVoted[loanId][msg.sender] = true;

        if (approved) {
            loan.approvals += 1;
            emit LoanVoted(loanId, msg.sender, true);

            if (loan.approvals >= approvalThreshold) {
                loan.status = LoanStatus.Approved;
                emit LoanApproved(loanId);
            }
        } else {
            loan.rejections += 1;
            emit LoanVoted(loanId, msg.sender, false);

            if (loan.rejections >= approvalThreshold) {
                loan.status = LoanStatus.Rejected;
                emit LoanRejected(loanId);
            }
        }
    }

    function disburseLoan(uint256 loanId) external onlyOwner nonReentrant {
        LoanRequest storage loan = loans[loanId];

        require(loan.status == LoanStatus.Approved, "Loan not approved");
        require(address(this).balance >= loan.amount, "Insufficient pool balance");

        loan.status = LoanStatus.Disbursed;

        (bool sent,) = payable(loan.borrower).call{value: loan.amount}("");
        require(sent, "Disbursement failed");

        emit LoanDisbursed(loanId, loan.borrower, loan.amount);
    }

    function repayLoan(uint256 loanId) external payable nonReentrant {
        LoanRequest storage loan = loans[loanId];

        require(loan.status == LoanStatus.Disbursed, "Loan not active");
        require(msg.sender == loan.borrower, "Only borrower");
        require(msg.value >= loan.amount, "Full repayment required");

        loan.status = LoanStatus.Repaid;

        emit LoanRepaid(loanId, msg.sender, msg.value);
    }
}
