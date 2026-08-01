export interface AuditEvent {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
}