// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title Escrow
 * @notice Manages escrow funds for autonomous AI agent loans.
 * Funds can be locked, released, or refunded.
 */
contract Escrow {

    // ---------------------------------------------------------
    // ENUMS
    // ---------------------------------------------------------

    enum EscrowStatus {
        Pending,
        Locked,
        Released,
        Refunded
    }

    // ---------------------------------------------------------
    // STRUCT
    // ---------------------------------------------------------

    struct EscrowAccount {
        uint256 escrowId;
        address payer;
        address beneficiary;
        uint256 amount;
        uint256 createdAt;
        EscrowStatus status;
        bool exists;
    }

    // ---------------------------------------------------------
    // STORAGE
    // ---------------------------------------------------------

    uint256 public nextEscrowId;

    mapping(uint256 => EscrowAccount) private escrows;

    // ---------------------------------------------------------
    // EVENTS
    // ---------------------------------------------------------

    event EscrowCreated(
        uint256 indexed escrowId,
        address indexed payer,
        address indexed beneficiary,
        uint256 amount
    );

    event FundsLocked(
        uint256 indexed escrowId
    );

    event FundsReleased(
        uint256 indexed escrowId
    );

    event FundsRefunded(
        uint256 indexed escrowId
    );

    // ---------------------------------------------------------
    // CREATE ESCROW
    // ---------------------------------------------------------

    function createEscrow(
        address beneficiary,
        uint256 amount
    )
        external
        returns (uint256)
    {
        require(beneficiary != address(0), "Invalid beneficiary");
        require(amount > 0, "Amount must be greater than zero");

        nextEscrowId++;

        escrows[nextEscrowId] = EscrowAccount({
            escrowId: nextEscrowId,
            payer: msg.sender,
            beneficiary: beneficiary,
            amount: amount,
            createdAt: block.timestamp,
            status: EscrowStatus.Pending,
            exists: true
        });

        emit EscrowCreated(
            nextEscrowId,
            msg.sender,
            beneficiary,
            amount
        );

        return nextEscrowId;
    }

    // ---------------------------------------------------------
    // LOCK FUNDS
    // ---------------------------------------------------------

    function lockFunds(
        uint256 escrowId
    )
        external
    {
        require(
            escrows[escrowId].exists,
            "Escrow not found"
        );

        escrows[escrowId].status = EscrowStatus.Locked;

        emit FundsLocked(escrowId);
    }

    // ---------------------------------------------------------
    // RELEASE FUNDS
    // ---------------------------------------------------------

    function releaseFunds(
        uint256 escrowId
    )
        external
    {
        require(
            escrows[escrowId].exists,
            "Escrow not found"
        );

        require(
            escrows[escrowId].status == EscrowStatus.Locked,
            "Funds not locked"
        );

        escrows[escrowId].status = EscrowStatus.Released;

        emit FundsReleased(escrowId);
    }

    // ---------------------------------------------------------
    // REFUND FUNDS
    // ---------------------------------------------------------

    function refundFunds(
        uint256 escrowId
    )
        external
    {
        require(
            escrows[escrowId].exists,
            "Escrow not found"
        );

        escrows[escrowId].status = EscrowStatus.Refunded;

        emit FundsRefunded(escrowId);
    }

    // ---------------------------------------------------------
    // VIEW ESCROW
    // ---------------------------------------------------------

    function getEscrow(
        uint256 escrowId
    )
        external
        view
        returns (EscrowAccount memory)
    {
        require(
            escrows[escrowId].exists,
            "Escrow not found"
        );

        return escrows[escrowId];
    }
}