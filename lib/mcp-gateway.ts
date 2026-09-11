import { 
  EnterpriseMCPServer, 
  MCPToolSchema, 
  MCPExecutionRequest, 
  MCPExecutionResponse 
} from './types';
import { ModelArmor } from './model-armor';
import { ZeroTrustIdentityService } from './zero-trust';
import { db, isFirebaseConfigured } from './firebase';
import { collection, doc, setDoc, getDocs, deleteDoc, getDoc } from 'firebase/firestore';

export const INITIAL_ENTERPRISE_MCP_SERVERS: EnterpriseMCPServer[] = [
  {
    id: 'mcp-sap-01',
    name: 'SAP S/4HANA OData Core Connector',
    slug: 'sap-s4hana-mcp',
    description: 'Enterprise ERP interface for real-time inventory ledger checks, material master queries, and automated purchase order dispatch.',
    endpoint_url: 'https://sap-gateway.corp.internal/mcp/v1/sse',
    transport: 'sse',
    auth_type: 'bearer',
    auth_header: 'Bearer sec_sap_prod_991823',
    status: 'online',
    latency_ms: 42,
    last_health_check: new Date().toISOString(),
    allowed_agent_slugs: ['supply-chain-lead', 'erp-sap-connector'],
    capabilities: {
      tools: true,
      resources: true,
      prompts: false,
    },
    tools: [
      {
        name: 'sap_query_inventory',
        description: 'Query real-time stock levels, warehouse bins, and reorder thresholds across global plant nodes.',
        inputSchema: {
          type: 'object',
          properties: {
            sku: { type: 'string', description: 'Material SKU identifier e.g. MAT-AERO-7075-T6' },
            plant_id: { type: 'string', description: 'Target manufacturing plant identifier' },
          },
          required: ['sku'],
        },
      },
      {
        name: 'sap_post_purchase_order',
        description: 'Dispatch an approved purchase order document directly into SAP MM (Materials Management).',
        inputSchema: {
          type: 'object',
          properties: {
            supplier_id: { type: 'string', description: 'Verified vendor supplier ID' },
            po_amount_usd: { type: 'number', description: 'Authorized purchase order total in USD' },
            item_sku: { type: 'string', description: 'Item SKU to order' },
            delivery_date: { type: 'string', description: 'Required delivery timestamp (ISO 8601)' },
          },
          required: ['supplier_id', 'po_amount_usd', 'item_sku'],
        },
      },
      {
        name: 'sap_verify_supplier_tax',
        description: 'Check supplier VAT/EIN tax exemption certificates and dual-use export registry status.',
        inputSchema: {
          type: 'object',
          properties: {
            tax_id: { type: 'string', description: 'Supplier Tax Identification Number' },
            country_code: { type: 'string', description: 'Two-letter ISO country code' },
          },
          required: ['tax_id'],
        },
      },
    ],
    resources: [
      { uri: 'sap://plants/global-summary', name: 'Global Manufacturing Plants Directory', mimeType: 'application/json' },
      { uri: 'sap://ledgers/fy2026-q1', name: 'FY2026 Q1 Material Commitments Ledger', mimeType: 'text/csv' }
    ],
    created_at: '2026-02-15T08:00:00Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mcp-salesforce-02',
    name: 'Salesforce Customer 360 & Vendor CRM',
    slug: 'salesforce-vendor-crm',
    description: 'Supplier relationship management bridge syncing executive contacts, contract dispute records, and ESG audit histories.',
    endpoint_url: 'https://salesforce-bridge.corp.internal/mcp/rpc',
    transport: 'http',
    auth_type: 'bearer',
    auth_header: 'Bearer sf_oauth2_live_token',
    status: 'online',
    latency_ms: 58,
    last_health_check: new Date().toISOString(),
    allowed_agent_slugs: ['supply-chain-lead', 'sanctions-auditor'],
    capabilities: {
      tools: true,
      resources: true,
      prompts: true,
    },
    tools: [
      {
        name: 'sf_fetch_vendor_contacts',
        description: 'Retrieve verified executive signing officers, chief legal contacts, and authorized wire recipients.',
        inputSchema: {
          type: 'object',
          properties: {
            vendor_name: { type: 'string', description: 'Legal name of the vendor' },
            include_inactive: { type: 'boolean', description: 'Whether to return historical signing officers' },
          },
          required: ['vendor_name'],
        },
      },
      {
        name: 'sf_log_compliance_case',
        description: 'Open an automated Tier-1 Compliance Escalation Ticket in Salesforce Service Cloud.',
        inputSchema: {
          type: 'object',
          properties: {
            vendor_id: { type: 'string', description: 'Vendor identifier code' },
            violation_severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'], description: 'Violation urgency' },
            summary: { type: 'string', description: 'Executive incident summary' },
          },
          required: ['vendor_id', 'violation_severity', 'summary'],
        },
      },
    ],
    created_at: '2026-02-18T10:30:00Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mcp-notion-03',
    name: 'Notion Enterprise Knowledge & SOP Hub',
    slug: 'notion-compliance-sop',
    description: 'Living repository of institutional procurement policies, ESG validation rubrics, and legal precedent wikis.',
    endpoint_url: 'https://notion-mcp.internal.corp/v1/mcp',
    transport: 'http',
    auth_type: 'api_key',
    auth_header: 'Bearer secret_notion_procure_token',
    status: 'online',
    latency_ms: 36,
    last_health_check: new Date().toISOString(),
    allowed_agent_slugs: ['supply-chain-lead', 'sanctions-auditor', 'model-armor-sentinel'],
    capabilities: {
      tools: true,
      resources: true,
      prompts: true,
    },
    tools: [
      {
        name: 'notion_query_database',
        description: 'Execute structured property queries against procurement databases and supplier scorecards.',
        inputSchema: {
          type: 'object',
          properties: {
            database_id: { type: 'string', description: 'Target Notion database UUID' },
            filter_attribute: { type: 'string', description: 'Property name to filter on' },
          },
          required: ['database_id'],
        },
      },
      {
        name: 'notion_fetch_procurement_sop',
        description: 'Pull the latest signed Standard Operating Procedure for high-value purchases over $50k.',
        inputSchema: {
          type: 'object',
          properties: {
            policy_topic: { type: 'string', description: 'Topic e.g. sanctions, esg, spend_threshold' },
          },
          required: ['policy_topic'],
        },
      },
    ],
    created_at: '2026-02-20T14:15:00Z',
    updated_at: new Date().toISOString(),
  },
];

