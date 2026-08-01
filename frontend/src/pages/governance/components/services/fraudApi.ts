import type { Alert } from "../types/alert";

export async function getFraudAlerts(): Promise<Alert[]> {
  return Promise.resolve([
    {
      id: "FRD-001",
      title: "Suspicious Wallet Activity",
      description:
        "Multiple high-value transfers detected within 5 minutes.",
      severity: "Critical",
      status: "Open",
      timestamp: "2026-08-01 09:20 AM",
    },
    {
      id: "FRD-002",
      title: "Abnormal Agent Spending",
      description:
        "Agent spending exceeded the configured governance policy.",
      severity: "High",
      status: "Open",
      timestamp: "2026-08-01 10:05 AM",
    },
    {
      id: "FRD-003",
      title: "Repeated Authentication Attempts",
      description:
        "Multiple failed authentication attempts detected.",
      severity: "Medium",
      status: "Resolved",
      timestamp: "2026-08-01 10:45 AM",
    },
    {
      id: "FRD-004",
      title: "Duplicate Transaction",
      description:
        "Duplicate blockchain transaction blocked automatically.",
      severity: "Low",
      status: "Resolved",
      timestamp: "2026-08-01 11:15 AM",
    },
  ]);
}