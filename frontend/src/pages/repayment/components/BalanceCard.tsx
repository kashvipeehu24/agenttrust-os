export type BalanceCardProps = {
  label: string;
  value: string;
  helperText?: string;
  tone?: 'positive' | 'warning' | 'neutral' | 'danger';
};

const toneClasses: Record<NonNullable<BalanceCardProps['tone']>, string> = {
  positive: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  danger: 'bg-rose-50 text-rose-700 border-rose-200',
};

export function BalanceCard({
  label,
  value,
  helperText,
  tone = 'neutral',
}: BalanceCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-600">{label}</p>
        <span
          className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${toneClasses[tone]}`}
        >
          {tone}
        </span>
      </div>
      <p className="mt-4 text-2xl font-semibold text-slate-900">{value}</p>
      {helperText ? <p className="mt-2 text-xs text-slate-500">{helperText}</p> : null}
    </div>
  );
}

export default BalanceCard;
