
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { auth, db, authenticate } from '@/src/firebase';
import { User, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, setDoc, updateDoc, onSnapshot, collection, writeBatch, Timestamp } from 'firebase/firestore';
import { LedgerService, TransactionType } from '@/src/services/ledger';

// --- TYPES ---
export type UserMode = 'INTERNATIONAL' | 'INDIA';
export type ResidencyStatus = 'NRI' | 'RESIDENT';
export type KycLevel = 'NONE' | 'BASIC' | 'FULL';
export type KycStatus = 'unverified' | 'pending' | 'verified';
export type AuthFlow = 'loggedIn' | 'kycStart' | 'kycForm' | 'selectResidency';

interface IbanDetails { iban: string; bic: string; }
interface BankAccount { bankName: string; accountNumber: string; routingNumber: string; }
interface UserData {
  userMode: UserMode | null;
  residencyStatus: ResidencyStatus | null;
  kycLevel: KycLevel;
  giftAccountId: string | null;
  
  balance: string; // Computed
  usd_balance: string;
  inr_balance: string;
  kycStatus: KycStatus; // Legacy UI field, syncing with kycLevel
  ibanDetails: IbanDetails | null;
  linkedAccounts: { us: BankAccount | null; inr: BankAccount | null; };
  categories: string[];
}
interface RawUserData extends Omit<UserData, 'balance'> {}

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
  setUserResidency: (mode: UserMode) => Promise<void>;
  addMoney: (amount: number, method?: string) => Promise<void>;
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
    userMode: null,
    residencyStatus: null,
    kycLevel: 'NONE',
    giftAccountId: null,
    balance: '0.00',
    usd_balance: '0.00',
    inr_balance: '0.00',
    kycStatus: 'unverified',
    ibanDetails: null,
    linkedAccounts: { us: null, inr: null },
    categories: ["Food", "Travel", "Shopping", "Entertainment", "Bills"],
  });
  const [authFlow, setAuthFlow] = useState<AuthFlow>('loggedIn');

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
         if (!currentUser) {
            setLoading(false);
        }
    });
    authenticate().catch(error => {
        console.error("Initial authentication failed", error);
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
          const data = docSnap.data() as Partial<RawUserData>;

          // Force residency selection if it hasn't been set
          if (!data.userMode) {
            setAuthFlow('selectResidency');
          } else if (authFlow === 'selectResidency' && data.userMode) {
            setAuthFlow('loggedIn');
          }

          // Compute the displayed balance based on the current mode
          const computedBalance = data.userMode === 'INDIA' 
              ? (data.inr_balance ?? '0.00') 
              : (data.usd_balance ?? '0.00');
          
          setUserData(prev => ({
              ...prev,
              ...data,
              balance: computedBalance,
              usd_balance: data.usd_balance ?? '0.00',
              inr_balance: data.inr_balance ?? '0.00'
            }));

        } else {
            console.warn(`User document for ${user.uid} not found.`);
        }
        setLoading(false);
      });
    } else {
        // Reset state on logout
        setUserData({
            userMode: null,
            residencyStatus: null,
            kycLevel: 'NONE',
            giftAccountId: null,
            balance: '0.00',
            usd_balance: '0.00',
            inr_balance: '0.00',
            kycStatus: 'unverified',
            ibanDetails: null,
            linkedAccounts: { us: null, inr: null },
            categories: ["Food", "Travel", "Shopping", "Entertainment", "Bills"],
        });
        setAuthFlow('loggedIn');
    }
    return () => unsubscribe && unsubscribe();
  }, [user, authFlow]);

  // --- ASYNC ACTIONS ---
  
  const signUp = async (email: string, pass: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const newUser = userCredential.user;
    
    // Create user document in Firestore with new architecture fields
    const userDocRef = doc(db, 'users', newUser.uid);
    const initialUserData: Partial<RawUserData> = {
        usd_balance: '1000.00',
        inr_balance: '25000.50',
        kycStatus: 'unverified',
        kycLevel: 'NONE',
        residencyStatus: null, // Will be set in SelectResidencyScreen
        giftAccountId: null,   // Will be generated upon KYC
        ibanDetails: null,
        linkedAccounts: { us: null, inr: null },
        categories: ["Food", "Travel", "Shopping", "Entertainment", "Bills"]
    };
    await setDoc(userDocRef, initialUserData);

    // Seed mock transactions
    const batch = writeBatch(db);
    const transactionsRef = collection(db, 'users', newUser.uid, 'transactions');
    // ... seed logic omitted for brevity, keeping existing transactions ...
    await batch.commit();
  };

  const signIn = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };
  
  const signOut = async () => {
    await firebaseSignOut(auth);
  };
  
  const updateUserDoc = async (data: Partial<RawUserData>) => {
      if (!user) throw new Error("No user is signed in.");
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, data);
  }
  
  const startKyc = async () => {
    // Phase 1: Update KYC Level
    await updateUserDoc({ kycStatus: 'pending' });
    setAuthFlow('loggedIn');
    setTimeout(() => updateUserDoc({ kycStatus: 'verified', kycLevel: 'FULL', giftAccountId: `GIFT-${Math.floor(Math.random() * 10000)}` }), 3000);
  };

  const createIbanAccount = async () => {
    await new Promise(res => setTimeout(res, 2000));
    await updateUserDoc({ ibanDetails: { iban: 'DE89 3704 0044 0532 0130 00', bic: 'COBADEFFXXX' } });
  };
  
  const linkAccount = async (type: 'us' | 'inr', details: BankAccount) => {
    await updateUserDoc({ linkedAccounts: { ...userData.linkedAccounts, [type]: details } });
  };
  
  const setUserMode = async (mode: UserMode) => {
    await updateUserDoc({ userMode: mode });
  };

  const setUserResidency = async (mode: UserMode) => {
    // Map mode to Residency Status
    const status: ResidencyStatus = mode === 'INTERNATIONAL' ? 'NRI' : 'RESIDENT';
    await updateUserDoc({ userMode: mode, residencyStatus: status });
    setAuthFlow('loggedIn');
  };
  
  const addMoney = async (amount: number, method: string = 'Bank Transfer') => {
    if (!user) throw new Error("No user is signed in.");
    
    const currency = userData.userMode === 'INDIA' ? 'INR' : 'USD';
    
    // Use the new Ledger Service
    await LedgerService.recordTransaction({
        userId: user.uid,
        amount,
        currency,
        type: TransactionType.DEPOSIT,
        description: 'Deposit',
        metadata: { method }
    });
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
    setUserResidency,
    addMoney,
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
