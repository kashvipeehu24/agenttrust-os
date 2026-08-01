import { useAudits } from "../hooks/useAudits";
import AuditEventCard from "./AuditEventCard";

export default function AuditTimeline() {
  const { audits } = useAudits();

  return (
    <div className="space-y-4">
      {audits.map((event) => (
        <AuditEventCard
          key={event.id}
          event={event}
        />
      ))}
    </div>
  );
}