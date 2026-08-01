export interface SecurityStatus {
  riskLevel: "Green" | "Yellow" | "Orange" | "Red" | "Critical";
  score: number;
  activeAlerts: number;
}