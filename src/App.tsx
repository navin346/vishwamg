import React from 'react';
import LoginScreen from '@/src/pages/LoginScreen';
import OTPScreen from '@/src/pages/OTPScreen';
import SelectResidencyScreen from '@/src/pages/SelectResidencyScreen';
import KycStartScreen from '@/src/pages/KycStartScreen';
import KycFormScreen from '@/src/pages/KycFormScreen';
import MainApp from '@/src/MainApp';
import { ThemeProvider } from '@/src/context/ThemeContext';
import { AppProvider, useAppContext } from '@/src/context/AppContext';
import BackgroundAnimation from '@/src/components/BackgroundAnimation';

const AppContent: React.FC = () => {
  const { user, loading, authFlow, setAuthFlow, signOut, startKyc } = useAppContext();

  // This state now controls the JIT KYC flow inside the logged-in app
  // It is separate from the main user authentication state.
  
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Loading...</h1>
      </div>
    );
  }

  // If user is not logged in, show the login screen
  if (!user) {
    return <LoginScreen />;
  }
  
  // If user is logged in, show the app or the KYC flow if triggered
  switch (authFlow) {
      case 'kycStart':
        return <KycStartScreen onSuccess={() => setAuthFlow('kycForm')} />;
      case 'kycForm':
        // onSuccess here is now simplified; it just calls the async context function
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
        <BackgroundAnimation />
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;