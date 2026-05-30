// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract CircleVault is Ownable, ReentrancyGuard {
    struct Group {
        string name;
        address creator;
        uint256 balance;
        uint256 totalContributions;
        uint256 signerCount;
        uint256 approvalThreshold;
        bool exists;
    }

    struct WithdrawalRequest {
        uint256 groupId;
        address payable recipient;
        uint256 amount;
        string purpose;
        uint256 approvalCount;
        bool executed;
    }

    uint256 public nextGroupId;
    uint256 public nextWithdrawalRequestId;

    mapping(uint256 => Group) public groups;
    mapping(uint256 => mapping(address => bool)) public isMember;
    mapping(uint256 => mapping(address => uint256)) public contributions;
    mapping(uint256 => mapping(address => bool)) public isSigner;
    mapping(uint256 => WithdrawalRequest) public withdrawalRequests;
    mapping(uint256 => mapping(address => bool)) public hasApprovedWithdrawal;

    event GroupCreated(uint256 indexed groupId, string name, address indexed creator);
    event MemberAdded(uint256 indexed groupId, address indexed member, bool signer);
    event ContributionReceived(uint256 indexed groupId, address indexed member, uint256 amount);
    event WithdrawalRequested(
        uint256 indexed requestId,
        uint256 indexed groupId,
        address indexed recipient,
        uint256 amount,
        string purpose
    );
    event WithdrawalApproved(uint256 indexed requestId, address indexed signer, uint256 approvalCount);
    event WithdrawalExecuted(uint256 indexed requestId, address indexed recipient, uint256 amount);

    constructor() Ownable(msg.sender) {}

    modifier groupExists(uint256 groupId) {
        require(groups[groupId].exists, "Group does not exist");
        _;
    }

    modifier onlyGroupMember(uint256 groupId) {
        require(isMember[groupId][msg.sender], "Not a group member");
        _;
    }

    modifier onlyGroupSigner(uint256 groupId) {
        require(isSigner[groupId][msg.sender], "Not a group signer");
        _;
    }

    function createGroup(
        string calldata name,
        address[] calldata members,
        address[] calldata signers,
        uint256 approvalThreshold
    ) external returns (uint256 groupId) {
        require(bytes(name).length > 0, "Group name required");
        require(approvalThreshold > 0, "Threshold required");
        require(signers.length >= approvalThreshold, "Threshold too high");

        groupId = nextGroupId++;

        Group storage group = groups[groupId];
        group.name = name;
        group.creator = msg.sender;
        group.approvalThreshold = approvalThreshold;
        group.exists = true;

        _addMember(groupId, msg.sender, true);

        for (uint256 i = 0; i < members.length; i++) {
            _addMember(groupId, members[i], false);
        }

        for (uint256 i = 0; i < signers.length; i++) {
            _addMember(groupId, signers[i], true);
        }

        require(group.signerCount >= approvalThreshold, "Not enough signers");

        emit GroupCreated(groupId, name, msg.sender);
    }

    function addMember(uint256 groupId, address member, bool signer)
        external
        groupExists(groupId)
        onlyGroupSigner(groupId)
    {
        _addMember(groupId, member, signer);
    }

    function contribute(uint256 groupId) external payable groupExists(groupId) onlyGroupMember(groupId) {
        require(msg.value > 0, "Contribution required");

        groups[groupId].balance += msg.value;
        groups[groupId].totalContributions += msg.value;
        contributions[groupId][msg.sender] += msg.value;

        emit ContributionReceived(groupId, msg.sender, msg.value);
    }

    function requestWithdrawal(uint256 groupId, address payable recipient, uint256 amount, string calldata purpose)
        external
        groupExists(groupId)
        onlyGroupSigner(groupId)
        returns (uint256 requestId)
    {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount required");
        require(amount <= groups[groupId].balance, "Insufficient vault balance");

        requestId = nextWithdrawalRequestId++;
        withdrawalRequests[requestId] = WithdrawalRequest({
            groupId: groupId,
            recipient: recipient,
            amount: amount,
            purpose: purpose,
            approvalCount: 0,
            executed: false
        });

        emit WithdrawalRequested(requestId, groupId, recipient, amount, purpose);
    }

    function approveWithdrawal(uint256 requestId) external nonReentrant {
        WithdrawalRequest storage request = withdrawalRequests[requestId];
        Group storage group = groups[request.groupId];

        require(group.exists, "Request does not exist");
        require(isSigner[request.groupId][msg.sender], "Not a signer");
        require(!request.executed, "Already executed");
        require(!hasApprovedWithdrawal[requestId][msg.sender], "Already approved");

        hasApprovedWithdrawal[requestId][msg.sender] = true;
        request.approvalCount += 1;

        emit WithdrawalApproved(requestId, msg.sender, request.approvalCount);

        if (request.approvalCount >= group.approvalThreshold) {
            _executeWithdrawal(requestId);
        }
    }

    function _executeWithdrawal(uint256 requestId) internal {
        WithdrawalRequest storage request = withdrawalRequests[requestId];
        Group storage group = groups[request.groupId];

        require(!request.executed, "Already executed");
        require(request.amount <= group.balance, "Insufficient vault balance");

        request.executed = true;
        group.balance -= request.amount;

        (bool sent,) = request.recipient.call{value: request.amount}("");
        require(sent, "Transfer failed");

        emit WithdrawalExecuted(requestId, request.recipient, request.amount);
    }

    function _addMember(uint256 groupId, address member, bool signer) internal {
        require(member != address(0), "Invalid member");

        if (!isMember[groupId][member]) {
            isMember[groupId][member] = true;
            emit MemberAdded(groupId, member, false);
        }

        if (signer && !isSigner[groupId][member]) {
            isSigner[groupId][member] = true;
            groups[groupId].signerCount += 1;
            emit MemberAdded(groupId, member, true);
        }
    }
}
