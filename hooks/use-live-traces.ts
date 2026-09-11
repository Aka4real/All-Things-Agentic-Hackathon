'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { AgentTrace } from '@/lib/types';

export function useLiveTraces(workflowId: string, initialTraces: AgentTrace[] = []) {
  const [traces, setTraces] = useState<AgentTrace[]>(initialTraces);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If Firebase is not configured or in fallback mode, use initialTraces
    if (!workflowId || !isFirebaseConfigured || !db) {
      setTraces(initialTraces);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'workflows', workflowId, 'traces'),
      orderBy('step_number', 'asc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: AgentTrace[] = [];
          snapshot.forEach((doc) => {
            items.push({ id: doc.id, ...(doc.data() as Omit<AgentTrace, 'id'>) });
          });
          setTraces(items);
        } else if (initialTraces.length > 0) {
          setTraces(initialTraces);
        }
        setLoading(false);
      },
      (error) => {
        console.warn('Firestore live traces snapshot warning:', error);
        setTraces(initialTraces);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [workflowId, initialTraces]);

  return { traces, loading };
}
