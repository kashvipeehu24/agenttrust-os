// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title CreditPolicy
 * @notice Enforces spending policies for autonomous AI agents.
 */
contract CreditPolicy {

    struct Policy {
        uint256 maxTransactionAmount;
        uint256 dailyLimit;
        uint256 monthlyLimit;
        bool active;
    }

    address public owner;

    mapping(address => Policy) private policies;

    event PolicyCreated(
        address indexed agent,
        uint256 maxTransactionAmount,
        uint256 dailyLimit,
        uint256 monthlyLimit
    );

    event PolicyUpdated(
        address indexed agent
    );

    event PolicyDisabled(
        address indexed agent
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * Create or update a policy
     */
    function setPolicy(
        address agent,
        uint256 maxTransactionAmount,
        uint256 dailyLimit,
        uint256 monthlyLimit
    )
        external
        onlyOwner
    {
        policies[agent] = Policy({
            maxTransactionAmount: maxTransactionAmount,
            dailyLimit: dailyLimit,
            monthlyLimit: monthlyLimit,
            active: true
        });

        emit PolicyCreated(
            agent,
            maxTransactionAmount,
            dailyLimit,
            monthlyLimit
        );
    }

    /**
     * Disable policy
     */
    function disablePolicy(
        address agent
    )
        external
        onlyOwner
    {
        require(
            policies[agent].active,
            "Policy not active"
        );

        policies[agent].active = false;

        emit PolicyDisabled(agent);
    }

    /**
     * Validate a transaction
     */
    function validateTransaction(
        address agent,
        uint256 amount
    )
        external
        view
        returns (bool)
    {
        Policy memory policy = policies[agent];

        if (!policy.active) {
            return false;
        }

        if (amount > policy.maxTransactionAmount) {
            return false;
        }

        return true;
    }

    /**
     * Read policy
     */
    function getPolicy(
        address agent
    )
        external
        view
        returns (Policy memory)
    {
        return policies[agent];
    }
}