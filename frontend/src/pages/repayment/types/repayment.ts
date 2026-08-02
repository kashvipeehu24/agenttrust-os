export type RepaymentStatus =
  | "pending"
  | "scheduled"
  | "processing"
  | "completed"
  | "failed";

export interface RepaymentSummary {
  totalLoan: number;
  amountPaid: number;
  remainingAmount: number;
  interest: number;
  dueDate: string;
  nextPayment: number;
  nextPaymentDate: string;
  repaymentRate: number;
}

export interface RepaymentScheduleItem {
  id: string;
  label: string;
  amount: number;
  dueDate: string;
  status: RepaymentStatus;
}

export interface RepaymentRequest {
  amount: number;
}

export interface ForecastResponse {
  nextRepayment: number;
  estimatedCompletionDate: string;
  remainingDuration: string;
  futureBalance: number;
}

export interface AISuggestion {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
}