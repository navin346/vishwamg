import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import mockData from '../data/mock-data.json';
import usdTransactions from '../data/mock-transactions-usd.json';
import inrTransactions from '../data/mock-transactions-inr.json';

// Define the possible user modes
export type UserMode = 'INTERNATIONAL' | 'INDIA';
export type KycStatus = 'unverified' | 'pending' | 'verified';

interface IbanDetails {
  iban: string;
  bic: string;
}

interface BankAccount {
  bankName: string;
  accountNumber: string;
  // Could be routing number for US, IFSC for INR, etc.
  routingNumber: string; 
}

// Define the shape of the context data
interface AppContextType {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  balance: string;
  kycStatus: KycStatus;
  startKyc: () => void;
  ibanDetails: IbanDetails | null;
  createIbanAccount: () => void;
  linkedAccounts: {
    us: BankAccount | null;
    inr: BankAccount | null;
  };
  linkAccount: (type: 'us' | 'inr', details: BankAccount) => void;
  categories: string[];
  addCategory: (name: string) => void;
  editCategory: (oldName: string, newName: string) => void;
  deleteCategory: (name: string) => void;
}

// Create the context with a default value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to get unique categories from transactions
const getInitialCategories = (transactions: any[]): string[] => {
    const categorySet = new Set<string>();
    transactions.forEach(tx => categorySet.add(tx.category));
    return Array.from(categorySet);
};

// Create the provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userMode, setUserModeState] = useState<UserMode>('INTERNATIONAL');
  const [balance, setBalance] = useState<string>(mockData.international.balance);
  const [kycStatus, setKycStatus] = useState<KycStatus>('unverified');
  const [ibanDetails, setIbanDetails] = useState<IbanDetails | null>(null);
  const [linkedAccounts, setLinkedAccounts] = useState<{ us: BankAccount | null, inr: BankAccount | null }>({ us: null, inr: null });
  
  const [internationalCategories, setInternationalCategories] = useState<string[]>(getInitialCategories(usdTransactions.transactions));
  const [indiaCategories, setIndiaCategories] = useState<string[]>(getInitialCategories(inrTransactions.transactions));

  const setUserMode = useCallback((mode: UserMode) => {
      setUserModeState(mode);
      if (mode === 'INTERNATIONAL') {
          setBalance(mockData.international.balance);
      } else {
          setBalance('25,000.50'); 
      }
  }, []);

  const startKyc = useCallback(() => {
    setKycStatus('pending');
    setTimeout(() => setKycStatus('verified'), 3000);
  }, []);
  
  const createIbanAccount = useCallback(() => {
      // Simulate API call to create an IBAN account
      setTimeout(() => {
          setIbanDetails({
              iban: 'DE89 3704 0044 0532 0130 00',
              bic: 'COBADEFFXXX'
          });
      }, 2000);
  }, []);

  const linkAccount = useCallback((type: 'us' | 'inr', details: BankAccount) => {
    setLinkedAccounts(prev => ({ ...prev, [type]: details }));
  }, []);

  const categories = userMode === 'INTERNATIONAL' ? internationalCategories : indiaCategories;
  const setCategories = userMode === 'INTERNATIONAL' ? setInternationalCategories : setIndiaCategories;

  const addCategory = useCallback((name: string) => {
    if (name && !categories.includes(name)) {
        setCategories([...categories, name]);
    }
  }, [categories, setCategories]);

  const editCategory = useCallback((oldName: string, newName: string) => {
    if (newName && !categories.includes(newName)) {
        setCategories(categories.map(c => c === oldName ? newName : c));
    }
  }, [categories, setCategories]);

  const deleteCategory = useCallback((name: string) => {
    setCategories(categories.filter(c => c !== name));
  }, [categories, setCategories]);


  const value = { 
      userMode, 
      setUserMode, 
      balance, 
      kycStatus, 
      startKyc, 
      ibanDetails, 
      createIbanAccount,
      linkedAccounts,
      linkAccount,
      categories,
      addCategory,
      editCategory,
      deleteCategory
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Create a custom hook to use the AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};