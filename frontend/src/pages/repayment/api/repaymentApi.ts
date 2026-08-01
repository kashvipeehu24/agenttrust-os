export type RepaymentStatus = 'pending' | 'scheduled' | 'processing' | 'completed' | 'failed';

export type RepaymentScheduleItem = {
  id: string;
  label: string;
  amount: number;
  dueDate: string;
  status: RepaymentStatus;
};

export type RepaymentSummary = {
  totalLoan: number;
  amountPaid: number;
  remainingAmount: number;
  interest: number;
  dueDate: string;
  nextPayment: number;
  nextPaymentDate: string;
  repaymentRate: number;
};

export const mockRepaymentSchedule: RepaymentScheduleItem[] = [
  {
    id: 'rep-01',
    label: 'Initial Drawdown',
    amount: 32000,
    dueDate: '2026-08-10',
    status: 'completed',
  },
  {
    id: 'rep-02',
    label: 'Smart Repayment Run',
    amount: 12500,
    dueDate: '2026-08-16',
    status: 'scheduled',
  },
  {
    id: 'rep-03',
    label: 'Milestone-based Payment',
    amount: 18000,
    dueDate: '2026-08-24',
    status: 'pending',
  },
  {
    id: 'rep-04',
    label: 'Final Settlement',
    amount: 22000,
    dueDate: '2026-09-05',
    status: 'processing',
  },
];

export const mockRepaymentSummary: RepaymentSummary = {
  totalLoan: 128500,
  amountPaid: 76450,
  remainingAmount: 52050,
  interest: 12580,
  dueDate: '2026-08-30',
  nextPayment: 14250,
  nextPaymentDate: '2026-08-16',
  repaymentRate: 59.4,
};

export async function getRepaymentSummary(): Promise<RepaymentSummary> {
  return mockRepaymentSummary;
}

export async function getRepaymentSchedule(): Promise<RepaymentScheduleItem[]> {
  return mockRepaymentSchedule;
}
