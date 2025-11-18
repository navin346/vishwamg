import React from 'react';
import LoginScreen from '@/src/pages/LoginScreen';
import SelectResidencyScreen from '@/src/pages/SelectResidencyScreen';
import KycStartScreen from '@/src/pages/KycStartScreen';
import KycFormScreen from '@/src/pages/KycFormScreen';
import MainApp from '@/src/MainApp';
import BackgroundMesh from '@/src/components/BackgroundMesh';
import { ThemeProvider } from '@/src/context/ThemeContext';
import { AppProvider, useAppContext } from '@/src/context/AppContext';

const AppContent: React.FC = () => {
  const { user, loading, authFlow, setAuthFlow, signOut, startKyc, userMode, setUserResidency } = useAppContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
         <BackgroundMesh />
         <div className="relative z-10 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
            <p className="text-white font-medium tracking-widest text-xs uppercase">Initializing Vault</p>
         </div>
      </div>
    );
  }

  // If user is not logged in, show the login screen
  if (!user) {
    return (
        <>
            <BackgroundMesh />
            <LoginScreen />
        </>
    );
  }

  // Force residency selection if user exists but their userMode is not set
  if (authFlow === 'selectResidency' || !userMode) {
      return (
        <>
            <BackgroundMesh />
            <SelectResidencyScreen onSuccess={setUserResidency} />
        </>
      );
  }
  
  // If user is logged in, show the app or the JIT KYC flow if triggered
  switch (authFlow) {
      case 'kycStart':
        return (
            <>
                <BackgroundMesh />
                <KycStartScreen onSuccess={() => setAuthFlow('kycForm')} />
            </>
        );
      case 'kycForm':
        return (
            <>
                 <BackgroundMesh />
                 <KycFormScreen onSuccess={startKyc} />
            </>
        );
      default:
        // The main, logged-in application experience
        return (
            <>
                <BackgroundMesh />
                <MainApp onLogout={signOut} />
            </>
        );
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