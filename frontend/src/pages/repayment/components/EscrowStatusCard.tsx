type EscrowStatusCardProps = {
  totalEscrow: number;
  lockedFunds: number;
  releasedFunds: number;
  pendingRelease: number;
  activeContracts: number;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export default function EscrowStatusCard({
  totalEscrow,
  lockedFunds,
  releasedFunds,
  pendingRelease,
  activeContracts,
}: EscrowStatusCardProps) {
  const items = [
    {
      label: "Total Escrow",
      value: formatCurrency(totalEscrow),
      color: "text-indigo-600",
    },
    {
      label: "Locked Funds",
      value: formatCurrency(lockedFunds),
      color: "text-amber-600",
    },
    {
      label: "Released Funds",
      value: formatCurrency(releasedFunds),
      color: "text-emerald-600",
    },
    {
      label: "Pending Release",
      value: formatCurrency(pendingRelease),
      color: "text-rose-600",
    },
    {
      label: "Active Contracts",
      value: activeContracts.toString(),
      color: "text-sky-600",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-5 text-xl font-semibold text-slate-900">
        Escrow Status
      </h3>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-slate-200 bg-slate-50 p-3"
          >
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {item.label}
            </p>

            <p className={`mt-2 text-lg font-semibold ${item.color}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}