import { AgentRegistryItem, CustomAgentSpec } from './types';
import { INITIAL_AGENTS } from './mock-data';

const STORAGE_KEY = 'fortress_fleet_dynamic_agents';

export class DynamicAgentStore {
  private static inMemoryCustomAgents: AgentRegistryItem[] = [];

  private static getStoredCustomAgents(): AgentRegistryItem[] {
    if (typeof window === 'undefined') {
      return this.inMemoryCustomAgents;
    }
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data) as AgentRegistryItem[];
      }
    } catch (e) {
      console.warn('Failed to parse dynamic agents from localStorage', e);
    }
    return this.inMemoryCustomAgents;
  }

  private static saveStoredCustomAgents(agents: AgentRegistryItem[]) {
    this.inMemoryCustomAgents = agents;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(agents));
      } catch (e) {
        console.warn('Failed to persist dynamic agents to localStorage', e);
      }
    }
  }

  /**
   * Get all active agents (Native initial agents + Dynamically synthesized custom agents)
   */
  public static getAllAgents(): AgentRegistryItem[] {
    const custom = this.getStoredCustomAgents();
    // Merge, avoiding duplicates by agent_slug
    const customSlugs = new Set(custom.map(a => a.agent_slug));
    const native = INITIAL_AGENTS.filter(a => !customSlugs.has(a.agent_slug));
    return [...native, ...custom];
  }

  /**
   * Get only custom agents synthesized by The Governor
   */
  public static getCustomAgents(): AgentRegistryItem[] {
    return this.getStoredCustomAgents();
  }

  /**
   * Register a new agent from a Governor CustomAgentSpec
   */
  public static registerFromSpec(spec: CustomAgentSpec): AgentRegistryItem {
    const current = this.getStoredCustomAgents();
    const existingIdx = current.findIndex(a => a.agent_slug === spec.agent_slug);

    const newAgent: AgentRegistryItem = {
      id: `custom-ag-${Date.now().toString(36)}`,
      agent_slug: spec.agent_slug,
      name: spec.name,
      department: spec.department,
      description: spec.description,
      version: spec.version || '1.0.0',
      model_id: spec.model_id || 'gemini-3.8-flash',
      capabilities: spec.capabilities,
      required_scopes: spec.required_scopes,
      sla_status: 'healthy',
      uptime_pct: 100.0,
      total_runs: 1,
      is_approved: true,
      author: '👑 The Governor (Apex Autonomous Synthesizer)',
      is_custom: true,
      created_by_governor: true,
      custom_rationale: spec.rationale,
      system_instruction: spec.system_instruction
    };

    if (existingIdx >= 0) {
      current[existingIdx] = newAgent;
    } else {
      current.unshift(newAgent);
    }

    this.saveStoredCustomAgents(current);
    return newAgent;
  }

  /**
   * Find an agent by its slug
   */
  public static getAgentBySlug(slug: string): AgentRegistryItem | undefined {
    return this.getAllAgents().find(a => a.agent_slug === slug);
  }

  /**
   * Reset store to initial native agents
   */
  public static resetAgents(): void {
    this.inMemoryCustomAgents = [];
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.warn('Failed to clear localStorage dynamic agents', e);
      }
    }
  }
}
