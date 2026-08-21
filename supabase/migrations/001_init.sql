-- FortressFleet: Master Database Schema (Supabase PostgreSQL + pgvector)

create extension if not exists "uuid-ossp";
create extension if not exists "vector";

-- 1. Agent Registry Table
create table public.agent_registry (
  id uuid primary key default uuid_generate_v4(),
  agent_slug text unique not null,
  name text not null,
  department text not null,
  description text not null,
  version text not null default '1.0.0',
  model_id text not null default 'gemini-2.5-flash',
  capabilities text[] not null default '{}',
  required_scopes text[] not null default '{}',
  sla_status text not null default 'healthy',
  uptime_pct numeric(5,2) not null default 99.99,
  total_runs int not null default 0,
  is_approved boolean not null default true,
  author text not null,
  created_at timestamptz not null default now()
);

-- 2. Workflow Execution Runs
create table public.workflow_runs (
  id uuid primary key default uuid_generate_v4(),
  workflow_name text not null,
  hero_persona text not null default 'Elena Vance (ESG & Supply Chain Risk Auditor)',
  status text not null default 'queued',
  lead_agent_id uuid references public.agent_registry(id) on delete set null,
  input_payload jsonb not null default '{}',
  output_summary text,
  risk_score int default 0,
  approval_status text default 'none',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Memory Bank (Persistent Cross-Session Vector Store)
create table public.memory_bank (
  id uuid primary key default uuid_generate_v4(),
  entity_type text not null,
  entity_id text not null,
  entity_name text not null,
  memory_key text not null,
  content text not null,
  embedding vector(768),
  confidence_score numeric(3,2) default 0.95,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- 4. OpenTelemetry Agent Observability Traces
create table public.agent_traces (
  id uuid primary key default uuid_generate_v4(),
  run_id uuid references public.workflow_runs(id) on delete cascade,
  trace_id text not null,
  span_id text not null,
  parent_span_id text,
  agent_slug text not null,
  step_number int not null,
  step_type text not null,
  status text not null default 'success',
  reasoning text,
  attributes jsonb not null default '{}',
  duration_ms int not null default 0,
  created_at timestamptz not null default now()
);

-- 5. Model Armor Security Incidents
create table public.security_events (
  id uuid primary key default uuid_generate_v4(),
  run_id uuid references public.workflow_runs(id) on delete set null,
  threat_type text not null,
  severity text not null,
  raw_payload text not null,
  sanitized_payload text,
  action_taken text not null,
  shield_engine text not null default 'Gemma-2-Guardrail + Neural Filter',
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.agent_registry enable row level security;
alter table public.workflow_runs enable row level security;
alter table public.memory_bank enable row level security;
alter table public.agent_traces enable row level security;
alter table public.security_events enable row level security;

-- Policies
create policy "Allow all for demo" on public.agent_registry for all using (true);
create policy "Allow all for demo" on public.workflow_runs for all using (true);
create policy "Allow all for demo" on public.memory_bank for all using (true);
create policy "Allow all for demo" on public.agent_traces for all using (true);
create policy "Allow all for demo" on public.security_events for all using (true);
