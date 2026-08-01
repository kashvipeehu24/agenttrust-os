export type RevenueSource =
  | 'agent_contracts'
  | 'escrow_fees'
  | 'platform_commission'
  | 'subscription'
  | 'milestone_payment';

export type RevenueEntry = {
  id: string;
  source: RevenueSource;
  label: string;
  amount: number;
  status: 'earned' | 'pending';
  date: string;
};

export type RevenueSummary = {
  revenueEarned: number;
  pendingRevenue: number;
  totalEarnings: number;
  revenueSource: string;
  revenueTimeline: { label: string; value: number }[];
};

export const mockRevenueEntries: RevenueEntry[] = [
  {
    id: 'rev-01',
    source: 'agent_contracts',
    label: 'AI Service Contract',
    amount: 54000,
    status: 'earned',
    date: '2026-08-01',
  },
  {
    id: 'rev-02',
    source: 'escrow_fees',
    label: 'Escrow Fee Pool',
    amount: 18000,
    status: 'pending',
    date: '2026-07-29',
  },
  {
    id: 'rev-03',
    source: 'platform_commission',
    label: 'Platform Commission',
    amount: 36000,
    status: 'earned',
    date: '2026-07-25',
  },
  {
    id: 'rev-04',
    source: 'subscription',
    label: 'Subscription Revenue',
    amount: 22000,
    status: 'pending',
    date: '2026-07-21',
  },
  {
    id: 'rev-05',
    source: 'milestone_payment',
    label: 'Milestone Completion',
    amount: 47000,
    status: 'earned',
    date: '2026-07-17',
  },
];

export const mockRevenueSummary: RevenueSummary = {
  revenueEarned: 142000,
  pendingRevenue: 40000,
  totalEarnings: 182000,
  revenueSource: 'AI Agent Contracts',
  revenueTimeline: [
    { label: 'Jan', value: 18000 },
    { label: 'Feb', value: 24000 },
    { label: 'Mar', value: 30000 },
    { label: 'Apr', value: 27000 },
    { label: 'May', value: 36000 },
    { label: 'Jun', value: 41000 },
  ],
};

export async function getRevenueSummary(): Promise<RevenueSummary> {
  return mockRevenueSummary;
}

export async function getRevenueEntries(): Promise<RevenueEntry[]> {
  return mockRevenueEntries;
}
