import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { INITIAL_AGENTS, INITIAL_MEMORY_BANK, INITIAL_SECURITY_EVENTS } from '../lib/mock-data';

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'fortress-fleet',
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-fbsvc@fortress-fleet.iam.gserviceaccount.com',
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
};

const app = initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore(app);

async function seed() {
  console.log('Seeding Cloud Firestore for project "fortress-fleet"...');

  // 1. Seed Agents
  console.log(`Writing ${INITIAL_AGENTS.length} agents...`);
  const agentBatch = db.batch();
  for (const agent of INITIAL_AGENTS) {
    const ref = db.collection('agents').doc(agent.id);
    agentBatch.set(ref, {
      ...agent,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }
  await agentBatch.commit();
  console.log('✓ Agents collection seeded.');

  // 2. Seed Memories
  console.log(`Writing ${INITIAL_MEMORY_BANK.length} memory items...`);
  const memBatch = db.batch();
  for (const mem of INITIAL_MEMORY_BANK) {
    const ref = db.collection('memories').doc(mem.id);
    memBatch.set(ref, {
      ...mem,
      synced_at: new Date().toISOString()
    });
  }
  await memBatch.commit();
  console.log('✓ Memories collection seeded.');

  // 3. Seed Security Events
  console.log(`Writing ${INITIAL_SECURITY_EVENTS.length} security events...`);
  const secBatch = db.batch();
  for (const sec of INITIAL_SECURITY_EVENTS) {
    const ref = db.collection('security_events').doc(sec.id);
    secBatch.set(ref, sec);
  }
  await secBatch.commit();
  console.log('✓ Security events collection seeded.');

  // 4. Seed Presets
  console.log('Writing preset workflows...');
  const workflowsBatch = db.batch();
  workflowsBatch.set(db.collection('workflows').doc('demo-elena-vance'), {
    id: 'demo-elena-vance',
    name: 'Nexus Materials Fast-Track & ESG Fraud Audit',
    badge: 'Flagship scenario',
    heroPersona: 'Elena Vance (Lead ESG & Supply Chain Risk Auditor)',
    runtime: 'GEAP Zero-Trust Runtime',
    vendorName: 'Nexus Materials Ltd (Shenzhen)',
    vendorId: 'VEND-NEXUS-88',
    facilityName: 'Plant #3 Nexus',
    poAmount: 82000,
    status: 'ready',
    updated_at: new Date().toISOString()
  });

  workflowsBatch.set(db.collection('workflows').doc('run-prev-099'), {
    id: 'run-prev-099',
    name: 'Aurora Bio-Polymer GMBH Q1 Expedited Procurement',
    badge: 'Historical Run — Completed',
    heroPersona: 'Elena Vance (ESG Auditor)',
    runtime: 'GEAP v2.4 Certified',
    vendorName: 'Aurora Bio-Polymer GMBH',
    vendorId: 'VEND-AURORA-02',
    facilityName: 'Facility #1 Aurora (Hamburg)',
    poAmount: 45000,
    status: 'completed',
    updated_at: new Date().toISOString()
  });

  workflowsBatch.set(db.collection('workflows').doc('run-prev-098'), {
    id: 'run-prev-098',
    name: 'Zenith Solar Solutions Tier-3 Labor Watchlist Audit',
    badge: 'Historical Run — Intercepted',
    heroPersona: 'Sanctions & AML Auditor',
    runtime: 'GEAP Threat Guard Runtime',
    vendorName: 'Zenith Solar Solutions',
    vendorId: 'VEND-ZENITH-SOL',
    facilityName: 'Solar Complex #4 Zenith',
    poAmount: 110000,
    status: 'intercepted',
    updated_at: new Date().toISOString()
  });
  await workflowsBatch.commit();
  console.log('✓ Workflows collection seeded.');

  console.log('\n🎉 ALL COLLECTIONS SUCCESSFULLY SEEDED INTO CLOUD FIRESTORE!');
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
