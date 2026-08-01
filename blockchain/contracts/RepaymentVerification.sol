// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title RepaymentVerification
 * @notice Tracks loan repayments and verifies repayment completion.
 * This contract ONLY handles repayment records.
 */
contract RepaymentVerification {

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    struct Repayment {
        uint256 loanId;
        address borrower;
        uint256 totalAmount;
        uint256 amountPaid;
        bool completed;
        uint256 lastPaymentAt;
    }

    mapping(uint256 => Repayment) private repayments;

    event RepaymentInitialized(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 totalAmount
    );

    event PaymentRecorded(
        uint256 indexed loanId,
        uint256 amount,
        uint256 totalPaid
    );

    event LoanFullyRepaid(
        uint256 indexed loanId
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    /**
     * Initialize repayment tracking
     */
    function initializeRepayment(
        uint256 loanId,
        address borrower,
        uint256 totalAmount
    )
        external
        onlyOwner
    {
        require(totalAmount > 0, "Invalid amount");

        repayments[loanId] = Repayment({
            loanId: loanId,
            borrower: borrower,
            totalAmount: totalAmount,
            amountPaid: 0,
            completed: false,
            lastPaymentAt: block.timestamp
        });

        emit RepaymentInitialized(
            loanId,
            borrower,
            totalAmount
        );
    }

    /**
     * Record repayment
     */
    function recordPayment(
        uint256 loanId,
        uint256 amount
    )
        external
        onlyOwner
    {
        Repayment storage repayment = repayments[loanId];

        require(
            !repayment.completed,
            "Loan already repaid"
        );

        require(
            amount > 0,
            "Invalid payment"
        );

        repayment.amountPaid += amount;
        repayment.lastPaymentAt = block.timestamp;

        emit PaymentRecorded(
            loanId,
            amount,
            repayment.amountPaid
        );

        if (repayment.amountPaid >= repayment.totalAmount) {

            repayment.completed = true;

            emit LoanFullyRepaid(
                loanId
            );
        }
    }

    /**
     * Check repayment status
     */
    function isLoanRepaid(
        uint256 loanId
    )
        external
        view
        returns (bool)
    {
        return repayments[loanId].completed;
    }

    /**
     * Retrieve repayment details
     */
    function getRepayment(
        uint256 loanId
    )
        external
        view
        returns (Repayment memory)
    {
        return repayments[loanId];
    }
}