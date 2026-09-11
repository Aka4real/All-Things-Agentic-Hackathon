import { MemoryBankItem } from './types';
import { INITIAL_MEMORY_BANK } from './mock-data';
import { db, isFirebaseConfigured } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  orderBy, 
  writeBatch 
} from 'firebase/firestore';

const STORAGE_KEY = 'fortress_fleet_memory_bank';

export class MemoryBankService {
  private static inMemory: MemoryBankItem[] = [...INITIAL_MEMORY_BANK];
  private static hasSyncedFirestore = false;

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
   * Synchronize Memory Bank with Cloud Firestore if configured
   */
  public static async syncWithFirestore(): Promise<MemoryBankItem[]> {
    if (!isFirebaseConfigured || !db || typeof window === 'undefined') {
      return this.getStore();
    }

    try {
      const memoriesCol = collection(db, 'memories');
      const snapshot = await getDocs(query(memoriesCol, orderBy('created_at', 'desc')));

      if (snapshot.empty) {
        // Automatically seed initial mock memories to Firestore
        const batch = writeBatch(db);
        const initial = this.getStore();
        for (const item of initial) {
          batch.set(doc(db, 'memories', item.id), item);
        }
        await batch.commit();
        this.hasSyncedFirestore = true;
        return initial;
      }

      const firestoreItems: MemoryBankItem[] = [];
      snapshot.forEach((d) => {
        firestoreItems.push(d.data() as MemoryBankItem);
      });

      this.saveStore(firestoreItems);
      this.hasSyncedFirestore = true;
      return firestoreItems;
    } catch (err) {
      console.warn('Firestore memory sync warning, falling back to local store:', err);
      return this.getStore();
    }
  }

  /**
   * Search memory bank by entity ID, entity name or semantic keywords with strict boolean grouping
   */
  public static async queryMemories(queryStr: string, entityId?: string): Promise<{ items: MemoryBankItem[]; query_latency_ms: number }> {
    const startTime = Date.now();

    // Trigger lazy sync on first query if not synced yet
    if (isFirebaseConfigured && db && !this.hasSyncedFirestore && typeof window !== 'undefined') {
      try {
        await this.syncWithFirestore();
      } catch {
        // Fallback to local store silently
      }
    }

    const queryLower = queryStr ? queryStr.toLowerCase().trim() : '';
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
   * Ingest a new cross-session memory observation with dual Firestore + Local persistence
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

    // Asynchronously replicate to Cloud Firestore
    if (isFirebaseConfigured && db && typeof window !== 'undefined') {
      setDoc(doc(db, 'memories', newRecord.id), newRecord).catch((err) => {
        console.warn('Failed to replicate memory to Firestore:', err);
      });
    }

    return newRecord;
  }

  /**
   * List all stored memories
   */
  public static getAllMemories(): MemoryBankItem[] {
    return this.getStore();
  }
}
