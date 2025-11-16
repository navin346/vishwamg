import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { auth, db, authenticate } from '@/src/firebase';
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
export type AuthFlow = 'loggedIn' | 'kycStart' | 'kycForm' | 'selectResidency';

interface IbanDetails { iban: string; bic: string; }
interface BankAccount { bankName: string; accountNumber: string; routingNumber: string; }
interface UserData {
  userMode: UserMode | null;
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
  setUserResidency: (mode: UserMode) => Promise<void>;
  addMoney: (amount: number) => Promise<void>;
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
         if (!currentUser) {
            setLoading(false); // If no user, stop loading
        }
    });

    // Trigger platform authentication. onAuthStateChanged will pick up the result.
    authenticate().catch(error => {
        console.error("Initial authentication failed", error);
        setLoading(false); // Stop loading on auth error
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
          const data = docSnap.data() as Partial<UserData>;
          // Force residency selection if it hasn't been set
          if (!data.userMode) {
            setAuthFlow('selectResidency');
          } else if (authFlow === 'selectResidency' && data.userMode) {
            // If mode was just set, return to the main app view
            setAuthFlow('loggedIn');
          }
          
          setUserData(prev => ({ ...prev, ...data }));

        } else {
            console.warn(`User document for ${user.uid} not found. This may happen briefly during signup.`);
        }
        setLoading(false); // Data loaded (or not found), stop loading.
      });
    } else {
        // Reset to default state when logged out
        setUserData({
            userMode: null,
            balance: '0.00',
            kycStatus: 'unverified',
            ibanDetails: null,
            linkedAccounts: { us: null, inr: null },
            categories: initialCategories,
        });
        setAuthFlow('loggedIn');
    }
    return () => unsubscribe && unsubscribe();
  }, [user]);

  // --- ASYNC ACTIONS ---
  
  const signUp = async (email: string, pass: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const newUser = userCredential.user;
    
    // Create user document in Firestore, WITHOUT userMode
    const userDocRef = doc(db, 'users', newUser.uid);
    const initialUserData = {
        balance: '0.00', // Starting balance
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

  const setUserResidency = async (mode: UserMode) => {
    await updateUserDoc({ userMode: mode });
    setAuthFlow('loggedIn');
  };
  
  const addMoney = async (amount: number) => {
    if (!user) throw new Error("No user is signed in.");
    if (amount <= 0) throw new Error("Amount must be positive.");

    const userDocRef = doc(db, 'users', user.uid);
    const batch = writeBatch(db);

    // Get the latest user document to ensure the balance is up-to-date
    const userDocSnap = await getDoc(userDocRef);
    if (!userDocSnap.exists()) {
        throw new Error("User document does not exist.");
    }
    const currentData = userDocSnap.data();
    const currentBalance = parseFloat(currentData.balance.replace(/,/g, ''));
    const newBalance = currentBalance + amount;

    // Format the balance with commas for consistency
    const formattedBalance = newBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // 1. Update Balance in the user document
    batch.update(userDocRef, { balance: formattedBalance });

    // 2. Create a new transaction document
    const transactionRef = doc(collection(db, 'users', user.uid, 'transactions'));
    const currency = userData.userMode === 'INDIA' ? 'INR' : 'USD';
    batch.set(transactionRef, {
        merchant: "Deposit",
        category: "Income",
        amount: amount,
        currency: currency,
        method: 'Bank Transfer',
        timestamp: Timestamp.now()
    });

    await batch.commit();
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
