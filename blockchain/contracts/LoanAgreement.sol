// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title LoanAgreement
 * @author AgentTrust OS
 *
 * @notice
 * Stores loan agreements created for autonomous AI agents.
 *
 * This contract ONLY manages the loan lifecycle.
 * Escrow, policy enforcement and repayment validation
 * are implemented in separate contracts.
 */

contract LoanAgreement {

    // -----------------------------------------------------------------
    // ENUMS
    // -----------------------------------------------------------------

    enum LoanStatus {
        Pending,
        Approved,
        Active,
        Closed,
        Cancelled
    }

    // -----------------------------------------------------------------
    // STRUCT
    // -----------------------------------------------------------------

    struct Loan {

        uint256 loanId;

        address borrower;

        uint256 amount;

        uint256 interestRate;

        uint256 durationDays;

        uint256 createdAt;

        LoanStatus status;

        bool exists;
    }

    // -----------------------------------------------------------------
    // STORAGE
    // -----------------------------------------------------------------

    uint256 public nextLoanId;

    mapping(uint256 => Loan) private loans;

    // -----------------------------------------------------------------
    // EVENTS
    // -----------------------------------------------------------------

    event LoanCreated(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 amount
    );

    event LoanApproved(
        uint256 indexed loanId
    );

    event LoanActivated(
        uint256 indexed loanId
    );

    event LoanClosed(
        uint256 indexed loanId
    );

    event LoanCancelled(
        uint256 indexed loanId
    );

    // -----------------------------------------------------------------
    // CREATE LOAN
    // -----------------------------------------------------------------

    function createLoan(

        uint256 amount,

        uint256 interestRate,

        uint256 durationDays

    )

        external

        returns (uint256)

    {

        nextLoanId++;

        loans[nextLoanId] = Loan({

            loanId: nextLoanId,

            borrower: msg.sender,

            amount: amount,

            interestRate: interestRate,

            durationDays: durationDays,

            createdAt: block.timestamp,

            status: LoanStatus.Pending,

            exists: true

        });

        emit LoanCreated(
            nextLoanId,
            msg.sender,
            amount
        );

        return nextLoanId;
    }

    // -----------------------------------------------------------------
    // APPROVE
    // -----------------------------------------------------------------

    function approveLoan(
        uint256 loanId
    )
        external
    {

        require(
            loans[loanId].exists,
            "Loan not found"
        );

        loans[loanId].status =
            LoanStatus.Approved;

        emit LoanApproved(loanId);
    }

    // -----------------------------------------------------------------
    // ACTIVATE
    // -----------------------------------------------------------------

    function activateLoan(
        uint256 loanId
    )
        external
    {

        require(
            loans[loanId].exists,
            "Loan not found"
        );

        loans[loanId].status =
            LoanStatus.Active;

        emit LoanActivated(loanId);
    }

    // -----------------------------------------------------------------
    // CLOSE
    // -----------------------------------------------------------------

    function closeLoan(
        uint256 loanId
    )
        external
    {

        require(
            loans[loanId].exists,
            "Loan not found"
        );

        loans[loanId].status =
            LoanStatus.Closed;

        emit LoanClosed(loanId);
    }

    // -----------------------------------------------------------------
    // CANCEL
    // -----------------------------------------------------------------

    function cancelLoan(
        uint256 loanId
    )
        external
    {

        require(
            loans[loanId].exists,
            "Loan not found"
        );

        loans[loanId].status =
            LoanStatus.Cancelled;

        emit LoanCancelled(loanId);
    }

    // -----------------------------------------------------------------
    // VIEW
    // -----------------------------------------------------------------

    function getLoan(
        uint256 loanId
    )

        external

        view

        returns (

            Loan memory

        )

    {

        require(
            loans[loanId].exists,
            "Loan not found"
        );

        return loans[loanId];
    }
}