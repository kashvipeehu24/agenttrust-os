export type WalletSummary = {
  walletBalance: number;
  creditAvailable: number;
  loanOutstanding: number;
  totalRevenue: number;
  amountRepaid: number;
  availableBalanceTrend: string;
};

export const mockWalletSummary: WalletSummary = {
  walletBalance: 182450.75,
  creditAvailable: 95000,
  loanOutstanding: 64250.4,
  totalRevenue: 260000,
  amountRepaid: 118750.6,
  availableBalanceTrend: "+8.4% this month",
};

export async function getWalletSummary(): Promise<WalletSummary> {
  return mockWalletSummary;
}
