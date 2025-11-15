import React, { useState } from 'react';
import LoginScreen from './pages/LoginScreen';
import OTPScreen from './pages/OTPScreen';
import SelectResidencyScreen from './pages/SelectResidencyScreen';
import KycStartScreen from './pages/KycStartScreen';
import KycFormScreen from './pages/KycFormScreen';
import MainApp from './MainApp';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider, useAppContext } from './context/AppContext';

type AuthStep = 'login' | 'otp' | 'residency' | 'kycStart' | 'kycForm' | 'loggedIn';

const AppContent: React.FC = () => {
  const [authStep, setAuthStep] = useState<AuthStep>('login');
  const { startKyc } = useAppContext();

  const handleEmailSignIn = () => {
    setAuthStep('otp');
  };

  const handleOtpSuccess = () => {
    setAuthStep('residency');
  };

  const handleKycSuccess = () => {
    startKyc();
    setAuthStep('loggedIn');
  };

  const handleLogout = () => {
    setAuthStep('login');
  };
  
  const renderAuthStep = () => {
    switch (authStep) {
      case 'login':
        return <LoginScreen onEmailSignIn={handleEmailSignIn} />;
      case 'otp':
        return <OTPScreen onSuccess={handleOtpSuccess} />;
      case 'residency':
        return <SelectResidencyScreen onSuccess={() => setAuthStep('kycStart')} />;
      case 'kycStart':
        return <KycStartScreen onSuccess={() => setAuthStep('kycForm')} />;
      case 'kycForm':
        return <KycFormScreen onSuccess={handleKycSuccess} />;
      case 'loggedIn':
        return <MainApp onLogout={handleLogout} />;
      default:
        return <LoginScreen onEmailSignIn={handleEmailSignIn} />;
    }
  };
  
  return <>{renderAuthStep()}</>;
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
