import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

export const isFirebaseAdminConfigured = Boolean(
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
);

let adminApp: App | null = null;
let adminDb: Firestore | null = null;

if (getApps().length === 0) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

  if (isFirebaseAdminConfigured && privateKey) {
    try {
      adminApp = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
    } catch (err) {
      console.warn('Firebase Admin credential initialization warning:', err);
    }
  } else if (process.env.GCP_PROJECT_ID || process.env.K_SERVICE) {
    // Automatically use Google Application Default Credentials when running on Google Cloud Run
    try {
      adminApp = initializeApp();
    } catch (err) {
      console.warn('Firebase Admin ADC initialization warning:', err);
    }
  }
} else {
  adminApp = getApps()[0];
}

if (adminApp) {
  try {
    adminDb = getFirestore(adminApp);
  } catch (err) {
    console.warn('Firestore Admin initialization warning:', err);
  }
}

export { adminApp, adminDb };
