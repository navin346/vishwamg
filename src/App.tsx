import React from 'react';
import LoginScreen from './pages/LoginScreen';
import OTPScreen from './pages/OTPScreen';
import SelectResidencyScreen from './pages/SelectResidencyScreen';
import KycStartScreen from './pages/KycStartScreen';
import KycFormScreen from './pages/KycFormScreen';
import MainApp from './MainApp';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider, useAppContext } from './context/AppContext';
import BackgroundAnimation from './components/BackgroundAnimation';

const AppContent: React.FC = () => {
  // Auth state is now managed in context
  const { authStep, setAuthStep, startKyc } = useAppContext();

  const handleEmailSignIn = () => {
    setAuthStep('otp');
  };

  const handleOtpSuccess = () => {
    setAuthStep('residency');
  };

  // KYC flow is no longer linear. This is triggered from *within* the app.
  const handleKycSuccess = () => {
    startKyc(); // This function will set kycStatus and setAuthStep('loggedIn')
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
        // On success, go straight to the app
        return <SelectResidencyScreen onSuccess={() => setAuthStep('loggedIn')} />;
      
      // KYC screens are now part of the auth flow, but triggered from inside MainApp
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
        <BackgroundAnimation />
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;
