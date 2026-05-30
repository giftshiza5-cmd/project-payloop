// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LoopToken is ERC20, Ownable {
    mapping(address => bool) public rewardMinters;

    event RewardMinterUpdated(address indexed minter, bool allowed);
    event OnTimeContributionRewarded(address indexed member, uint256 amount);

    constructor() ERC20("LoopPoints", "LOOP") Ownable(msg.sender) {}

    function setRewardMinter(address minter, bool allowed) external onlyOwner {
        require(minter != address(0), "Invalid minter");
        rewardMinters[minter] = allowed;
        emit RewardMinterUpdated(minter, allowed);
    }

    function rewardOnTimeContribution(address member, uint256 amount) external {
        require(rewardMinters[msg.sender] || msg.sender == owner(), "Not authorized");
        require(member != address(0), "Invalid member");
        require(amount > 0, "Amount required");

        _mint(member, amount);

        emit OnTimeContributionRewarded(member, amount);
    }
}
