import { useMonitoring } from "../hooks/useMonitoring";

export default function TransactionTable() {
  const { events } = useMonitoring();

  return (
    <table className="w-full border">
      <thead>
        <tr>
          <th className="border p-2">Type</th>
          <th className="border p-2">Status</th>
          <th className="border p-2">Value</th>
        </tr>
      </thead>

      <tbody>
        {events.map((event) => (
          <tr key={event.id}>
            <td className="border p-2">{event.type}</td>
            <td className="border p-2">{event.status}</td>
            <td className="border p-2">{event.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}