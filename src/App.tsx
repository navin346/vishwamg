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

  const renderActiveScreen = () => {
    if (loading) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center bg-white relative h-full">
           <BackgroundMesh />
           <div className="relative z-10 flex flex-col items-center p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600 mb-4 shadow-sm"></div>
              <p className="text-violet-950 font-bold tracking-widest text-[11px] uppercase">Initializing Vault</p>
           </div>
        </div>
      );
    }

    // If user is not logged in, show the login screen
    if (!user) {
      return (
          <div className="flex-1 flex flex-col relative h-full overflow-hidden">
              <BackgroundMesh />
              <LoginScreen />
          </div>
      );
    }

    // Force residency selection if user exists but their userMode is not set
    if (authFlow === 'selectResidency' || !userMode) {
        return (
          <div className="flex-1 flex flex-col relative h-full overflow-hidden">
              <BackgroundMesh />
              <SelectResidencyScreen onSuccess={setUserResidency} />
          </div>
        );
    }
    
    // If user is logged in, show the app or the JIT KYC flow if triggered
    switch (authFlow) {
        case 'kycStart':
          return (
              <div className="flex-1 flex flex-col relative h-full overflow-hidden">
                  <BackgroundMesh />
                  <KycStartScreen onSuccess={() => setAuthFlow('kycForm')} />
              </div>
          );
        case 'kycForm':
          return (
              <div className="flex-1 flex flex-col relative h-full overflow-hidden">
                   <BackgroundMesh />
                   <KycFormScreen onSuccess={startKyc} />
              </div>
          );
        default:
          // The main, logged-in application experience
          return (
              <div className="flex-1 flex flex-col relative h-full overflow-hidden bg-white/45">
                  <BackgroundMesh />
                  <MainApp onLogout={signOut} />
              </div>
          );
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-white flex items-center justify-center">
       <div className="relative w-full max-w-sm md:max-w-md h-[100dvh] md:h-[94vh] md:my-auto md:rounded-[2.5rem] md:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col border border-neutral-150 bg-white">
          {renderActiveScreen()}
       </div>
    </div>
  );
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
