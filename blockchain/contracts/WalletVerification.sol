// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title WalletVerification
 * @notice Maintains a registry of verified wallets that are
 * allowed to participate in the AgentTrust OS ecosystem.
 */
contract WalletVerification {

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    struct WalletInfo {
        bool verified;
        bool frozen;
        uint256 verifiedAt;
    }

    mapping(address => WalletInfo) private wallets;

    event WalletVerified(
        address indexed wallet
    );

    event WalletFrozen(
        address indexed wallet
    );

    event WalletUnfrozen(
        address indexed wallet
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    /**
     * Verify a wallet
     */
    function verifyWallet(
        address wallet
    )
        external
        onlyOwner
    {
        require(wallet != address(0), "Invalid wallet");

        wallets[wallet] = WalletInfo({
            verified: true,
            frozen: false,
            verifiedAt: block.timestamp
        });

        emit WalletVerified(wallet);
    }

    /**
     * Freeze a wallet
     */
    function freezeWallet(
        address wallet
    )
        external
        onlyOwner
    {
        require(wallets[wallet].verified, "Wallet not verified");

        wallets[wallet].frozen = true;

        emit WalletFrozen(wallet);
    }

    /**
     * Unfreeze a wallet
     */
    function unfreezeWallet(
        address wallet
    )
        external
        onlyOwner
    {
        require(wallets[wallet].verified, "Wallet not verified");

        wallets[wallet].frozen = false;

        emit WalletUnfrozen(wallet);
    }

    /**
     * Check whether a wallet can transact
     */
    function isWalletActive(
        address wallet
    )
        external
        view
        returns (bool)
    {
        WalletInfo memory info = wallets[wallet];

        return info.verified && !info.frozen;
    }

    /**
     * Retrieve wallet details
     */
    function getWallet(
        address wallet
    )
        external
        view
        returns (WalletInfo memory)
    {
        return wallets[wallet];
    }
}