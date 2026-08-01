import type { AuditEvent } from "../types/audit";

interface Props {
  event: AuditEvent;
}

const actionColors = {
  CREATE: "bg-green-100 text-green-700",
  UPDATE: "bg-blue-100 text-blue-700",
  DELETE: "bg-red-100 text-red-700",
};

export default function AuditEventCard({ event }: Props) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {event.actor}
        </h3>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            actionColors[event.action]
          }`}
        >
          {event.action}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Resource:</span>{" "}
          {event.resource}
        </p>

        <p className="text-sm text-gray-600">
          <span className="font-medium">Description:</span>{" "}
          {event.description}
        </p>
      </div>

      <div className="mt-5 border-t pt-3 text-xs text-gray-500">
        {event.timestamp}
      </div>
    </div>
  );
}