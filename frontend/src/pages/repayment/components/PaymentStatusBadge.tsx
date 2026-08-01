import React from 'react';
import type { PaymentStatus } from '../../api/paymentApi';
import { getPaymentStatusMeta } from '../../api/paymentApi';

export type PaymentStatusBadgeProps = {
  status: PaymentStatus;
};

const toneClasses: Record<ReturnType<typeof getPaymentStatusMeta>['tone'], string> = {
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  warn: 'bg-amber-100 text-amber-800 border-amber-200',
  success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  danger: 'bg-rose-100 text-rose-800 border-rose-200',
};

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const meta = getPaymentStatusMeta(status);

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClasses[meta.tone]}`}
    >
      {meta.label}
    </span>
  );
}

export default PaymentStatusBadge;
