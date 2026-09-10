export type StepType = 
  | 'thought' 
  | 'tool_call' 
  | 'tool_response' 
  | 'model_armor_scan' 
  | 'policy_gate' 
  | 'memory_lookup'
  | 'zero_trust_auth'
  | 'agent_synthesis'
  | 'task_delegation';

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
  department: 'Supply Chain' | 'ESG Compliance' | 'Finance' | 'Logistics' | 'SecOps' | string;
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
  is_custom?: boolean;
  created_by_governor?: boolean;
  custom_rationale?: string;
  system_instruction?: string;
}

export interface GovernorProblemInput {
  title: string;
  problem_description: string;
  department: string;
  priority: 'standard' | 'elevated' | 'critical';
  vendor_context?: string;
  estimated_amount_usd?: number;
}

export interface CustomAgentSpec {
  name: string;
  agent_slug: string;
  department: string;
  description: string;
  version: string;
  model_id: string;
  capabilities: string[];
  required_scopes: string[];
  system_instruction: string;
  rationale: string;
}

export interface GovernorDelegationTask {
  task_id: string;
  agent_slug: string;
  agent_name: string;
  is_custom: boolean;
  subtask_description: string;
  zero_trust_scope: string;
  status: 'pending' | 'running' | 'completed' | 'blocked';
  output_summary?: string;
  risk_score_contribution?: number;
}

export interface GovernorAnalysisResult {
  problem_title: string;
  capability_gap_detected: boolean;
  gap_analysis_summary: string;
  forensic_assessment?: {
    regulatory_exposure: string[];
    technical_failure_modes: string[];
    strategic_rationale: string;
  };
  matched_existing_agents: string[];
  missing_capabilities: string[];
  custom_agent_spec?: CustomAgentSpec;
  delegation_plan: GovernorDelegationTask[];
  recommended_action: string;
}

export interface GovernorOrchestrationRun {
  run_id: string;
  problem_input: GovernorProblemInput;
  analysis: GovernorAnalysisResult;
  traces: AgentTrace[];
  security_events: SecurityEvent[];
  composite_risk_score: number;
  policy_evaluation?: {
    allowed: boolean;
    requires_human_approval: boolean;
    policy_name: string;
    reason: string;
  };
  executive_verdict: string;
  created_at: string;
  completed_at?: string;
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
