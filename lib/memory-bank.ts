import { MemoryBankItem } from './types';
import { INITIAL_MEMORY_BANK } from './mock-data';

const STORAGE_KEY = 'fortress_fleet_memory_bank';

export class MemoryBankService {
  private static inMemory: MemoryBankItem[] = [...INITIAL_MEMORY_BANK];

  private static getStore(): MemoryBankItem[] {
    if (typeof window === 'undefined') return this.inMemory;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load memories from localStorage', e);
    }
    return this.inMemory;
  }

  private static saveStore(items: MemoryBankItem[]) {
    this.inMemory = items;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.warn('Failed to persist memories', e);
      }
    }
  }

  /**
   * Search memory bank by entity ID, entity name or semantic keywords with strict boolean grouping
   */
  public static async queryMemories(query: string, entityId?: string): Promise<{ items: MemoryBankItem[]; query_latency_ms: number }> {
    const startTime = Date.now();
    const queryLower = query ? query.toLowerCase().trim() : '';
    const targetEntityId = entityId ? entityId.toLowerCase().trim() : '';
    const memories = this.getStore();

    const matches = memories.filter((mem) => {
      // 1. Entity boundary match
      const matchesEntity = targetEntityId 
        ? mem.entity_id.toLowerCase() === targetEntityId 
        : true;

      // 2. Query text match
      const matchesQuery = !queryLower || (
        mem.entity_name.toLowerCase().includes(queryLower) ||
        mem.content.toLowerCase().includes(queryLower) ||
        mem.memory_key.toLowerCase().includes(queryLower)
      );

      // Both conditions must be satisfied to prevent cross-vendor contamination
      return matchesEntity && matchesQuery;
    });

    const latency = Date.now() - startTime;
    return {
      items: matches,
      query_latency_ms: latency
    };
  }

  /**
   * Ingest a new cross-session memory observation with persistence
   */
  public static addMemory(item: Omit<MemoryBankItem, 'id' | 'created_at'>): MemoryBankItem {
    const newRecord: MemoryBankItem = {
      ...item,
      id: `mem-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    const current = this.getStore();
    current.unshift(newRecord);
    this.saveStore(current);
    return newRecord;
  }

  /**
   * List all stored memories
   */
  public static getAllMemories(): MemoryBankItem[] {
    return this.getStore();
  }
}
