import type { MonitoringEvent } from "../types/monitoring";

export async function getMonitoringEvents(): Promise<MonitoringEvent[]> {
  return Promise.resolve([
    {
      id: "MON-001",
      type: "Wallet Transaction",
      status: "Success",
      value: 2500,
      timestamp: "2026-08-01 10:10 AM",
    },
    {
      id: "MON-002",
      type: "Loan Approval",
      status: "Pending",
      value: 15000,
      timestamp: "2026-08-01 10:25 AM",
    },
    {
      id: "MON-003",
      type: "AI Agent Spending",
      status: "Failed",
      value: 8000,
      timestamp: "2026-08-01 10:42 AM",
    },
    {
      id: "MON-004",
      type: "Policy Validation",
      status: "Success",
      value: 0,
      timestamp: "2026-08-01 11:05 AM",
    },
  ]);
}