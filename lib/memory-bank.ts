import { MemoryBankItem } from './types';
import { INITIAL_MEMORY_BANK } from './mock-data';

export class MemoryBankService {
  private static memories: MemoryBankItem[] = [...INITIAL_MEMORY_BANK];

  /**
   * Search memory bank by entity ID, entity name or semantic keywords
   */
  public static async queryMemories(query: string, entityId?: string): Promise<{ items: MemoryBankItem[]; query_latency_ms: number }> {
    const startTime = Date.now();
    const queryLower = query.toLowerCase();

    const matches = this.memories.filter((mem) => {
      if (entityId && mem.entity_id.toLowerCase() === entityId.toLowerCase()) {
        return true;
      }
      return (
        mem.entity_name.toLowerCase().includes(queryLower) ||
        mem.content.toLowerCase().includes(queryLower) ||
        mem.memory_key.toLowerCase().includes(queryLower)
      );
    });

    const latency = Date.now() - startTime;
    return {
      items: matches,
      query_latency_ms: latency
    };
  }

  /**
   * Ingest a new cross-session memory observation
   */
  public static addMemory(item: Omit<MemoryBankItem, 'id' | 'created_at'>): MemoryBankItem {
    const newRecord: MemoryBankItem = {
      ...item,
      id: `mem-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.memories.unshift(newRecord);
    return newRecord;
  }

  /**
   * List all stored memories
   */
  public static getAllMemories(): MemoryBankItem[] {
    return this.memories;
  }
}
