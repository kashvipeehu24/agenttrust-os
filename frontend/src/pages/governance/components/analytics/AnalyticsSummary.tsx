interface Props {
  fraudRate: number;
  alerts: number;
  policyViolations: number;
  securityScore: number;
}

export default function AnalyticsSummary({
  fraudRate,
  alerts,
  policyViolations,
  securityScore,
}: Props) {
  const cards = [
    {
      title: "Fraud Rate",
      value: `${fraudRate}%`,
      color: "text-red-600",
    },
    {
      title: "Active Alerts",
      value: alerts,
      color: "text-orange-600",
    },
    {
      title: "Policy Violations",
      value: policyViolations,
      color: "text-yellow-600",
    },
    {
      title: "Security Score",
      value: `${securityScore}%`,
      color: "text-green-600",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <p className="text-sm text-gray-500">
            {card.title}
          </p>

          <p className={`mt-3 text-3xl font-bold ${card.color}`}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}