export type StepType = 
  | 'thought' 
  | 'tool_call' 
  | 'tool_response' 
  | 'model_armor_scan' 
  | 'policy_gate' 
  | 'memory_lookup'
  | 'zero_trust_auth';

export type StepStatus = 'success' | 'warning' | 'violation' | 'intercepted' | 'pending';

export interface AgentTrace {
  id: string;
  trace_id: string;
  span_id: string;
  parent_span_id?: string;
  agent_slug: string;
  step_number: number;
  step_type: StepType;
  status: StepStatus;
  reasoning: string;
  attributes?: Record<string, unknown>;
  duration_ms: number;
  created_at: string;
}

export interface AgentRegistryItem {
  id: string;
  agent_slug: string;
  name: string;
  department: 'Supply Chain' | 'ESG Compliance' | 'Finance' | 'Logistics' | 'SecOps';
  description: string;
  version: string;
  model_id: string;
  capabilities: string[];
  required_scopes: string[];
  sla_status: 'healthy' | 'degraded' | 'offline';
  uptime_pct: number;
  total_runs: number;
  is_approved: boolean;
  author: string;
}

export type ThreatType = 
  | 'prompt_injection' 
  | 'pii_leakage' 
  | 'tool_poisoning' 
  | 'unauthorized_scope'
  | 'greenwashing_anomaly';

export interface SecurityEvent {
  id: string;
  run_id?: string;
  threat_type: ThreatType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  raw_payload: string;
  sanitized_payload: string;
  action_taken: 'redacted' | 'blocked' | 'flagged';
  shield_engine: string;
  created_at: string;
}

export interface MemoryBankItem {
  id: string;
  entity_type: 'vendor' | 'contract' | 'audit_finding' | 'dispute' | 'esg_report';
  entity_id: string;
  entity_name: string;
  memory_key: string;
  content: string;
  confidence_score: number;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface WorkflowRun {
  id: string;
  workflow_name: string;
  hero_persona: string;
  status: 'queued' | 'running' | 'waiting_approval' | 'completed' | 'blocked_by_armor' | 'failed';
  lead_agent_id: string;
  input_payload: {
    vendor_name: string;
    rfq_document: string;
    proposed_po_amount: number;
    destination: string;
    esg_claim: string;
  };
  output_summary?: string;
  risk_score: number;
  approval_status: 'none' | 'pending' | 'approved' | 'rejected';
  traces: AgentTrace[];
  security_events: SecurityEvent[];
  created_at: string;
  updated_at: string;
}

export interface ERPInventoryRecord {
  sku: string;
  item_name: string;
  warehouse: string;
  current_stock: number;
  safety_stock: number;
  supplier_id: string;
  unit_cost_usd: number;
}
