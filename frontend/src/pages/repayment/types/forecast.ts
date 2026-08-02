export interface ForecastPoint {
  month: string;
  projectedRevenue: number;
  projectedRepayment: number;
  projectedBalance: number;
}

export interface ForecastSummary {
  expectedRevenue: number;
  expectedRepayment: number;
  expectedBalance: number;
  confidence: number;
}