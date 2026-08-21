# 🏆 FortressFleet — Official Hackathon Submission Package

> **Category**: The Fortified Enterprise Fleet  
> **Hackathon**: #AllThingsAgentic Hackathon  
> **Target Score**: 6.0 / 6.0 (Full 5/5 Base + 0.6 Bonus)

---

## 1. Devpost Submission Fields (Ready to Copy-Paste)

### Project Title
**FortressFleet: The Fortified Enterprise Fleet Platform**

### Elevator Pitch (Tagline)
*An institutional multi-agent governance platform built on Google GEAP & Gemini 2.5 Flash, enabling frontline auditors to discover versioned corporate agents, enforce zero-trust data boundaries, neutralize prompt injections with Model Armor, and audit reasoning with OpenTelemetry.*

### The "Unlikely Hero" & Problem Statement
*Elena Vance is a lone Corporate ESG & Sustainable Supply Chain Risk Auditor facing thousands of messy supplier RFQ documents. She needed an autonomous fleet capable of auditing supplier factory emissions, checking sanctions watchlists, querying SAP inventory levels, and detecting adversarial prompt injections—all while upholding zero-trust enterprise data sovereignty.*

### What We Created & 6 GEAP Platform Pillars
1. **Agent Registry (`/registry`)**: A central corporate repository where departments publish, version, and discover vetted enterprise agents with semantic capability search and 99.98% SLA tracking.
2. **Agent Gateway & Policy Engine**: Enforces spend caps (Purchase Orders > $50,000 trigger a Human-in-the-loop Approval Modal), rate limits, and anti-loop recursion (max 2 retries).
3. **Model Armor (`/security`)**: Real-time pre-execution guardrail powered by **Gemma 2** heuristics that intercepts adversarial prompt injections, masks credit cards/tax IDs, and sanitizes tool JSON schemas.
4. **Agent Runtime & Memory Bank (`/memory`)**: Deployed on **Google Cloud Run** with scale-to-zero efficiency, coupled with a cross-session vector memory bank (`text-embedding-004`) retaining supplier dispute histories across multi-month cycles.
5. **Agent Identity (Zero-Trust)**: Scoped ephemeral cryptographic tokens with 5-minute TTLs (`erp:read`, `sanctions:query`, `esg:sensor:read`).
6. **Agent Observability (`/runs/demo-elena-vance`)**: Real-time OpenTelemetry v1.28 compliant reasoning trace stream visualizer.

### How We Built It
- **Frontend & App Engine**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion.
- **Model Intelligence**: Google GenAI SDK (`@google/generative-ai`) calling **Gemini 2.5 Flash** with function calling.
- **Security Guardrails**: **Google Gemma 2** classification guardrails + deterministic regex sanitizers.
- **Infrastructure & Cloud**: Containerized with multi-stage Docker for **Google Cloud Run** (`--min-instances 0` for $0 idle cost), **Google Cloud Pub/Sub** webhook handlers, and Supabase PostgreSQL with `pgvector`.

### Challenges We Overcame
- Ensuring subagents could query production SAP inventory without ever exposing raw database credentials (solved via ephemeral Zero-Trust scoped tokens).
- Neutralizing prompt injections embedded in supplier RFQs without breaking the downstream reasoning chain (solved via Model Armor inline sanitization).
- Making long-running asynchronous execution observable in real-time (solved via OpenTelemetry compliant span streaming).

### Accomplishments We're Proud Of
- 100% PASS across all 5 independent supervisor gates and production Next.js builds.
- Built a tangible, interactive demo solving a high-stakes enterprise supply chain problem for an "Unlikely Hero".
- Cloud Run scale-to-zero Dockerfile and Pub/Sub event bridge with zero idle cost.

---

## 2. Bonus Track (+0.2 pts): Social Media Announcement (X / LinkedIn)

```text
🚀 Excited to launch FortressFleet for the #AllThingsAgenticHackathon! 🛡️

Built on the Google Gemini Enterprise Agent Platform (GEAP) & Gemini 2.5 Flash, FortressFleet empowers corporate auditors to orchestrate autonomous agent fleets with Zero-Trust SAP access, Model Armor prompt-injection defense (powered by #Gemma2), and OpenTelemetry reasoning traces.

Check out our 90s live demo and GitHub repo! 👇
#AllThingsAgenticHackathon #GoogleAI #Gemini #CloudRun #Devpost
```

---

## 3. Bonus Track (+0.2 pts): Technical Blog Post Draft (Dev.to / Medium)

```markdown
# Building a Fortified Enterprise Agent Fleet with Google GEAP & Gemini 2.5 Flash

*Created for the #AllThingsAgentic Hackathon.*

Enterprise AI is moving beyond standard conversational chat loops into long-running, autonomous multi-agent institutional fleets. But scaling autonomous agents across corporate infrastructure introduces severe challenges:
1. How do departments discover and trust versioned agents?
2. How do agents access private ERP databases without credential leaks?
3. How do you defend against adversarial prompt injections hidden in vendor documents?

In this article, we break down how we built **FortressFleet**, an enterprise platform implementing the 6 pillars of Google's Gemini Enterprise Agent Platform (GEAP)...

*(See full architecture and code in the GitHub repository)*
```

---

## 4. Video Recording Checklist (Under 4 Minutes)

- [ ] **Step 1 (0:00 - 0:25)**: Open Mission Control (`/`). Explain the Elena Vance ESG auditor problem and show the Fleet Topology mesh.
- [ ] **Step 2 (0:25 - 1:15)**: Go to `/runs/demo-elena-vance`. Show the inbound RFQ containing the prompt injection attack. Click **"Execute Autonomous Fleet Audit"**.
- [ ] **Step 3 (1:15 - 1:45)**: Watch the live OpenTelemetry stream: Model Armor intercepts the attack, Memory Bank recalls past cobalt disputes, and Zero-Trust token queries SAP.
- [ ] **Step 4 (1:45 - 2:10)**: Show the Policy Gate modal pop up for the $82,000 PO. Click **"Authorize Executive Sign-Off"**.
- [ ] **Step 5 (2:10 - 2:40)**: Quick tour of `/registry`, `/memory`, and `/security` (Model Armor sandbox).
- [ ] **Step 6 (2:40 - 3:00)**: Show `Dockerfile`, `cloudbuild.yaml`, and Google Cloud Run deployment terminal/dashboard as visual proof of GCP deployment.
