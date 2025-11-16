import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { auth, db } from '@/src/firebase';
import { User, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, collection, writeBatch, Timestamp } from 'firebase/firestore';


// --- MOCK DATA FOR NEW USER SEEDING ---
const initialUsdTransactions = [
    { id: "t1_usd", merchant: "Starbucks", category: "Food", amount: 5.75, date: "Oct 28", timestamp: Timestamp.now(), method: "Virtual Card", currency: "USD" },
    { id: "t2_usd", merchant: "Netflix", category: "Entertainment", amount: 15.49, date: "Oct 28", timestamp: Timestamp.now(), method: "Virtual Card", currency: "USD" },
    { id: "t3_usd", merchant: "Amazon.com", category: "Shopping", amount: 78.90, date: "Oct 27", timestamp: Timestamp.now(), method: "Virtual Card", currency: "USD" },
];
const initialInrTransactions = [
    { id: "t1_inr", merchant: "Zomato", category: "Food", amount: 450.00, date: "Oct 28", timestamp: Timestamp.now(), method: "UPI", currency: "INR" },
    { id: "t2_inr", merchant: "Ola Cabs", category: "Travel", amount: 280.50, date: "Oct 28", timestamp: Timestamp.now(), method: "UPI", currency: "INR" },
    { id: "t3_inr", merchant: "Amazon.in", category: "Shopping", amount: 1250.00, date: "Oct 27", timestamp: Timestamp.now(), method: "Credit Card", currency: "INR" },
];
const initialCategories = ["Food", "Travel", "Shopping", "Entertainment", "Bills"];

// --- TYPES ---
export type UserMode = 'INTERNATIONAL' | 'INDIA';
export type KycStatus = 'unverified' | 'pending' | 'verified';
export type AuthFlow = 'loggedIn' | 'kycStart' | 'kycForm';

interface IbanDetails { iban: string; bic: string; }
interface BankAccount { bankName: string; accountNumber: string; routingNumber: string; }
interface UserData {
  userMode: UserMode;
  balance: string;
  kycStatus: KycStatus;
  ibanDetails: IbanDetails | null;
  linkedAccounts: { us: BankAccount | null; inr: BankAccount | null; };
  categories: string[];
}

interface AppContextType extends UserData {
  user: User | null;
  loading: boolean;
  authFlow: AuthFlow;
  setAuthFlow: (flow: AuthFlow) => void;
  signUp: (email: string, pass: string) => Promise<void>;
  signIn: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
  startKyc: () => Promise<void>;
  createIbanAccount: () => Promise<void>;
  linkAccount: (type: 'us' | 'inr', details: BankAccount) => Promise<void>;
  setUserMode: (mode: UserMode) => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  editCategory: (oldName: string, newName: string) => Promise<void>;
  deleteCategory: (name: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// --- PROVIDER ---
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData>({
    userMode: 'INTERNATIONAL',
    balance: '0.00',
    kycStatus: 'unverified',
    ibanDetails: null,
    linkedAccounts: { us: null, inr: null },
    categories: initialCategories,
  });
  const [authFlow, setAuthFlow] = useState<AuthFlow>('loggedIn');

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Listen for Firestore User Data changes
  useEffect(() => {
    let unsubscribe: () => void;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as UserData;
          setUserData(data);
          // Set balance based on user mode
          if (data.userMode === 'INDIA') {
              setUserData(prev => ({...prev, balance: '25,000.50'})); // Mock INR balance
          }
        }
      });
    } else {
        // Reset to default state when logged out
        setUserData({
            userMode: 'INTERNATIONAL',
            balance: '0.00',
            kycStatus: 'unverified',
            ibanDetails: null,
            linkedAccounts: { us: null, inr: null },
            categories: initialCategories,
        });
    }
    return () => unsubscribe && unsubscribe();
  }, [user]);

  // --- ASYNC ACTIONS ---
  
  const signUp = async (email: string, pass: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const newUser = userCredential.user;
    
    // Create user document in Firestore
    const userDocRef = doc(db, 'users', newUser.uid);
    const initialUserData: UserData = {
        userMode: 'INTERNATIONAL',
        balance: '1,000.00', // Starting balance
        kycStatus: 'unverified',
        ibanDetails: null,
        linkedAccounts: { us: null, inr: null },
        categories: initialCategories
    };
    await setDoc(userDocRef, initialUserData);

    // Seed initial transactions in a batch
    const batch = writeBatch(db);
    const transactionsRef = collection(db, 'users', newUser.uid, 'transactions');
    initialUsdTransactions.forEach(tx => batch.set(doc(transactionsRef, tx.id), tx));
    initialInrTransactions.forEach(tx => batch.set(doc(transactionsRef, tx.id), tx));
    await batch.commit();
  };

  const signIn = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };
  
  const signOut = async () => {
    await firebaseSignOut(auth);
  };
  
  const updateUserDoc = async (data: Partial<UserData>) => {
      if (!user) throw new Error("No user is signed in.");
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, data);
  }
  
  const startKyc = async () => {
    await updateUserDoc({ kycStatus: 'pending' });
    setAuthFlow('loggedIn'); // Return user to the app
    setTimeout(() => updateUserDoc({ kycStatus: 'verified' }), 3000); // Simulate verification
  };

  const createIbanAccount = async () => {
    await new Promise(res => setTimeout(res, 2000)); // Simulate API delay
    await updateUserDoc({ ibanDetails: { iban: 'DE89 3704 0044 0532 0130 00', bic: 'COBADEFFXXX' } });
  };
  
  const linkAccount = async (type: 'us' | 'inr', details: BankAccount) => {
    await updateUserDoc({ linkedAccounts: { ...userData.linkedAccounts, [type]: details } });
  };
  
  const setUserMode = async (mode: UserMode) => {
    await updateUserDoc({ userMode: mode, balance: mode === 'INTERNATIONAL' ? '1,000.00' : '25,000.50' });
  };

  const addCategory = async (name: string) => {
    if (name && !userData.categories.includes(name)) {
        await updateUserDoc({ categories: [...userData.categories, name] });
    }
  };

  const editCategory = async (oldName: string, newName: string) => {
     if (newName && !userData.categories.includes(newName)) {
        const newCategories = userData.categories.map(c => c === oldName ? newName : c);
        await updateUserDoc({ categories: newCategories });
    }
  };

  const deleteCategory = async (name: string) => {
    const newCategories = userData.categories.filter(c => c !== name);
    await updateUserDoc({ categories: newCategories });
  };


  const value: AppContextType = {
    user,
    loading,
    authFlow,
    setAuthFlow,
    signUp,
    signIn,
    signOut,
    startKyc,
    createIbanAccount,
    linkAccount,
    setUserMode,
    addCategory,
    editCategory,
    deleteCategory,
    ...userData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};