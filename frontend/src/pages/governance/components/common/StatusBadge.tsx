import React from "react";

type Status =
  | "active"
  | "healthy"
  | "warning"
  | "pending"
  | "danger"
  | "critical"
  | "disabled"
  | "offline"
  | "info";

interface StatusBadgeProps {
  status: Status | string;
  className?: string;
}

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  healthy: "bg-green-100 text-green-700",

  warning: "bg-yellow-100 text-yellow-700",
  pending: "bg-yellow-100 text-yellow-700",

  danger: "bg-red-100 text-red-700",
  critical: "bg-red-100 text-red-700",

  disabled: "bg-gray-200 text-gray-700",
  offline: "bg-gray-200 text-gray-700",

  info: "bg-blue-100 text-blue-700",
};

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = "",
}) => {
  const key = status?.toLowerCase() ?? "info";

  const colors =
    statusColors[key] ??
    "bg-slate-100 text-slate-700";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${colors} ${className}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;