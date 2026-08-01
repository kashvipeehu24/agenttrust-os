export type TransactionType =
  | 'credit_received'
  | 'payment'
  | 'escrow_release'
  | 'revenue'
  | 'repayment'
  | 'refund';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type TransactionRecord = {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  status: PaymentStatus;
  date: string;
  source: string;
  reference: string;
};

export const mockTransactions: TransactionRecord[] = [
  {
    id: 'txn_1001',
    type: 'credit_received',
    title: 'AI Agent Credit Received',
    amount: 42000,
    status: 'completed',
    date: '2026-08-01',
    source: 'Agent Funding',
    reference: 'CR-1102',
  },
  {
    id: 'txn_1002',
    type: 'payment',
    title: 'Platform Service Payment',
    amount: -18500,
    status: 'completed',
    date: '2026-08-01',
    source: 'Infrastructure',
    reference: 'PMT-2204',
  },
  {
    id: 'txn_1003',
    type: 'escrow_release',
    title: 'Escrow Release',
    amount: 24000,
    status: 'processing',
    date: '2026-07-29',
    source: 'Milestone Escrow',
    reference: 'ESC-997',
  },
  {
    id: 'txn_1004',
    type: 'revenue',
    title: 'Revenue Received',
    amount: 53000,
    status: 'completed',
    date: '2026-07-27',
    source: 'Client Contract',
    reference: 'REV-334',
  },
  {
    id: 'txn_1005',
    type: 'repayment',
    title: 'Loan Repayment',
    amount: -12500,
    status: 'completed',
    date: '2026-07-20',
    source: 'Smart Repayment',
    reference: 'REP-505',
  },
  {
    id: 'txn_1006',
    type: 'refund',
    title: 'Refund Issued',
    amount: -3200,
    status: 'failed',
    date: '2026-07-18',
    source: 'Service Adjustment',
    reference: 'REF-889',
  },
];

export async function getTransactions(): Promise<TransactionRecord[]> {
  return mockTransactions;
}
