import { useEffect, useState } from "react";
import { getAuditEvents } from "../services/auditApi";
import type { AuditEvent } from "../types/audit";

export function useAudits() {
  const [audits, setAudits] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAudits() {
      try {
        setLoading(true);

        const data = await getAuditEvents();

        setAudits(data);
      } catch (err) {
        setError("Failed to load audit events.");

        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAudits();
  }, []);

  return {
    audits,
    loading,
    error,
  };
}