export type TransactionType =
  | "credit_received"
  | "payment"
  | "escrow_release"
  | "revenue"
  | "repayment"
  | "refund";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export interface TransactionRecord {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  status: PaymentStatus;
  date: string;
  source: string;
  reference: string;
}