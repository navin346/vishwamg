
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the possible user modes
export type UserMode = 'INTERNATIONAL' | 'INDIA';

// Define the shape of the context data
interface AppContextType {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
}

// Create the context with a default value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create the provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userMode, setUserMode] = useState<UserMode>('INTERNATIONAL');

  const value = { userMode, setUserMode };

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
