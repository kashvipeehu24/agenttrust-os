import type { AuditEvent } from "../types/audit";

interface Props {
  event: AuditEvent;
}

export default function AuditEventCard({ event }: Props) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow">
      <h3 className="font-semibold">{event.action}</h3>

      <p className="mt-2 text-sm text-gray-600">
        Performed by: {event.actor}
      </p>

      <p className="mt-2 text-xs text-gray-400">
        {event.timestamp}
      </p>
    </div>
  );
}