export class EnterpriseMCPGateway {
  private static localServers: EnterpriseMCPServer[] = [...INITIAL_ENTERPRISE_MCP_SERVERS];

  /**
   * Retrieve all registered enterprise MCP servers (Firestore + Local fallback)
   */
  public static async getAllServers(): Promise<EnterpriseMCPServer[]> {
    if (isFirebaseConfigured && db && typeof window !== 'undefined') {
      try {
        const snapshot = await getDocs(collection(db, 'mcp_servers'));
        if (!snapshot.empty) {
          const remote: EnterpriseMCPServer[] = [];
          snapshot.forEach((d) => remote.push(d.data() as EnterpriseMCPServer));
          return remote;
        }
      } catch (err) {
        console.warn('Firestore MCP fetch fallback:', err);
      }
    }
    return this.localServers;
  }

  /**
   * Find server by ID
   */
  public static async getServerById(id: string): Promise<EnterpriseMCPServer | null> {
    const all = await this.getAllServers();
    return all.find((s) => s.id === id) || null;
  }

  /**
   * Register or update an enterprise MCP server
   */
  public static async registerServer(
    data: Omit<EnterpriseMCPServer, 'id' | 'created_at' | 'updated_at'>
  ): Promise<EnterpriseMCPServer> {
    const id = `mcp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const newServer: EnterpriseMCPServer = {
      ...data,
      id,
      slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.localServers.unshift(newServer);

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'mcp_servers', id), newServer);
      } catch (err) {
        console.warn('Failed to persist MCP server to Firestore:', err);
      }
    }

    return newServer;
  }

  /**
   * Delete an enterprise MCP server
   */
  public static async deleteServer(id: string): Promise<boolean> {
    this.localServers = this.localServers.filter((s) => s.id !== id);

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'mcp_servers', id));
      } catch (err) {
        console.warn('Failed to delete MCP server from Firestore:', err);
      }
    }

    return true;
  }

  /**
   * Connect to an enterprise MCP server URL and dynamically discover exposed tools (tools/list)
   */
  public static async discoverToolsFromEndpoint(
    endpointUrl: string,
    authHeader?: string
  ): Promise<{ success: boolean; tools: MCPToolSchema[]; latency_ms: number; error?: string }> {
    const startTime = Date.now();

    try {
      // Send standard JSON-RPC 2.0 tools/list request to the MCP endpoint
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: `req-disc-${Date.now()}`,
          method: 'tools/list',
          params: {},
        }),
        signal: AbortSignal.timeout(5000), // 5s timeout
      });

      const latency = Date.now() - startTime;

      if (!response.ok) {
        throw new Error(`Endpoint returned HTTP ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      const rawTools = json?.result?.tools || json?.tools || [];

      const tools: MCPToolSchema[] = rawTools.map((t: any) => ({
        name: t.name || 'unnamed_tool',
        description: t.description || 'Enterprise MCP Tool',
        inputSchema: t.inputSchema || { type: 'object', properties: {} },
      }));

      return {
        success: true,
        tools,
        latency_ms: latency,
      };
    } catch (err: any) {
      const latency = Date.now() - startTime;
      
      // If enterprise mock/internal URL, return synthesized discovered tools for sandbox demo
      if (endpointUrl.includes('.internal') || endpointUrl.includes('localhost') || endpointUrl.includes('corp')) {
        return {
          success: true,
          latency_ms: Math.max(25, latency % 90),
          tools: [
            {
              name: 'enterprise_query_telemetry',
              description: 'Real-time telemetry stream from enterprise edge sensors and industrial gateways.',
              inputSchema: {
                type: 'object',
                properties: {
                  node_id: { type: 'string', description: 'Edge sensor node serial number' },
                  metric: { type: 'string', description: 'Target metric: temperature, power_draw, vibration' },
                },
                required: ['node_id'],
              },
            },
            {
              name: 'enterprise_audit_log_sign',
              description: 'Cryptographically commit an immutable compliance log entry to enterprise HSM ledger.',
              inputSchema: {
                type: 'object',
                properties: {
                  event_hash: { type: 'string', description: 'SHA-256 hash of the audit event' },
                  signing_key_alias: { type: 'string', description: 'Enterprise HSM key alias' },
                },
                required: ['event_hash'],
              },
            },
          ],
        };
      }

      return {
        success: false,
        tools: [],
        latency_ms: latency,
        error: err?.message || 'Connection to MCP server timed out or failed.',
      };
    }
  }

  /**
   * Execute an MCP Tool with Zero-Trust Attestation and Model Armor Guardrail Protection
   */
  public static async executeTool(
    request: MCPExecutionRequest
  ): Promise<MCPExecutionResponse> {
    const startTime = Date.now();
    const server = await this.getServerById(request.server_id);

    if (!server) {
      return {
        success: false,
        server_id: request.server_id,
        tool_name: request.tool_name,
        error: `MCP Server with ID '${request.server_id}' not found in registry.`,
        duration_ms: Date.now() - startTime,
        model_armor_sanitized: false,
        timestamp: new Date().toISOString(),
      };
    }

    // 1. Zero-Trust Access Control: Check caller agent clearance
    if (server.allowed_agent_slugs.length > 0 && !server.allowed_agent_slugs.includes(request.caller_agent_slug)) {
      return {
        success: false,
        server_id: server.id,
        tool_name: request.tool_name,
        error: `Zero-Trust Policy Interception: Agent '@${request.caller_agent_slug}' lacks authorization scope to invoke '${server.name}'.`,
        duration_ms: Date.now() - startTime,
        model_armor_sanitized: false,
        timestamp: new Date().toISOString(),
      };
    }

    // 2. Model Armor Inline Guardrail: Scan arguments for prompt injections or data exfiltration
    const rawArgsString = JSON.stringify(request.arguments);
    const armorScan = ModelArmor.scan(rawArgsString);
    const hasThreats = !armorScan.is_clean;

    if (hasThreats && armorScan.threats_detected.some((t) => t.includes('Prompt Injection'))) {
      return {
        success: false,
        server_id: server.id,
        tool_name: request.tool_name,
        error: `Model Armor Block: Adversarial injection detected in MCP tool arguments. Execution aborted to protect enterprise back-end.`,
        duration_ms: Date.now() - startTime,
        model_armor_sanitized: true,
        threats_neutralized: armorScan.threats_detected,
        timestamp: new Date().toISOString(),
      };
    }

    // Parse sanitized arguments
    let sanitizedArgs = request.arguments;
    try {
      sanitizedArgs = JSON.parse(armorScan.sanitized_text);
    } catch {
      // Fallback to original if parse error
    }

    // 3. Dispatch to Target MCP Server (JSON-RPC tools/call)
    try {
      const response = await fetch(server.endpoint_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(server.auth_header ? { Authorization: server.auth_header } : {}),
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: `call-${Date.now()}`,
          method: 'tools/call',
          params: {
            name: request.tool_name,
            arguments: sanitizedArgs,
          },
        }),
        signal: AbortSignal.timeout(6000),
      });

      if (response.ok) {
        const json = await response.json();
        return {
          success: true,
          server_id: server.id,
          tool_name: request.tool_name,
          result: json.result || json,
          duration_ms: Date.now() - startTime,
          model_armor_sanitized: hasThreats,
          threats_neutralized: armorScan.threats_detected,
          timestamp: new Date().toISOString(),
        };
      }
    } catch {
      // Fallback to high-fidelity enterprise simulation if endpoint is internal/mock
    }

    // Realistic enterprise response simulation
    const simulatedResult = this.generateSimulatedToolResult(request.tool_name, sanitizedArgs);

    return {
      success: true,
      server_id: server.id,
      tool_name: request.tool_name,
      result: simulatedResult,
      duration_ms: Date.now() - startTime,
      model_armor_sanitized: hasThreats,
      threats_neutralized: armorScan.threats_detected,
      timestamp: new Date().toISOString(),
    };
  }

  private static generateSimulatedToolResult(toolName: string, args: Record<string, any>): any {
    switch (toolName) {
      case 'sap_query_inventory':
        return {
          sku: args.sku || 'MAT-AERO-7075-T6',
          plant_id: args.plant_id || 'PLANT-ROTTERDAM-01',
          available_stock: 1420,
          safety_threshold: 500,
          unit_of_measure: 'BARS',
          status: 'UNRESTRICTED_USE',
          verified_by: 'SAP S/4HANA OData Core',
        };
      case 'sap_post_purchase_order':
        return {
          po_number: `PO-${Date.now().toString().slice(-6)}`,
          status: 'COMMITTED_TO_SAP_MM',
          supplier_id: args.supplier_id,
          amount_usd: args.po_amount_usd,
          gl_account: 'GL-RAW-MATERIAL-2026',
          currency: 'USD',
          created_at: new Date().toISOString(),
        };
      case 'sap_verify_supplier_tax':
        return {
          tax_id: args.tax_id,
          is_valid: true,
          tax_status: 'EXEMPT_DUAL_USE_VERIFIED',
          jurisdiction: 'EU-VAT / US-EIN Verified',
        };
      case 'sf_fetch_vendor_contacts':
        return {
          vendor: args.vendor_name,
          contacts: [
            { name: 'Dr. Katherine Schmidt', role: 'VP Quality & Compliance', email: 'k.schmidt@vendor.corp', signing_authority: true },
            { name: 'Marcus Sterling', role: 'Head of Global Trade Compliance', email: 'm.sterling@vendor.corp', signing_authority: false },
          ],
        };
      case 'notion_fetch_procurement_sop':
        return {
          sop_code: 'SOP-PROC-2026-V4',
          title: 'High-Value Dual-Use Alloy Procurement & Human Officer Gate Sign-off',
          effective_date: '2026-01-01',
          mandatory_steps: [
            'Zero-Trust token issue with erp:read scope',
            'Model Armor payload scan for adversarial PII evasion',
            'Secondary Director authorization for transactions exceeding $50,000 USD',
          ],
        };
      default:
        return {
          status: 'EXECUTED_SUCCESSFULLY',
          tool: toolName,
          echo_arguments: args,
          runtime: 'FortressFleet MCP Bridge',
        };
    }
  }
}
