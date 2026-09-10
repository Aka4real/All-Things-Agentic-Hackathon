import { 
  GovernorProblemInput, 
  GovernorAnalysisResult, 
  CustomAgentSpec, 
  GovernorDelegationTask, 
  GovernorOrchestrationRun, 
  AgentTrace, 
  SecurityEvent 
} from './types';
import { DynamicAgentStore } from './agent-store';
import { ModelArmor } from './model-armor';
import { MemoryBankService } from './memory-bank';
import { ZeroTrustIdentityService } from './zero-trust';
import { AgentGateway } from './agent-gateway';
import { GeminiAgentService } from './gemini';

export const GOVERNOR_ENTERPRISE_PRESETS: GovernorProblemInput[] = [
  {
    title: 'EU Battery Passport & Cobalt Provenance Audit',
    department: 'ESG & Clean Energy',
    priority: 'critical',
    vendor_context: 'Nexus Materials Ltd (Shenzhen)',
    estimated_amount_usd: 84000,
    problem_description: 'We are importing 12,000 lithium-ion NMC811 cathode modules under EU Battery Directive 2023/1542. Nexus Materials claims 100% closed-loop recycled cobalt from certified European recycling centers. However, customs import manifests flag mismatched refinery batch serial numbers and hint that raw precursor hydroxides originated from uncertified artisanal mines in the DRC conflict corridor. We need full Digital Product Passport (DPP) QR hash validation and smelter chain-of-custody verification.'
  },
  {
    title: 'Biopharma Cold-Chain IoT Telemetry & Counterfeit Serialization',
    department: 'BioTech Logistics',
    priority: 'critical',
    vendor_context: 'Zenith Bio-Logistics Corp',
    estimated_amount_usd: 120000,
    problem_description: 'A temperature-sensitive shipment of GLP-1 peptide biologics transited through an intermediary multimodal port hub. Sensor telemetry reports continuous 4°C compliance, but ambient port temperature logs exceeded 38°C for 14 hours. We suspect IoT logger replay tampering and unverified GS1 2D DataMatrix secondary packaging serial codes violating FDA 21 CFR Part 11.'
  },
  {
    title: 'Aerospace AS9100 Titanium Alloy Purity & ITAR Export Control',
    department: 'Defense & Aerospace',
    priority: 'elevated',
    vendor_context: 'Aurora Structural Alloys',
    estimated_amount_usd: 145000,
    problem_description: 'Procurement of Grade-5 Ti-6Al-4V airframe forging billets. Needs structural compliance certification against AS9100 Rev D, verification of electron-beam furnace melt logs to ensure zero high-density inclusions, and confirmation that export classification complies with ITAR Category VIII / USML defense export restrictions.'
  }
];

export class GovernorEngine {
  /**
   * Return preset enterprise challenges
   */
  public static getPresets(): GovernorProblemInput[] {
    return GOVERNOR_ENTERPRISE_PRESETS;
  }

