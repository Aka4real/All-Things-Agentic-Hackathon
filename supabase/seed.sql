-- FortressFleet: Seed Data

-- Agents
insert into public.agent_registry (agent_slug, name, department, description, version, model_id, capabilities, required_scopes, author) values
('supply-chain-lead', 'Lead Supply Chain & ESG Auditor', 'Supply Chain', 'Enterprise master orchestrator for multi-tier vendor evaluation and automated compliance arbitration.', '2.4.0', 'gemini-3.7-flash', '{"Autonomous Workflow Routing","Multi-Session Memory Synthesis","Contract Reconciliation"}', '{"erp:read","memory:read","policy:evaluate"}', 'Elena Vance (Global Risk Team)'),
('sanctions-auditor', 'Sanctions & AML Compliance Subagent', 'ESG Compliance', 'Autonomous watchlist inspector interfacing with OFAC, PEP, and international trade registers.', '1.8.2', 'gemini-3.7-flash', '{"OFAC SDN Scan","Ultimate Beneficial Ownership Trace"}', '{"sanctions:query","legal:audit"}', 'Office of General Counsel'),
('esg-sensor-analyst', 'Unstructured ESG & Sensor Subagent', 'ESG Compliance', 'Deep-learning subagent for ingesting factory audit PDFs and detecting greenwashing fraud.', '3.1.0', 'gemini-3.7-flash', '{"Greenwashing Anomaly Detection","Satellite Emission Check"}', '{"esg:sensor:read","unstructured:parse"}', 'Sustainability Governance Board'),
('erp-sap-connector', 'SAP & Oracle ERP Production Connector', 'Finance', 'Zero-Trust database gateway querying private enterprise inventory and purchase order ledgers.', '4.0.1', 'gemini-3.7-flash', '{"SAP S/4HANA OData Querying","Inventory Delta"}', '{"erp:inventory:read","erp:po:verify"}', 'Corporate Enterprise Systems'),
('logistics-freight-router', 'Global Freight & Customs Route Agent', 'Logistics', 'Real-time transit optimization engine monitoring multimodal container webhooks.', '2.0.0', 'gemini-3.7-flash', '{"AIS Maritime Vessel Tracking","Customs Tariffs Estimation"}', '{"logistics:telemetry:read"}', 'Global Logistics Command'),
('model-armor-sentinel', 'Model Armor Inline Guardrail Agent', 'SecOps', 'Real-time token sanitizer utilizing Gemma 2 heuristics to neutralize prompt injections.', '1.2.0', 'gemma-2-9b-it', '{"Prompt Injection Interception","PII Masking"}', '{"security:sanitize","audit:log"}', 'Enterprise Cyber Defense Center');

-- Memory Bank Seed
insert into public.memory_bank (entity_type, entity_id, entity_name, memory_key, content, confidence_score) values
('vendor', 'VEND-NEXUS-88', 'Nexus Materials Ltd (Shenzhen)', 'prior_dispute_history', 'Q3 2025 Audit Finding: Vendor attempted to substitute Grade-B recycled cobalt for Aerospace-Grade alloy. Banned from direct aerospace contracts without dual-lab verification.', 0.98),
('esg_report', 'VEND-NEXUS-88', 'Nexus Materials Ltd (Shenzhen)', 'greenwashing_alert', 'Factory claimed 100% solar power for plant #3; Sentinel-2 satellite emissions indicated diesel generator running 18h/day.', 0.94),
('contract', 'VEND-AURORA-02', 'Aurora Bio-Polymer GMBH', 'payment_terms_precedence', 'Established baseline payment terms: Net-60 with 2% discount. Pre-approved for orders up to $150,000.', 0.99);
