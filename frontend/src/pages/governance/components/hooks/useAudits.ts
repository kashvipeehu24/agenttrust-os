import { useEffect, useState } from "react";
import { getAuditEvents } from "../services/auditApi";
import type { AuditEvent } from "../types/audit";

export function useAudits() {
  const [audits, setAudits] = useState<AuditEvent[]>([]);

  useEffect(() => {
    getAuditEvents().then(setAudits);
  }, []);

  return { audits };
}