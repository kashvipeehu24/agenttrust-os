import type { Alert } from "../types/alert";

export async function getAlerts(): Promise<Alert[]> {
  return Promise.resolve([
    {
      id: "ALT-001",
      title: "Suspicious Wallet Activity",
      description:
        "Multiple high-value transactions detected in a short period.",
      severity: "Critical",
      status: "Open",
      timestamp: "2026-08-01 10:15 AM",
    },
    {
      id: "ALT-002",
      title: "Policy Violation",
      description:
        "Agent exceeded its spending limit defined by governance policy.",
      severity: "High",
      status: "Open",
      timestamp: "2026-08-01 09:40 AM",
    },
    {
      id: "ALT-003",
      title: "Authentication Success",
      description:
        "Multi-factor authentication completed successfully.",
      severity: "Low",
      status: "Resolved",
      timestamp: "2026-08-01 08:10 AM",
    },
  ]);
}