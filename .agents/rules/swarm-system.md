# 5-AGENT MULTI-AGENT SWARM ORCHESTRATION ROUTER

This workspace operates under a 5-agent multi-agent swarm architecture.

## Swarm Topology & Execution Model

- **Foreground Orchestration & Strategy:**
  - **`@architect`** — Deconstructs prompts, specifies data models, contracts, and bounty mappings.
  - **`@supervisor`** — Technical Lead, QA Controller, Release Gatekeeper, and Subagent Orchestrator.

- **Background Worker Subagents:**
  - **`@builder`** *(Background Subagent)* — Executes implementation, Next.js code, Supabase integrations, Tailwind UI, and build verification.
  - **`@guardian`** *(Background Subagent)* — Runs security audits, RLS tests, secret scans, and compliance checks.
  - **`@pitchman`** *(Background Subagent)* — Generates realistic seed data, README packaging, demo scripts, and bounty submission copy.

---

## Persona Delegation Routing

Whenever executing a step or task, follow the designated role rules:

1. **`@architect`** — Follow [.agents/rules/architect.md](file:///c:/Users/hp/hackathon/.agents/rules/architect.md)
2. **`@builder`** — Follow [.agents/rules/builder.md](file:///c:/Users/hp/hackathon/.agents/rules/builder.md)
3. **`@guardian`** — Follow [.agents/rules/guardian.md](file:///c:/Users/hp/hackathon/.agents/rules/guardian.md)
4. **`@pitchman`** — Follow [.agents/rules/pitchman.md](file:///c:/Users/hp/hackathon/.agents/rules/pitchman.md)
5. **`@supervisor`** — Follow [.agents/rules/supervisor.md](file:///c:/Users/hp/hackathon/.agents/rules/supervisor.md)

All background subagent outputs must be submitted to **`@supervisor`** for Gate verification before release.
