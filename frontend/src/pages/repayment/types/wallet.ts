export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export type TransactionType =
  | "credit_received"
  | "payment"
  | "escrow_release"
  | "revenue"
  | "repayment"
  | "refund";

export interface Wallet {
  wallet_id: string;
  user_id: string;
  currency: string;
  balance: number;
  credit_available: number;
  loan_outstanding: number;
  total_revenue: number;
  amount_repaid: number;
  payment_status: PaymentStatus;
  last_updated: string;
}

export interface WalletSummary extends Wallet {
  pending_revenue: number;
  total_earnings: number;
}

export interface WalletTransaction {
  transaction_id: string;
  wallet_id: string;
  user_id: string;

  type: TransactionType;

  amount: number;
  status: PaymentStatus;

  description: string;

  created_at: string;

  balance_after: number;
}

export interface CreateWalletRequest {
  user_id: string;
  currency?: string;
  initial_balance?: number;
  credit_limit?: number;
  loan_outstanding?: number;
}

export interface WalletCreditRequest {
  amount: number;
  source?: string;
  description?: string;
}

export interface WalletDebitRequest {
  amount: number;
  source?: string;
  description?: string;
}

export interface WalletRepaymentRequest {
  amount: number;
  source?: string;
  description?: string;
}

export interface WalletStatus {
  wallet_id: string;
  user_id: string;
  payment_status: PaymentStatus;
  can_repay: boolean;
  last_updated: string;
}