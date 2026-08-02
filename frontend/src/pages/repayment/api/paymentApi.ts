export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type PaymentStatusMeta = {
  label: string;
  tone: 'neutral' | 'warn' | 'success' | 'danger';
};

export const paymentStatusMeta: Record<PaymentStatus, PaymentStatusMeta> = {
  pending: { label: 'Pending', tone: 'neutral' },
  processing: { label: 'Processing', tone: 'warn' },
  completed: { label: 'Completed', tone: 'success' },
  failed: { label: 'Failed', tone: 'danger' },
};

export const getPaymentStatusMeta = (status: PaymentStatus): PaymentStatusMeta =>
  paymentStatusMeta[status];
