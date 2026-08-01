import type { AuditEvent } from "../types/audit";

export async function getAuditEvents(): Promise<AuditEvent[]> {
  return Promise.resolve([
    {
      id: "AUD-001",
      action: "CREATE",
      actor: "Governance Engine",
      resource: "Policy #101",
      description: "New governance policy created.",
      timestamp: "2026-08-01 09:15 AM",
    },
    {
      id: "AUD-002",
      action: "UPDATE",
      actor: "Security Admin",
      resource: "Wallet Limit",
      description: "Updated transaction spending limit.",
      timestamp: "2026-08-01 10:30 AM",
    },
    {
      id: "AUD-003",
      action: "DELETE",
      actor: "Compliance Officer",
      resource: "Expired Policy",
      description: "Removed deprecated governance policy.",
      timestamp: "2026-08-01 11:05 AM",
    },
  ]);
}