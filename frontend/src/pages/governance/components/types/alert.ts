export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "Resolved";
  timestamp: string;
}