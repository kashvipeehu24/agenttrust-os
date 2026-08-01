import type { SecurityStatus } from "../types/security";

interface Props {
  status: SecurityStatus;
}

export default function SecurityStatus({ status }: Props) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow">
      <h3 className="font-semibold">Security Status</h3>

      <p className="mt-2">
        Risk: <strong>{status.riskLevel}</strong>
      </p>

      <p>Health Score: {status.score}</p>

      <p>Alerts: {status.activeAlerts}</p>
    </div>
  );
}