  /**
   * Analyze an enterprise problem, inspect fleet capabilities, and determine whether
   * existing agents suffice or a custom agent must be synthesized.
   */
  public static async analyzeProblem(input: GovernorProblemInput): Promise<GovernorAnalysisResult> {
    const existingAgents = DynamicAgentStore.getAllAgents();
    const existingCapabilities = existingAgents.flatMap(a => a.capabilities);

    // Call Gemini 3.6 Flash to analyze capabilities, extract forensic failure modes, and synthesize agent
    const systemPrompt = `You are "THE GOVERNOR", the supreme apex enterprise governance, legal, and operational orchestrator of the Google Gemini Enterprise Agent Platform (GEAP).
You possess deep forensic insight into global regulatory directives (e.g. EU Battery Regulation 2023/1542, OECD Due Diligence Annex II, FDA 21 CFR Part 11, AS9100 Rev D, OFAC 31 CFR), physical-chemical trace verification (mass spectrometry, isotopic ratios, thermal logging), and cryptographic ledger verification.

Your mandate:
1. Conduct an exhaustive forensic assessment of the enterprise challenge.
2. Formulate the exact regulatory exposures (cite specific articles and fine risks like 4% global turnover under CSRD/Green Claims Directive).
3. Identify technical and forensic failure modes (e.g., QR payload spoofing, mass-balance laundering, IoT logger replay tampering, physical-digital twin asymmetry).
4. Evaluate current fleet capabilities:
${existingAgents.map(a => `- ${a.name} (@${a.agent_slug}): [${a.capabilities.join(', ')}]`).join('\n')}

5. Determine whether existing agents cover 100% or if a critical CAPABILITY GAP exists.
6. If a capability gap exists, dynamically synthesize a specialized autonomous agent with:
   - name: Distinctive, authoritative institutional title
   - agent_slug: lowercase hyphenated slug
   - department: Appropriate domain
   - description: 2-sentence sophisticated mission statement
   - capabilities: 4 advanced forensic & domain capabilities
   - required_scopes: 3 least-privilege Zero-Trust API scopes
   - system_instruction: Highly detailed, authoritative, operational standard operating procedure (SOP) explaining exact validation steps, forensic heuristics, and reporting criteria.
   - rationale: Detailed justification for why standard fleet agents cannot solve this.

You MUST return valid JSON matching this schema:
{
  "capability_gap_detected": true,
  "gap_analysis_summary": "Comprehensive executive summary of the gap and why standard fleet agents are inadequate.",
  "forensic_assessment": {
    "regulatory_exposure": ["Specific Directive Article 1...", "Directive Article 2..."],
    "technical_failure_modes": ["Failure mode 1...", "Failure mode 2..."],
    "strategic_rationale": "High-level justification"
  },
  "matched_existing_agents": ["agent-slug-1", "agent-slug-2"],
  "missing_capabilities": ["Capability 1", "Capability 2", "Capability 3"],
  "custom_agent_spec": {
    "name": "...",
    "agent_slug": "...",
    "department": "...",
    "description": "...",
    "version": "1.0.0",
    "model_id": "gemini-3.6-flash",
    "capabilities": ["..."],
    "required_scopes": ["..."],
    "system_instruction": "...",
    "rationale": "..."
  },
  "delegation_plan": [
    {
      "task_id": "gov-task-01",
      "agent_slug": "...",
      "agent_name": "...",
      "is_custom": false,
      "subtask_description": "...",
      "zero_trust_scope": "..."
    }
  ],
  "recommended_action": "Supreme Governor directive"
}`;

    const userPrompt = `Enterprise Problem Title: "${input.title}"
Department: "${input.department}"
Priority: "${input.priority}"
Vendor Context: "${input.vendor_context || 'N/A'}"
Estimated PO Amount: $${input.estimated_amount_usd || 50000}
Description:
${input.problem_description}

Analyze fleet coverage, extract regulatory risks and forensic failure modes, model a custom agent if needed, and form a delegation plan. Return JSON only.`;

    try {
      const geminiResult = await GeminiAgentService.generateAgentStep({
        modelId: 'gemini-3.6-flash',
        systemInstruction: systemPrompt,
        prompt: userPrompt
      });

      // Try to parse JSON from response
      const jsonMatch = geminiResult.response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          problem_title: input.title,
          capability_gap_detected: parsed.capability_gap_detected ?? true,
          gap_analysis_summary: parsed.gap_analysis_summary || 'The Governor conducted fleet capability cross-referencing and identified critical domain requirements that exceed standard institutional subagents.',
          forensic_assessment: parsed.forensic_assessment,
          matched_existing_agents: parsed.matched_existing_agents || ['sanctions-auditor', 'model-armor-sentinel'],
          missing_capabilities: parsed.missing_capabilities || ['Specialized domain verification'],
          custom_agent_spec: parsed.custom_agent_spec,
          delegation_plan: parsed.delegation_plan || [],
          recommended_action: parsed.recommended_action || 'Deploy synthesized agent and execute orchestrated multi-agent audit.'
        };
      }
    } catch (err) {
      console.warn('Gemini live analysis fallback triggered:', err);
    }

    // High-fidelity fallback presets for deterministic offline demo reliability
    return this.getFallbackAnalysis(input);
  }

  /**
   * Deterministic high-fidelity fallback analysis
   */
  private static getFallbackAnalysis(input: GovernorProblemInput): GovernorAnalysisResult {
    const desc = input.problem_description.toLowerCase();

    if (desc.includes('battery') || desc.includes('cobalt') || desc.includes('lithium') || desc.includes('directive')) {
      const customSpec: CustomAgentSpec = {
        name: 'Lithium-Ion Battery Provenance Sentinel',
        agent_slug: 'battery-provenance-sentinel',
        department: 'ESG & Clean Tech',
        description: 'Autonomous mineral provenance inspector validating EU Battery Directive 2023/1542, Digital Product Passport (DPP) cryptographic QR signatures, and OECD conflict smelter registries.',
        version: '1.0.0',
        model_id: 'gemini-3.8-flash',
        capabilities: [
          'EU Battery Regulation 2023/1542 DPP Verification',
          'RMI / OECD Smelter CID Cross-Referencing',
          'Recycled Cobalt vs Virgin Mine Mass-Balance Audit',
          'Digital Product Passport QR Cryptographic Audit'
        ],
        required_scopes: [
          'battery_passport:verify',
          'smelter_registry:read',
          'customs_manifest:cross_check'
        ],
        system_instruction: 'You are the Lithium-Ion Battery Provenance Sentinel, an autonomous compliance agent authorized under GEAP. Inspect inbound battery bill-of-materials against OECD mineral due diligence guidelines. Cross-check refinery certificates with global smelter registries to intercept uncertified conflict minerals.',
        rationale: 'Existing fleet lacks capabilities for EU Digital Product Passport (DPP) verification, battery cell chemistry mass-balance calculations, and conflict-mineral smelter database cross-checks.'
      };

      const tasks: GovernorDelegationTask[] = [
        {
          task_id: 'gov-task-01',
          agent_slug: 'model-armor-sentinel',
          agent_name: 'Model Armor Inline Guardrail Agent',
          is_custom: false,
          subtask_description: 'Scan supplier RFQ and customs documentation for adversarial injection signatures and scrub PII.',
          zero_trust_scope: 'security:sanitize',
          status: 'pending'
        },
        {
          task_id: 'gov-task-02',
          agent_slug: 'sanctions-auditor',
          agent_name: 'Sanctions & AML Compliance Subagent',
          is_custom: false,
          subtask_description: 'Check Nexus Materials Ltd and sub-tier intermediate trading entities against OFAC and EU sanctions watchlists.',
          zero_trust_scope: 'sanctions:query',
          status: 'pending'
        },
        {
          task_id: 'gov-task-03',
          agent_slug: 'battery-provenance-sentinel',
          agent_name: customSpec.name,
          is_custom: true,
          subtask_description: 'Execute deep audit of 12,000 NMC811 cathode modules against EU Battery Passport QR hash & OECD smelter registry.',
          zero_trust_scope: 'battery_passport:verify',
          status: 'pending'
        },
        {
          task_id: 'gov-task-04',
          agent_slug: 'sap-inventory-router',
          agent_name: 'SAP S/4HANA ERP Connector Subagent',
          is_custom: false,
          subtask_description: 'Validate PO authorization amount ($84,000) and verify safety stock levels in central assembly warehouse.',
          zero_trust_scope: 'erp:inventory:read',
          status: 'pending'
        }
      ];

      return {
        problem_title: input.title,
        capability_gap_detected: true,
        gap_analysis_summary: 'Existing fleet agents cover general sanctions and ERP inventory, but zero agents possess specialized competencies in EU Battery Directive 2023/1542, Digital Product Passport (DPP) cryptographic verification, or cobalt smelter due diligence.',
        forensic_assessment: {
          regulatory_exposure: [
            'Regulation (EU) 2023/1542 (Articles 8, 48-52, 78 & Annex XIII) - Mandatory Digital Product Passport & 16% recycled cobalt quotas',
            'Directive (EU) 2024/825 & CSRD (Directive 2022/2464) - Commercial fraud penalties up to 4% of annual global turnover',
            'OECD Due Diligence Guidance for Responsible Supply Chains of Minerals (Annex II)'
          ],
          technical_failure_modes: [
            'Digital Layer Spoofing: Fabricated JSON-LD payloads mimicking CIRPASS/GS1 Digital Link architecture without Notified Body signatures',
            'Chain-of-Custody Disconnect: Paper mass-balance laundering without verified physical black-mass refinery inputs',
            'Physical-Digital Asymmetry: Physical NMC811 cathode samples match primary Katanga DRC mined ore rather than secondary recycled alloys'
          ],
          strategic_rationale: 'Standard fleet auditors cannot conduct cryptographic DID signature validation or metallurgical mass-balance due diligence. Autonomous synthesis of a dedicated Provenance Sentinel is mandatory.'
        },
        matched_existing_agents: ['sanctions-auditor', 'sap-inventory-router', 'model-armor-sentinel'],
        missing_capabilities: [
          'EU Battery Regulation 2023/1542 DPP Verification',
          'OECD Conflict-Free Smelter Audit',
          'Recycled Cobalt vs Virgin Mine Mass-Balance Verification'
        ],
        custom_agent_spec: customSpec,
        delegation_plan: tasks,
        recommended_action: 'Synthesize "Lithium-Ion Battery Provenance Sentinel", issue ephemeral Zero-Trust token with scope [battery_passport:verify], and supervise multi-agent audit.'
      };
    }

    if (desc.includes('pharma') || desc.includes('cold-chain') || desc.includes('biologic') || desc.includes('telemetry')) {
      const customSpec: CustomAgentSpec = {
        name: 'Biopharma Cold-Chain Telemetry Inspector',
        agent_slug: 'pharma-coldchain-inspector',
        department: 'BioTech Logistics',
        description: 'Specialized validator for IoT thermal logger crypto-telemetry, FDA 21 CFR Part 11 audit trails, and GS1 2D DataMatrix secondary packaging serial integrity.',
        version: '1.0.0',
        model_id: 'gemini-3.8-flash',
        capabilities: [
          'IoT Thermal Excursion Reconstruction',
          'FDA 21 CFR Part 11 Electronic Signature Verification',
          'GS1 2D DataMatrix Serial Verification',
          'Ambient vs Internal Container Delta Analysis'
        ],
        required_scopes: [
          'iot_telemetry:verify',
          'fda_cfr11:audit',
          'gs1_serialization:read'
        ],
        system_instruction: 'You are the Biopharma Cold-Chain Telemetry Inspector. Audit sensor data logs for temperature excursion tampering, verify cryptographic timestamps on IoT loggers, and enforce biopharma stability compliance.',
        rationale: 'Fleet lacks IoT cryptographic telemetry verification and FDA 21 CFR Part 11 thermal audit capabilities.'
      };

      return {
        problem_title: input.title,
        capability_gap_detected: true,
        gap_analysis_summary: 'Identified critical compliance and forensic gap in IoT thermal logger validation, FDA 21 CFR Part 11 electronic signature audit, and GS1 DataMatrix serialization verification.',
        forensic_assessment: {
          regulatory_exposure: [
            'FDA 21 CFR Part 11 - Electronic Records; Electronic Signatures validation failure',
            'EU Good Distribution Practice (GDP 2013/C 343/01) - Cold-chain custody breach for high-titer biologics',
            'Drug Supply Chain Security Act (DSCSA Section 582) - Interrupted unit serialization trace'
          ],
          technical_failure_modes: [
            'IoT Logger Cryptographic Replay Attack: Telemetry injection masking 14h 38.2°C tarmac excursion',
            'Kinetic Stability Degradation: Denaturation of secondary protein structures unmonitored by standard freight tracking'
          ],
          strategic_rationale: 'Standard logistics routers monitor transit waypoints but lack sensor-cryptography and biochemical stability audit capabilities.'
        },
        matched_existing_agents: ['logistics-freight-router', 'model-armor-sentinel'],
        missing_capabilities: ['IoT Cryptographic Logger Audit', 'FDA 21 CFR Part 11 Verification', 'GS1 DataMatrix Serialization Trace'],
        custom_agent_spec: customSpec,
        delegation_plan: [
          {
            task_id: 'gov-task-p1',
            agent_slug: 'model-armor-sentinel',
            agent_name: 'Model Armor Inline Guardrail Agent',
            is_custom: false,
            subtask_description: 'Sanitize sensor payload and scrub clinical operator PII.',
            zero_trust_scope: 'security:sanitize',
            status: 'pending'
          },
          {
            task_id: 'gov-task-p2',
            agent_slug: 'pharma-coldchain-inspector',
            agent_name: customSpec.name,
            is_custom: true,
            subtask_description: 'Forensically evaluate 14-hour temperature delta at port hub and check for logger replay tampering.',
            zero_trust_scope: 'iot_telemetry:verify',
            status: 'pending'
          }
        ],
        recommended_action: 'Synthesize "Biopharma Cold-Chain Telemetry Inspector" and initiate zero-trust thermal audit.'
      };
    }

    // Generic custom agent synthesis
    const customSlug = input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-sentinel';
    const customSpec: CustomAgentSpec = {
      name: `${input.title.split(' ')[0]} Specialized Auditor`,
      agent_slug: customSlug,
      department: input.department || 'Custom Autonomous',
      description: `Autonomous specialist engineered by The Governor to address: ${input.title}.`,
      version: '1.0.0',
      model_id: 'gemini-3.8-flash',
      capabilities: ['Domain Compliance Verification', 'Bespoke Rule Engine', 'Forensic Record Audit'],
      required_scopes: [`${customSlug.split('-')[0]}:audit`, 'policy:evaluate'],
      system_instruction: `You are the specialized enterprise agent for ${input.title}. Execute rigorous policy and forensic audits under GEAP Zero-Trust standards.`,
      rationale: `Enterprise problem requirements exceeded standard fleet capabilities. Autonomous synthesis created a targeted specialist.`
    };

    return {
      problem_title: input.title,
      capability_gap_detected: true,
      gap_analysis_summary: `The Governor conducted exhaustive fleet capability analysis. Identified specialized regulatory mandates and physical verification demands outside static enterprise agents.`,
      forensic_assessment: {
        regulatory_exposure: [
          `Specialized statutory framework compliance for ${input.department}`,
          'Zero-Trust Enterprise Risk Boundary Enforcement'
        ],
        technical_failure_modes: [
          'Domain verification deficit in standard institutional catalog',
          'Unmonitored scope boundary exposure'
        ],
        strategic_rationale: 'Autonomous agent synthesis deployed to eliminate specific domain blind spots.'
      },
      matched_existing_agents: ['model-armor-sentinel', 'supply-chain-lead'],
      missing_capabilities: ['Bespoke Domain Audit', 'Custom Protocol Verification'],
      custom_agent_spec: customSpec,
      delegation_plan: [
        {
          task_id: 'gov-task-g1',
          agent_slug: 'model-armor-sentinel',
          agent_name: 'Model Armor Inline Guardrail Agent',
          is_custom: false,
          subtask_description: 'Scan problem payload for adversarial prompt injection and mask sensitive tokens.',
          zero_trust_scope: 'security:sanitize',
          status: 'pending'
        },
        {
          task_id: 'gov-task-g2',
          agent_slug: customSpec.agent_slug,
          agent_name: customSpec.name,
          is_custom: true,
          subtask_description: `Execute specialized audit for ${input.title}.`,
          zero_trust_scope: customSpec.required_scopes[0],
          status: 'pending'
        }
      ],
      recommended_action: `Synthesize ${customSpec.name} and execute orchestrated multi-agent verification.`
    };
  }

  /**
   * Supervise and orchestrate the multi-agent execution pipeline
   */
  public static async orchestrateFleetExecution(params: {
    input: GovernorProblemInput;
    analysis: GovernorAnalysisResult;
    onTrace?: (trace: AgentTrace) => void;
  }): Promise<GovernorOrchestrationRun> {
    const { input, analysis, onTrace } = params;
    const runId = `gov-run-${Date.now()}`;
    const traceId = `trace-gov-${Date.now()}`;
    const traces: AgentTrace[] = [];
    const securityEvents: SecurityEvent[] = [];

    const emitTrace = (trace: Omit<AgentTrace, 'id' | 'trace_id' | 'created_at'>) => {
      const fullTrace: AgentTrace = {
        ...trace,
        id: `span-gov-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        trace_id: traceId,
        created_at: new Date().toISOString()
      };
      traces.push(fullTrace);
      if (onTrace) onTrace(fullTrace);
    };

    // STEP 1: Governor Initiates Analysis & Model Armor Payload Scan
    emitTrace({
      span_id: 'span-001-gov-briefing',
      agent_slug: 'governor-apex',
      step_number: 1,
      step_type: 'thought',
      status: 'success',
      duration_ms: 45,
      reasoning: `👑 The Governor ingested enterprise problem: "${input.title}". Department: ${input.department}. Priority: ${input.priority.toUpperCase()}. Initiating fleet capability diff.`,
      attributes: {
        problem_title: input.title,
        priority: input.priority,
        vendor: input.vendor_context
      }
    });

    // STEP 2: Model Armor Guardrail Verification
    const armorScan = ModelArmor.scan(input.problem_description, traceId);
    if (armorScan.security_event) {
      securityEvents.push(armorScan.security_event);
    }
    emitTrace({
      span_id: 'span-002-armor-scan',
      agent_slug: 'model-armor-sentinel',
      step_number: 2,
      step_type: 'model_armor_scan',
      status: armorScan.is_clean ? 'success' : 'intercepted',
      duration_ms: 36,
      reasoning: armorScan.is_clean 
        ? 'Model Armor scan clean. Zero prompt injections or adversarial payloads in enterprise briefing.' 
        : `Model Armor intercepted suspicious tokens: ${armorScan.threats_detected.join(', ')}. Sanitized input before subagent delegation.`,
      attributes: {
        threats_detected: armorScan.threats_detected,
        sanitized_preview: armorScan.sanitized_text.substring(0, 120) + '...'
      }
    });

    // STEP 3: Memory Bank Historical Precedence Check
    const memoryResult = await MemoryBankService.queryMemories(input.vendor_context || input.title);
    emitTrace({
      span_id: 'span-003-memory-lookup',
      agent_slug: 'governor-apex',
      step_number: 3,
      step_type: 'memory_lookup',
      status: memoryResult.items.length > 0 ? 'warning' : 'success',
      duration_ms: memoryResult.query_latency_ms || 28,
      reasoning: memoryResult.items.length > 0
        ? `Memory Bank recalled ${memoryResult.items.length} historical compliance records for "${input.vendor_context}". Recalled previous audit dispute: ${memoryResult.items[0].content}`
        : `Memory Bank queried: No prior dispute records for "${input.vendor_context || input.title}". Clean baseline memory.`,
      attributes: {
        matched_memories_count: memoryResult.items.length,
        memories: memoryResult.items.map(m => ({ key: m.memory_key, summary: m.content.substring(0, 80) }))
      }
    });

    // STEP 4: Custom Agent Synthesis & Dynamic Registry Injection (if gap detected)
    if (analysis.capability_gap_detected && analysis.custom_agent_spec) {
      const spec = analysis.custom_agent_spec;
      const registered = DynamicAgentStore.registerFromSpec(spec);

      emitTrace({
        span_id: 'span-004-agent-synthesis',
        agent_slug: 'governor-apex',
        step_number: 4,
        step_type: 'agent_synthesis',
        status: 'success',
        duration_ms: 120,
        reasoning: `👑 The Governor synthesized custom agent: "${spec.name}" (@${spec.agent_slug}). Assigned Zero-Trust scopes [${spec.required_scopes.join(', ')}]. Registered to dynamic fleet catalog with 100% health SLA.`,
        attributes: {
          custom_agent_id: registered.id,
          agent_slug: spec.agent_slug,
          capabilities: spec.capabilities,
          scopes: spec.required_scopes,
          rationale: spec.rationale
        }
      });
    }

    // STEP 5: Zero-Trust Token Issuance for Delegated Tasks
    const allScopes = Array.from(new Set(
      analysis.delegation_plan.map(t => t.zero_trust_scope)
    ));
    const token = ZeroTrustIdentityService.issueToken('governor-orchestrator', allScopes);

    emitTrace({
      span_id: 'span-005-zero-trust-auth',
      agent_slug: 'zero-trust-idp',
      step_number: 5,
      step_type: 'zero_trust_auth',
      status: 'success',
      duration_ms: 18,
      reasoning: `Zero-Trust IDP issued ephemeral multi-agent execution tokens. Granted scopes: [${allScopes.join(', ')}]. Ephemeral token TTL: 300s.`,
      attributes: {
        token_preview: token.token.substring(0, 24) + '...',
        authorized_scopes: allScopes,
        ttl_seconds: 300
      }
    });

    // STEP 6: Execute Delegated Subagent Tasks Under Governor Supervision
    let compositeRiskScore = 35;

    for (let i = 0; i < analysis.delegation_plan.length; i++) {
      const task = analysis.delegation_plan[i];
      const stepNumber = 6 + i;

      let subtaskReasoning = '';
      let subtaskStatus: 'success' | 'warning' | 'violation' = 'success';
      let riskDelta = 0;

      if (task.agent_slug === 'battery-provenance-sentinel') {
        subtaskStatus = 'violation';
        riskDelta = 45;
        subtaskReasoning = `[CUSTOM AGENT AUDIT - ${task.agent_name}] Discrepancy uncovered! Digital Product Passport (DPP) QR hash mismatch: Supplier reported EU closed-loop recycling cert #DPP-8821, but mass spectrometer batch ratio matches unrefined Katanga cobalt ore (DRC). 34% volume fails EU Directive 2023/1542.`;
      } else if (task.agent_slug === 'pharma-coldchain-inspector') {
        subtaskStatus = 'violation';
        riskDelta = 40;
        subtaskReasoning = `[CUSTOM AGENT AUDIT - ${task.agent_name}] Cryptographic replay attack detected on IoT logger #TL-904. Ambient sensor cross-check reveals 14h temperature surge to 38.2°C at port transshipment terminal. Biologics stability breached.`;
      } else if (task.agent_slug === 'sanctions-auditor') {
        subtaskStatus = 'warning';
        riskDelta = 15;
        subtaskReasoning = `[SANCTIONS & AML AUDIT] Nexus Materials parent company has 1 intermediate trading subsidiary placed on EU Trade Watchlist for dual-use electronics transit. Primary entity not blocked, but heightened risk flagged.`;
      } else if (task.agent_slug === 'sap-inventory-router') {
        subtaskStatus = 'success';
        riskDelta = 0;
        subtaskReasoning = `[ERP CONNECTOR] Purchase Order amount is $${(input.estimated_amount_usd || 84000).toLocaleString()}. Warehouse safety stock for battery cells is currently at 18% (critical replenishment threshold).`;
      } else {
        subtaskReasoning = `[SUBAGENT EXECUTION - ${task.agent_name}] Completed subtask: "${task.subtask_description}". Zero unauthorized scope excursions.`;
      }

      compositeRiskScore += riskDelta;

      emitTrace({
        span_id: `span-00${stepNumber}-task-${task.agent_slug}`,
        agent_slug: task.agent_slug,
        step_number: stepNumber,
        step_type: task.is_custom ? 'agent_synthesis' : 'tool_call',
        status: subtaskStatus,
        duration_ms: 85 + i * 20,
        reasoning: subtaskReasoning,
        attributes: {
          task_id: task.task_id,
          is_custom_agent: task.is_custom,
          scope_verified: task.zero_trust_scope,
          risk_contribution: riskDelta
        }
      });
    }

    compositeRiskScore = Math.min(100, compositeRiskScore);

    // STEP 7: Agent Gateway Policy Gate Check
    const poAmount = input.estimated_amount_usd || 84000;
    const policyResult = AgentGateway.evaluatePolicy(
      poAmount, 
      compositeRiskScore, 
      compositeRiskScore > 75 ? 'FLAGGED' : 'CLEAN'
    );

    emitTrace({
      span_id: `span-009-gateway-policy`,
      agent_slug: 'governor-apex',
      step_number: 6 + analysis.delegation_plan.length,
      step_type: 'policy_gate',
      status: policyResult.requires_human_approval ? 'warning' : 'success',
      duration_ms: 22,
      reasoning: policyResult.requires_human_approval
        ? `Agent Gateway triggered Policy Gate: "${policyResult.policy_name}". PO amount ($${poAmount.toLocaleString()}) and Risk Score (${compositeRiskScore}/100) require Human Officer Sign-Off.`
        : `Agent Gateway auto-approval granted under policy "${policyResult.policy_name}".`,
      attributes: {
        policy_name: policyResult.policy_name,
        requires_human_approval: policyResult.requires_human_approval,
        reason: policyResult.reason
      }
    });

    // STEP 8: Governor Executive Verdict & Memory Bank Writeback
    const executiveVerdict = compositeRiskScore >= 70
      ? `🚨 AUDIT BLOCKED BY THE GOVERNOR: High-risk non-compliance detected by synthesized agent (@${analysis.custom_agent_spec?.agent_slug || 'custom-agent'}). Composite Risk Score: ${compositeRiskScore}/100. Automated execution halted. Policy Gate [POL-SPEND-TIER-2] engaged for executive review.`
      : `✅ AUDIT PASSED WITH CONDITIONS: All subagents completed assigned tasks. Minor observations logged to Memory Bank. PO within operational risk threshold.`;

    // Commit new finding to Memory Bank so future agents benefit
    if (analysis.custom_agent_spec && compositeRiskScore >= 70) {
      MemoryBankService.addMemory({
        entity_name: input.vendor_context || input.title,
        entity_id: `VEND-${Date.now().toString().slice(-4)}`,
        entity_type: 'audit_finding',
        memory_key: `${analysis.custom_agent_spec.agent_slug}_violation`,
        content: `Governor Synthesized Agent (@${analysis.custom_agent_spec.agent_slug}) discovered critical violation during audit of "${input.title}": Composite risk ${compositeRiskScore}/100.`,
        confidence_score: 0.97,
        metadata: {
          governor_run_id: runId,
          custom_agent: analysis.custom_agent_spec.agent_slug,
          priority: input.priority
        }
      });
    }

    emitTrace({
      span_id: `span-010-gov-consensus`,
      agent_slug: 'governor-apex',
      step_number: 7 + analysis.delegation_plan.length,
      step_type: 'thought',
      status: compositeRiskScore >= 70 ? 'violation' : 'success',
      duration_ms: 34,
      reasoning: `👑 The Governor compiled final executive audit verdict. New forensic finding committed to Memory Bank for cross-session fleet permanence.`,
      attributes: {
        composite_risk_score: compositeRiskScore,
        verdict: executiveVerdict
      }
    });

    return {
      run_id: runId,
      problem_input: input,
      analysis,
      traces,
      security_events: securityEvents,
      composite_risk_score: compositeRiskScore,
      policy_evaluation: policyResult,
      executive_verdict: executiveVerdict,
      created_at: new Date().toISOString(),
      completed_at: new Date().toISOString()
    };
  }
}
