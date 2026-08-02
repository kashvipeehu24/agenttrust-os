export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type AgentStatus = 'Active' | 'Sandboxed' | 'Suspended' | 'Quarantined';
export type PolicyCategory = 'DLP' | 'Prompt Injection' | 'Tool Authorization' | 'Hallucination' | 'Compliance' | 'Rate Limit';
export type IncidentStatus = 'Open' | 'Investigating' | 'Resolved' | 'Ignored';

export interface Agent {
  id: string;
  name: string;
  codeName: string;
  description: string;
  model: string;
  version: string;
  department: string;
  owner: string;
  trustScore: number; // 0 to 100
  riskLevel: RiskLevel;
  status: AgentStatus;
  invocations24h: number;
  policyViolations24h: number;
  avgLatencyMs: number;
  lastActive: string;
  createdDate: string;
  avatarUrl?: string;
  permissions: {
    databaseRead: boolean;
    databaseWrite: boolean;
    shellExecution: boolean;
    emailSending: boolean;
    apiAccess: boolean;
    webBrowsing: boolean;
    fileSystemAccess: boolean;
  };
  assignedPolicies: string[]; // Policy IDs
  tags: string[];
}

export interface Policy {
  id: string;
  name: string;
  code: string;
  category: PolicyCategory;
  description: string;
  severity: RiskLevel;
  enabled: boolean;
  enforcementMode: 'Block & Alert' | 'Redact & Continue' | 'Flag for Review' | 'Shadow Log';
  triggerCount24h: number;
  rulesCount: number;
  lastUpdated: string;
  targetAgentsCount: number;
  rules: {
    id: string;
    condition: string;
    action: string;
  }[];
}

export interface ExecutionTrace {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  prompt: string;
  response: string;
  status: 'Allowed' | 'Sanitized' | 'Blocked';
  riskScore: number;
  latencyMs: number;
  tokensUsed: number;
  costUsd: number;
  detectedViolations: string[];
  toolCalls: {
    toolName: string;
    params: Record<string, any>;
    allowed: boolean;
  }[];
}

export interface Incident {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  title: string;
  category: PolicyCategory;
  riskLevel: RiskLevel;
  status: IncidentStatus;
  summary: string;
  rawPrompt: string;
  blockedToolCall?: string;
  ipAddress: string;
  userId: string;
  mitigationApplied: string;
  hash: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  eventType: 'Policy Created' | 'Agent Quarantined' | 'Permission Revoked' | 'Guardrail Triggered' | 'System Setting Updated';
  actor: string;
  target: string;
  details: string;
  hash: string;
  verificationStatus: 'Verified' | 'Pending';
}

export interface AgentPassport {
  certificateId: string;
  issuedAt: string;
  expiresAt: string;
  issuer: string;
  hardwareEnclave: string;
  signatureAlgorithm: string;
  publicFingerprint: string;
  merkleRootHash: string;
  attestationStatus: 'Verified' | 'Pending' | 'Revoked';
  trustSealLevel: 'Platinum Tier' | 'Gold Tier' | 'Silver Tier' | 'Sandbox Restricted';
}

export interface ReputationEvent {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  category: 'Security Audit' | 'Policy Compliance' | 'Incident Violation' | 'SLA Uptime' | 'Model Patch';
  title: string;
  description: string;
  scoreDelta: number; // e.g., +2.5 or -5.0
  resultingScore: number;
  verifier: string;
}

export interface IdentityHealthCheck {
  id: string;
  component: string;
  category: 'Model Weights Checksum' | 'ZK-Proof Attestation' | 'mTLS Connection' | 'Key Rotation' | 'Memory Safety Enclave';
  status: 'Healthy' | 'Warning' | 'Critical';
  latencyMs: number;
  lastChecked: string;
  details: string;
  proofHash: string;
}

export interface WalletBinding {
  agentId: string;
  agentName: string;
  walletAddress: string;
  network: string;
  multiSigRequirement: string;
  dailyAllowanceCapUsd: number;
  spent24hUsd: number;
  approvedTokens: { symbol: string; balance: string; usdValue: number }[];
  authorizedSigners: string[];
  autoFreezeThresholdUsd: number;
  status: 'Active & Bound' | 'Frozen' | 'Pending Approval';
}

export interface OrgUnitTrust {
  id: string;
  department: string;
  lead: string;
  agentCount: number;
  trustScore: number;
  riskProfile: RiskLevel;
  soc2Compliance: 'Compliant' | 'Audit In Progress' | 'Action Needed';
  iso27001Compliance: 'Compliant' | 'Audit In Progress';
  euAiActRiskClass: 'Limited Risk' | 'High Risk' | 'Prohibited Class Guarded';
}

export interface AgentSkill {
  id: string;
  name: string;
  code: string;
  category: string;
  riskRating: RiskLevel;
  toolSignature: string;
  executionCount24h: number;
  approvedModels: string[];
  parametersSchema: string;
  status: 'Approved' | 'Restricted' | 'Deprecating';
}

export interface SystemMetrics {
  trustIndex: number;
  activeAgents: number;
  totalAgents: number;
  blockedInvocations24h: number;
  totalInvocations24h: number;
  policyViolations24h: number;
  criticalIncidentsCount: number;
  avgLatencyMs: number;
  totalCost24h: number;
}
