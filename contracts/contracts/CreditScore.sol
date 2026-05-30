// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CreditScore is Ownable {
    struct Profile {
        uint256 onTimeContributions;
        uint256 lateContributions;
        uint256 loansRepaid;
        uint256 loansDefaulted;
        uint256 score;
        bool exists;
    }

    mapping(address => Profile) public profiles;

    event ProfileUpdated(address indexed member, uint256 score);

    constructor() Ownable(msg.sender) {}

    function recordContribution(address member, bool onTime) external onlyOwner {
        Profile storage profile = _profile(member);

        if (onTime) {
            profile.onTimeContributions += 1;
        } else {
            profile.lateContributions += 1;
        }

        _recalculate(member);
    }

    function recordLoanResult(address member, bool repaid) external onlyOwner {
        Profile storage profile = _profile(member);

        if (repaid) {
            profile.loansRepaid += 1;
        } else {
            profile.loansDefaulted += 1;
        }

        _recalculate(member);
    }

    function calculateScore(address member) public view returns (uint256) {
        Profile memory profile = profiles[member];

        if (!profile.exists) {
            return 500;
        }

        uint256 score = 500;
        score += profile.onTimeContributions * 12;
        score += profile.loansRepaid * 35;

        uint256 penalty = (profile.lateContributions * 18) + (profile.loansDefaulted * 60);

        if (penalty >= score) {
            return 300;
        }

        score -= penalty;

        if (score > 850) {
            return 850;
        }

        if (score < 300) {
            return 300;
        }

        return score;
    }

    function _profile(address member) internal returns (Profile storage profile) {
        require(member != address(0), "Invalid member");
        profile = profiles[member];

        if (!profile.exists) {
            profile.exists = true;
            profile.score = 500;
        }
    }

    function _recalculate(address member) internal {
        profiles[member].score = calculateScore(member);
        emit ProfileUpdated(member, profiles[member].score);
    }
}
