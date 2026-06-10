// FIX: Manually define types for Vite's `import.meta.env` to resolve TypeScript errors
// because the triple-slash directive `/// <reference types="vite/client" />` was causing a
// "Cannot find type definition file for 'vite/client'" error in this environment.
interface ImportMetaEnv {
    readonly VITE_FIREBASE_API_KEY: string;
    readonly VITE_FIREBASE_AUTH_DOMAIN: string;
    readonly VITE_FIREBASE_PROJECT_ID: string;
    readonly VITE_FIREBASE_STORAGE_BUCKET: string;
    readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
    readonly VITE_FIREBASE_APP_ID: string;
}
  
// Declare global variables provided by the execution environment to prevent TypeScript errors.
declare global {
  var __firebase_config: string | undefined;
  var __initial_auth_token: string | undefined;
  // FIX: Augment the global ImportMeta interface to include Vite's `env` property.
  // This resolves errors where TypeScript doesn't recognize `import.meta.env`.
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

import { initializeApp, FirebaseOptions } from "firebase/app";
import * as fAuth from "firebase/auth";
import * as fFirestore from "firebase/firestore";

let firebaseConfig: FirebaseOptions = {};

// This setup allows the app to work in both Canvas (with global vars)
// and on Vercel (with Vite environment variables).
if (typeof __firebase_config !== 'undefined' && __firebase_config && __firebase_config !== '{}') {
  // We are in the Canvas environment
  try {
    firebaseConfig = JSON.parse(__firebase_config);
  } catch (e) {
    console.error("Failed to parse __firebase_config", e);
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

// 1. Determine if real Firebase config is available and robust
const isKeyValid = firebaseConfig && 
                    firebaseConfig.apiKey && 
                    firebaseConfig.apiKey !== 'undefined' && 
                    firebaseConfig.apiKey !== '' && 
                    !firebaseConfig.apiKey.includes('YOUR_') &&
                    firebaseConfig.projectId &&
                    firebaseConfig.projectId !== 'undefined' &&
                    firebaseConfig.projectId !== '';

let realApp: any = null;
let realAuth: any = null;
let realDb: any = null;
let isMock = false;

if (isKeyValid) {
  try {
    realApp = initializeApp(firebaseConfig);
    realAuth = fAuth.getAuth(realApp);
    realDb = fFirestore.getFirestore(realApp);
    console.log("Firebase initialized successfully with real configuration.");
  } catch (err) {
    console.error("Failed to initialize real Firebase SDK. Activating Mock Mode.", err);
    isMock = true;
  }
} else {
  console.log("No valid Firebase credentials found. Activating fully functional Mock Mode.");
  isMock = true;
}

export const isMockFirebase = isMock;

// --- MOCK FIREBASE IMPLEMENTATION ---

export interface MockUser {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  displayName: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
}

let mockCurrentUser: MockUser | null = null;
const authListeners: Set<(user: MockUser | null) => void> = new Set();

// Load saved session if exists
try {
  const savedUser = localStorage.getItem('vishwam_current_user');
  if (savedUser) {
    mockCurrentUser = JSON.parse(savedUser);
  }
} catch (e) {
  console.error("Failed to restore mock auth session", e);
}

const notifyAuthListeners = () => {
  authListeners.forEach(listener => {
    try {
      listener(mockCurrentUser);
    } catch (e) {
      console.error(e);
    }
  });
};

export const getAuthFromMock = () => {
  return {
    get currentUser() {
      return mockCurrentUser;
    }
  };
};

export const onAuthStateChangedMock = (authInstance: any, callback: (user: any) => void) => {
  authListeners.add(callback);
  setTimeout(() => {
    callback(mockCurrentUser);
  }, 0);
  return () => {
    authListeners.delete(callback);
  };
};

export const createUserWithEmailAndPasswordMock = async (authInstance: any, email: string, pass: string) => {
  const uid = 'demo-user-' + Math.floor(Math.random() * 100000);
  const newUser: MockUser = {
    uid,
    email,
    emailVerified: true,
    isAnonymous: false,
    displayName: email.split('@')[0],
    phoneNumber: null,
    photoURL: null
  };
  
  const registeredUsers = JSON.parse(localStorage.getItem('vishwam_users_db') || '{}');
  registeredUsers[email.toLowerCase()] = { uid, email, password: pass };
  localStorage.setItem('vishwam_users_db', JSON.stringify(registeredUsers));
  
  mockCurrentUser = newUser;
  localStorage.setItem('vishwam_current_user', JSON.stringify(newUser));
  notifyAuthListeners();
  
  return { user: newUser };
};

export const signInWithEmailAndPasswordMock = async (authInstance: any, email: string, pass: string) => {
  const registeredUsers = JSON.parse(localStorage.getItem('vishwam_users_db') || '{}');
  const foundUser = registeredUsers[email.toLowerCase()];
  
  if (foundUser && foundUser.password === pass) {
    const user: MockUser = {
      uid: foundUser.uid,
      email: foundUser.email,
      emailVerified: true,
      isAnonymous: false,
      displayName: foundUser.email.split('@')[0],
      phoneNumber: null,
      photoURL: null
    };
    mockCurrentUser = user;
    localStorage.setItem('vishwam_current_user', JSON.stringify(user));
    notifyAuthListeners();
    return { user };
  } else {
    throw {
      code: 'auth/user-not-found',
      message: 'Invalid email or password.'
    };
  }
};

export const signInAnonymouslyMock = async (authInstance: any) => {
  const uid = 'demo-anon-' + Math.floor(Math.random() * 100000);
  const user: MockUser = {
    uid,
    email: null,
    emailVerified: false,
    isAnonymous: true,
    displayName: 'Anonymous User',
    phoneNumber: null,
    photoURL: null
  };
  mockCurrentUser = user;
  localStorage.setItem('vishwam_current_user', JSON.stringify(user));
  notifyAuthListeners();
  return { user };
};

export const signOutMock = async (authInstance: any) => {
  mockCurrentUser = null;
  localStorage.removeItem('vishwam_current_user');
  notifyAuthListeners();
};

// --- MOCK FIRESTORE IMPLEMENTATION ---

const docListeners: Map<string, Set<(snap: any) => void>> = new Map();

const getMockStore = () => {
  try {
    return JSON.parse(localStorage.getItem('vishwam_store') || '{}');
  } catch (e) {
    return {};
  }
};

const saveMockStore = (store: any) => {
  localStorage.setItem('vishwam_store', JSON.stringify(store));
};

const triggerDocListeners = (path: string) => {
  const listeners = docListeners.get(path);
  if (listeners) {
    const store = getMockStore();
    const data = store[path] || null;
    listeners.forEach(listener => {
      try {
        listener({
          exists: () => data !== null,
          data: () => data,
          id: path.split('/').pop() || ''
        });
      } catch (e) {
        console.error(e);
      }
    });
  }
};

export class MockTimestamp {
  seconds: number;
  nanoseconds: number;
  constructor(seconds: number, nanoseconds: number) {
    this.seconds = seconds;
    this.nanoseconds = nanoseconds;
  }
  static now() {
    const ms = Date.now();
    return new MockTimestamp(Math.floor(ms / 1000), (ms % 1000) * 1000000);
  }
  static fromDate(date: Date) {
    const ms = date.getTime();
    return new MockTimestamp(Math.floor(ms / 1000), (ms % 1000) * 1000000);
  }
  toDate() {
    return new Date(this.seconds * 1000 + Math.round(this.nanoseconds / 1000000));
  }
  toISOString() {
    return this.toDate().toISOString();
  }
}

class MockDocRef {
  path: string;
  id: string;
  constructor(path: string) {
    this.path = path;
    const parts = path.split('/');
    this.id = parts[parts.length - 1];
  }
}

class MockCollectionRef {
  path: string;
  constructor(path: string) {
    this.path = path;
  }
}

export const docMock = (...args: any[]): MockDocRef => {
  let pathParts: string[] = [];
  for (const arg of args) {
    if (typeof arg === 'string') {
      pathParts.push(arg);
    } else if (arg instanceof MockDocRef || arg instanceof MockCollectionRef) {
      pathParts.push(arg.path);
    }
  }
  return new MockDocRef(pathParts.join('/'));
};

export const collectionMock = (...args: any[]): MockCollectionRef => {
  let pathParts: string[] = [];
  for (const arg of args) {
    if (typeof arg === 'string') {
      pathParts.push(arg);
    } else if (arg instanceof MockDocRef || arg instanceof MockCollectionRef) {
      pathParts.push(arg.path);
    }
  }
  return new MockCollectionRef(pathParts.join('/'));
};

const processDataForStore = (originalData: any): any => {
  if (!originalData) return originalData;
  if (originalData instanceof MockTimestamp) {
    return {
      __type: 'timestamp',
      seconds: originalData.seconds,
      nanoseconds: originalData.nanoseconds
    };
  }
  if (originalData instanceof Date) {
    const ms = originalData.getTime();
    return {
      __type: 'timestamp',
      seconds: Math.floor(ms / 1000),
      nanoseconds: (ms % 1000) * 1000000
    };
  }
  if (Array.isArray(originalData)) {
    return originalData.map(item => processDataForStore(item));
  }
  if (typeof originalData === 'object') {
    const copy: any = {};
    for (const key of Object.keys(originalData)) {
      copy[key] = processDataForStore(originalData[key]);
    }
    return copy;
  }
  return originalData;
};

const retrieveDataFromStore = (storedData: any): any => {
  if (!storedData) return storedData;
  if (typeof storedData === 'object') {
    if (storedData.__type === 'timestamp') {
      return new MockTimestamp(storedData.seconds, storedData.nanoseconds);
    }
    if (Array.isArray(storedData)) {
      return storedData.map(item => retrieveDataFromStore(item));
    }
    const copy: any = {};
    for (const key of Object.keys(storedData)) {
      copy[key] = retrieveDataFromStore(storedData[key]);
    }
    return copy;
  }
  return storedData;
};

export const setDocMock = async (docRef: MockDocRef, data: any) => {
  const store = getMockStore();
  store[docRef.path] = processDataForStore(data);
  saveMockStore(store);
  triggerDocListeners(docRef.path);
};

export const updateDocMock = async (docRef: MockDocRef, data: any) => {
  const store = getMockStore();
  const current = store[docRef.path] || {};
  store[docRef.path] = { ...current, ...processDataForStore(data) };
  saveMockStore(store);
  triggerDocListeners(docRef.path);
};

export const onSnapshotMock = (docRef: MockDocRef | any, callback: (snap: any) => void, errorCallback?: (err: any) => void) => {
  const path = docRef.path;
  if (!docListeners.has(path)) {
    docListeners.set(path, new Set());
  }
  docListeners.get(path)!.add(callback);
  
  const store = getMockStore();
  const data = store[path] || null;
  setTimeout(() => {
    callback({
      exists: () => data !== null,
      data: () => data,
      id: docRef.id || path.split('/').pop() || ''
    });
  }, 0);
  
  return () => {
    const listeners = docListeners.get(path);
    if (listeners) {
      listeners.delete(callback);
      if (listeners.size === 0) {
        docListeners.delete(path);
      }
    }
  };
};

class MockQuery {
  collectionPath: string;
  wheres: Array<{ field: string; op: string; value: any }> = [];
  orders: Array<{ field: string; direction: string }> = [];
  limitVal?: number;
  constructor(collectionPath: string) {
    this.collectionPath = collectionPath;
  }
}

export const queryMock = (collectionRef: MockCollectionRef, ...constraints: any[]): MockQuery => {
  const q = new MockQuery(collectionRef.path);
  for (const c of constraints) {
    if (c.type === 'where') {
      q.wheres.push({ field: c.field, op: c.op, value: c.value });
    } else if (c.type === 'orderBy') {
      q.orders.push({ field: c.field, direction: c.direction });
    } else if (c.type === 'limit') {
      q.limitVal = c.limitVal;
    }
  }
  return q;
};

export const whereMock = (field: string, op: string, value: any) => {
  return { type: 'where', field, op, value };
};

export const orderByMock = (field: string, direction: 'asc' | 'desc' = 'asc') => {
  return { type: 'orderBy', field, direction };
};

export const limitMock = (limitVal: number) => {
  return { type: 'limit', limitVal };
};

export const getDocsMock = async (queryObj: MockQuery | MockCollectionRef) => {
  const path = (queryObj as any).path || (queryObj as MockQuery).collectionPath;
  const store = getMockStore();
  
  const docsList: any[] = [];
  for (const key of Object.keys(store)) {
    if (key.startsWith(path + '/')) {
      const remainingPath = key.substring(path.length + 1);
      if (!remainingPath.includes('/')) {
        const docData = retrieveDataFromStore(store[key]);
        docsList.push({
          id: remainingPath,
          path: key,
          data: () => docData
        });
      }
    }
  }
  
  let filteredDocs = [...docsList];
  if (queryObj instanceof MockQuery) {
    const q = queryObj as MockQuery;
    for (const w of q.wheres) {
      filteredDocs = filteredDocs.filter(d => {
        const dData = d.data();
        if (!dData) return false;
        const val = dData[w.field];
        if (w.op === '==') return val === w.value;
        if (w.op === '>=') return val >= w.value;
        if (w.op === '<=') return val <= w.value;
        if (w.op === '>') return val > w.value;
        if (w.op === '<') return val < w.value;
        return true;
      });
    }
    
    for (const o of q.orders) {
      filteredDocs.sort((a, b) => {
        const dataA = a.data();
        const dataB = b.data();
        if (!dataA || !dataB) return 0;
        const valA = dataA[o.field];
        const valB = dataB[o.field];
        
        let compA = valA;
        let compB = valB;
        if (valA instanceof MockTimestamp) compA = valA.seconds * 1000000000 + valA.nanoseconds;
        if (valB instanceof MockTimestamp) compB = valB.seconds * 1000000000 + valB.nanoseconds;
        
        if (compA < compB) return o.direction === 'asc' ? -1 : 1;
        if (compA > compB) return o.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    if (q.limitVal !== undefined) {
      filteredDocs = filteredDocs.slice(0, q.limitVal);
    }
  }
  
  return {
    docs: filteredDocs,
    forEach: (callback: (doc: any) => void) => {
      filteredDocs.forEach(callback);
    },
    get size() {
      return filteredDocs.length;
    }
  };
};

export const writeBatchMock = (dbInstance: any) => {
  const operations: Array<() => void> = [];
  return {
    set: (docRef: MockDocRef, data: any) => {
      operations.push(() => {
        const store = getMockStore();
        store[docRef.path] = processDataForStore(data);
        saveMockStore(store);
        triggerDocListeners(docRef.path);
      });
    },
    update: (docRef: MockDocRef, data: any) => {
      operations.push(() => {
        const store = getMockStore();
        const current = store[docRef.path] || {};
        store[docRef.path] = { ...current, ...processDataForStore(data) };
        saveMockStore(store);
        triggerDocListeners(docRef.path);
      });
    },
    delete: (docRef: MockDocRef) => {
      operations.push(() => {
        const store = getMockStore();
        delete store[docRef.path];
        saveMockStore(store);
        triggerDocListeners(docRef.path);
      });
    },
    commit: async () => {
      operations.forEach(op => op());
    }
  };
};

export const runTransactionMock = async (dbInstance: any, transactionFunction: (transaction: any) => Promise<any>) => {
  const store = getMockStore();
  const operations: Array<() => void> = [];
  
  const transaction = {
    get: async (docRef: MockDocRef) => {
      const data = retrieveDataFromStore(store[docRef.path]);
      return {
        exists: () => data !== undefined && data !== null,
        data: () => data
      };
    },
    update: (docRef: MockDocRef, data: any) => {
      operations.push(() => {
        const currentStore = getMockStore();
        const current = currentStore[docRef.path] || {};
        currentStore[docRef.path] = { ...current, ...processDataForStore(data) };
        saveMockStore(currentStore);
        triggerDocListeners(docRef.path);
      });
    },
    set: (docRef: MockDocRef, data: any) => {
      operations.push(() => {
        const currentStore = getMockStore();
        currentStore[docRef.path] = processDataForStore(data);
        saveMockStore(currentStore);
        triggerDocListeners(docRef.path);
      });
    }
  };
  
  const result = await transactionFunction(transaction);
  operations.forEach(op => op());
  return result;
};


// --- EXPORTS IN FACADE PATTERN ---

export const auth = isMock ? getAuthFromMock() : realAuth;
export const db = isMock ? {} : realDb;

export const onAuthStateChanged = isMock ? onAuthStateChangedMock : fAuth.onAuthStateChanged;
export const createUserWithEmailAndPassword = isMock ? createUserWithEmailAndPasswordMock : fAuth.createUserWithEmailAndPassword;
export const signInWithEmailAndPassword = isMock ? signInWithEmailAndPasswordMock : fAuth.signInWithEmailAndPassword;
export const signOut = isMock ? signOutMock : fAuth.signOut;

export const doc = isMock ? docMock : fFirestore.doc;
export const collection = isMock ? collectionMock : fFirestore.collection;
export const setDoc = isMock ? setDocMock : fFirestore.setDoc;
export const updateDoc = isMock ? updateDocMock : fFirestore.updateDoc;
export const onSnapshot = isMock ? onSnapshotMock : fFirestore.onSnapshot;
export const query = isMock ? queryMock : fFirestore.query;
export const where = isMock ? whereMock : fFirestore.where;
export const orderBy = isMock ? orderByMock : fFirestore.orderBy;
export const limit = isMock ? limitMock : fFirestore.limit;
export const getDocs = isMock ? getDocsMock : fFirestore.getDocs;
export const writeBatch = isMock ? writeBatchMock : fFirestore.writeBatch;
export const runTransaction = isMock ? runTransactionMock : fFirestore.runTransaction;
export const Timestamp = (isMock ? MockTimestamp : fFirestore.Timestamp) as any;

export const authenticate = async () => {
  if (isMock) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Mock Auth system initialized successfully. User is initially: ", mockCurrentUser);
        resolve(mockCurrentUser);
      }, 300);
    });
  }

  await fAuth.setPersistence(auth, fAuth.inMemoryPersistence);

  return new Promise((resolve, reject) => {
    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
      console.log("Authenticating with custom token...");
      fAuth.signInWithCustomToken(auth, __initial_auth_token)
        .then(resolve)
        .catch((err) => {
          console.error("Custom token sign-in failed, trying anonymous:", err);
          fAuth.signInAnonymously(auth).then(resolve).catch(reject);
        });
    } else {
      console.log("No custom token, authenticating anonymously...");
      fAuth.signInAnonymously(auth).then(resolve).catch(reject);
    }
  });
};
