import { useAlerts } from "../hooks/useAlerts";

export default function FraudTable() {
  const { alerts } = useAlerts();

  return (
    <table className="w-full border">
      <thead>
        <tr>
          <th className="border p-2">Alert</th>
          <th className="border p-2">Severity</th>
        </tr>
      </thead>

      <tbody>
        {alerts.map((alert) => (
          <tr key={alert.id}>
            <td className="border p-2">{alert.title}</td>
            <td className="border p-2">{alert.severity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}