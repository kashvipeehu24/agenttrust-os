export interface AuditEvent {
  id: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  actor: string;
  resource: string;
  description: string;
  timestamp: string;
}