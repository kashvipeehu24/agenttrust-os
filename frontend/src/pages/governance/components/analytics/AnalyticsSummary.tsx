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
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-xl border bg-white p-4">
        <h4 className="text-sm text-gray-500">Fraud Rate</h4>
        <p className="text-2xl font-bold">{fraudRate}%</p>
      </div>

      <div className="rounded-xl border bg-white p-4">
        <h4 className="text-sm text-gray-500">Alerts</h4>
        <p className="text-2xl font-bold">{alerts}</p>
      </div>

      <div className="rounded-xl border bg-white p-4">
        <h4 className="text-sm text-gray-500">Policy Violations</h4>
        <p className="text-2xl font-bold">{policyViolations}</p>
      </div>

      <div className="rounded-xl border bg-white p-4">
        <h4 className="text-sm text-gray-500">Security Score</h4>
        <p className="text-2xl font-bold">{securityScore}%</p>
      </div>
    </div>
  );
}