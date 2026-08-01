import type { Policy } from "../types/policy";

export async function getPolicies(): Promise<Policy[]> {
  return Promise.resolve([
    {
      id: "POL-001",
      name: "Daily Spending Limit",
      enabled: true,
      description:
        "Limits autonomous agent spending to ₹50,000 per day.",
    },
    {
      id: "POL-002",
      name: "Wallet Whitelisting",
      enabled: true,
      description:
        "Allows transactions only with approved wallets.",
    },
    {
      id: "POL-003",
      name: "Emergency Kill Switch",
      enabled: false,
      description:
        "Disables all agent operations during critical incidents.",
    },
    {
      id: "POL-004",
      name: "Fraud Detection",
      enabled: true,
      description:
        "Automatically blocks suspicious financial transactions.",
    },
  ]);
}