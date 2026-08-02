export type RevenueSource =
  | "agent_contracts"
  | "escrow_fees"
  | "platform_commission"
  | "subscription"
  | "milestone_payment";

export interface RevenueEntry {
  id: string;
  source: RevenueSource;
  label: string;
  amount: number;
  status: "earned" | "pending";
  date: string;
}

export interface RevenueSummary {
  revenueEarned: number;
  pendingRevenue: number;
  totalEarnings: number;
  revenueSource: string;
  revenueTimeline: {
    label: string;
    value: number;
  }[];
}