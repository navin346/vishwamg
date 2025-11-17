// FIX: Add a triple-slash directive to make Vite's `import.meta.env` types available.
/// <reference types="vite/client" />

// Declare global variables provided by the execution environment to prevent TypeScript errors.
declare global {
  var __firebase_config: string | undefined;
  var __initial_auth_token: string | undefined;
}

import { initializeApp, FirebaseOptions } from "firebase/app";
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  setPersistence,
  inMemoryPersistence
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

let firebaseConfig: FirebaseOptions;

// This setup allows the app to work in both Canvas (with global vars)
// and on Vercel (with Vite environment variables).
if (typeof __firebase_config !== 'undefined' && __firebase_config && __firebase_config !== '{}') {
  // We are in the Canvas environment
  try {
    firebaseConfig = JSON.parse(__firebase_config);
  } catch (e) {
    console.error("Failed to parse __firebase_config", e);
    // Fallback to Vercel/local env vars if parsing fails
    firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };
  }
} else {
  // We are likely in a Vercel/local dev environment
  // Vite exposes env variables via `import.meta.env`
  firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export services
export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * Authenticates the user.
 * This function handles the specific auth flow required by Canvas
 * and provides a fallback for other environments.
 */
export const authenticate = async () => {
  await setPersistence(auth, inMemoryPersistence);

  return new Promise((resolve, reject) => {
    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
      console.log("Authenticating with custom token...");
      signInWithCustomToken(auth, __initial_auth_token)
        .then(resolve)
        .catch((err) => {
          console.error("Custom token sign-in failed, trying anonymous:", err);
          signInAnonymously(auth).then(resolve).catch(reject);
        });
    } else {
      console.log("No custom token, authenticating anonymously...");
      signInAnonymously(auth).then(resolve).catch(reject);
    }
  });
};