import React from 'react';
import LoginScreen from '@/src/pages/LoginScreen';
import SelectResidencyScreen from '@/src/pages/SelectResidencyScreen';
import KycStartScreen from '@/src/pages/KycStartScreen';
import KycFormScreen from '@/src/pages/KycFormScreen';
import MainApp from '@/src/MainApp';
import { ThemeProvider } from '@/src/context/ThemeContext';
import { AppProvider, useAppContext } from '@/src/context/AppContext';

const AppContent: React.FC = () => {
  const { user, loading, authFlow, setAuthFlow, signOut, startKyc, userMode, setUserResidency } = useAppContext();

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If user is not logged in, show the login screen
  if (!user) {
    return <LoginScreen />;
  }

  // Force residency selection if user exists but their userMode is not set
  if (authFlow === 'selectResidency' || !userMode) {
      return <SelectResidencyScreen onSuccess={setUserResidency} />;
  }
  
  // If user is logged in, show the app or the JIT KYC flow if triggered
  switch (authFlow) {
      case 'kycStart':
        return <KycStartScreen onSuccess={() => setAuthFlow('kycForm')} />;
      case 'kycForm':
        return <KycFormScreen onSuccess={startKyc} />;
      default:
        // The main, logged-in application experience
        return <MainApp onLogout={signOut} />;
  }
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;