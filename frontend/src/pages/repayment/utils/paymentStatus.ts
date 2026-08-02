import type { PaymentStatus } from "../types/payment";

export function getStatusColor(
  status: PaymentStatus
): string {
  switch (status) {
    case "completed":
      return "text-emerald-600";

    case "processing":
      return "text-blue-600";

    case "pending":
      return "text-amber-600";

    case "failed":
      return "text-rose-600";

    default:
      return "text-slate-600";
  }
}

export function getStatusLabel(
  status: PaymentStatus
): string {
  switch (status) {
    case "completed":
      return "Completed";

    case "processing":
      return "Processing";

    case "pending":
      return "Pending";

    case "failed":
      return "Failed";

    default:
      return "Unknown";
  }
}