// FIX: Declare global variables provided by the execution environment to prevent TypeScript errors.
declare global {
  var __firebase_config: string | undefined;
  var __initial_auth_token: string | undefined;
}

import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged,
  setPersistence,
  inMemoryPersistence
} from "firebase/auth";
import { getFirestore, setLogLevel } from "firebase/firestore";

// --- THIS IS THE CORRECT CONFIGURATION ---

// 1. Get the config object from the global __firebase_config variable.
// This is provided by the Canvas environment.
const firebaseConfig = JSON.parse(
  typeof __firebase_config !== 'undefined' 
    ? __firebase_config 
    : '{}'
);

// 2. Initialize Firebase
const app = initializeApp(firebaseConfig);

// 3. Initialize and export services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable Firestore debug logging
// setLogLevel('debug');

/**
 * 4. Authenticates the user.
 * This function handles the specific auth flow required by Canvas.
 */
export const authenticate = async () => {
  // Use in-memory persistence
  await setPersistence(auth, inMemoryPersistence);

  return new Promise((resolve, reject) => {
    // Check if a custom token is provided
    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
      console.log("Authenticating with custom token...");
      signInWithCustomToken(auth, __initial_auth_token)
        .then(resolve)
        .catch((err) => {
          console.error("Custom token sign-in failed, trying anonymous:", err);
          // Fallback to anonymous
          signInAnonymously(auth).then(resolve).catch(reject);
        });
    } else {
      // If no token, sign in anonymously
      console.log("No custom token, authenticating anonymously...");
      signInAnonymously(auth).then(resolve).catch(reject);
    }
  });
};
