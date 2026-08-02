import type { WalletSummary } from "../types/wallet";

type WalletCardProps = {
  wallet: WalletSummary;
  trend?: string;
};

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

export default function WalletCard({
  wallet,
  trend = "+8.4% this month",
}: WalletCardProps) {
  const metrics = [
    {
      label: "Wallet Balance",
      value: formatCurrency(wallet.balance),
      accent: "text-emerald-600",
    },
    {
      label: "Credit Available",
      value: formatCurrency(wallet.credit_available),
      accent: "text-sky-600",
    },
    {
      label: "Loan Outstanding",
      value: formatCurrency(wallet.loan_outstanding),
      accent: "text-amber-600",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(wallet.total_revenue),
      accent: "text-violet-600",
    },
    {
      label: "Amount Repaid",
      value: formatCurrency(wallet.amount_repaid),
      accent: "text-rose-600",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Wallet
          </p>

          <h3 className="mt-2 text-2xl font-semibold text-slate-900">
            {formatCurrency(wallet.balance)}
          </h3>
        </div>

        <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          {trend}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-slate-200 bg-slate-50 p-3"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {item.label}
            </p>

            <p className={`mt-2 text-lg font-semibold ${item.accent}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}