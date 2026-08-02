export type PaymentStatus =
  | "pending"
  | "scheduled"
  | "processing"
  | "completed"
  | "failed";

export interface Payment {
  id: string;
  amount: number;
  status: PaymentStatus;
  paidAt: string;
}