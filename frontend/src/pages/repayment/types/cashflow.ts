export interface CashFlowPoint {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export interface CashFlowSummary {
  totalIncome: number;
  totalExpense: number;
  netCashFlow: number;
  trend: string;
}