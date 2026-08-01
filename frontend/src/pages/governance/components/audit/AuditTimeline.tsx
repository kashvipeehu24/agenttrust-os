import { useAudits } from "../hooks/useAudits";
import AuditEventCard from "./AuditEventCard";

export default function AuditTimeline() {
  const { audits } = useAudits();

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Audit Timeline
        </h2>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          {audits.length} Events
        </span>
      </div>

      {audits.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">
          No audit events available.
        </div>
      ) : (
        <div className="space-y-4">
          {audits.map((event) => (
            <AuditEventCard
              key={event.id}
              event={event}
            />
          ))}
        </div>
      )}
    </div>
  );
}