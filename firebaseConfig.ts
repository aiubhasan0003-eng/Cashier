import { initializeApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

// Helper to get env vars from either Vite's import.meta.env or Node's process.env
const getEnv = (key: string) => {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      const val = import.meta.env['VITE_' + key] || import.meta.env[key];
      if (val) return val;
    }
  } catch (e) {
    // Ignore error if import.meta is not available
  }

  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env) {
      // @ts-ignore
      return process.env[key];
    }
  } catch (e) {
    // Ignore error if process is not available
  }

  return undefined;
};

// Configuration from environment variables
const firebaseConfig = {
  apiKey: getEnv('FIREBASE_API_KEY'),
  authDomain: getEnv('FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('FIREBASE_APP_ID')
};

let app;
let db: Firestore | null = null;
let auth: Auth | null = null;

try {
  // Validate configuration presence
  const missingKeys = [];
  if (!firebaseConfig.apiKey) missingKeys.push('FIREBASE_API_KEY');
  if (!firebaseConfig.projectId) missingKeys.push('FIREBASE_PROJECT_ID');

  if (missingKeys.length === 0) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("Firebase initialized successfully.");
  } else {
    console.warn(`Firebase configuration incomplete. Missing: ${missingKeys.join(', ')}. App will run in Offline/Guest mode.`);
  }
} catch (error) {
  console.error("Failed to initialize Firebase:", error);
}

export { app, db, auth };