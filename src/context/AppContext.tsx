import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import mockData from '../data/mock-data.json';

// Define the possible user modes
export type UserMode = 'INTERNATIONAL' | 'INDIA';
export type KycStatus = 'unverified' | 'pending' | 'verified';

// Define the shape of the context data
interface AppContextType {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  balance: string;
  kycStatus: KycStatus;
  startKyc: () => void;
}

// Create the context with a default value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create the provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userMode, setUserModeState] = useState<UserMode>('INTERNATIONAL');
  const [balance, setBalance] = useState<string>(mockData.international.balance);
  const [kycStatus, setKycStatus] = useState<KycStatus>('unverified');
  
  const setUserMode = useCallback((mode: UserMode) => {
      setUserModeState(mode);
      if (mode === 'INTERNATIONAL') {
          setBalance(mockData.international.balance);
      } else {
          // In a real app, you might fetch this, but for now we'll use a placeholder.
          setBalance('25,000.50'); 
      }
  }, []);

  const startKyc = useCallback(() => {
    setKycStatus('pending');
    // Simulate API call for KYC verification
    setTimeout(() => {
        setKycStatus('verified');
    }, 3000);
  }, []);

  const value = { userMode, setUserMode, balance, kycStatus, startKyc };

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