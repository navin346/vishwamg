import React, { useState } from 'react';
import LoginScreen from './pages/LoginScreen';
import OTPScreen from './pages/OTPScreen';
import MainApp from './MainApp';

type AuthStep = 'login' | 'otp' | 'loggedIn';

const App: React.FC = () => {
  const [authStep, setAuthStep] = useState<AuthStep>('login');

  const handleEmailSignIn = () => {
    setAuthStep('otp');
  };

  const handleOtpSuccess = () => {
    setAuthStep('loggedIn');
  };

  const handleLogout = () => {
    setAuthStep('login');
  };

  switch (authStep) {
    case 'login':
      return <LoginScreen onEmailSignIn={handleEmailSignIn} />;
    case 'otp':
      return <OTPScreen onSuccess={handleOtpSuccess} />;
    case 'loggedIn':
      return <MainApp onLogout={handleLogout} />;
    default:
      return <LoginScreen onEmailSignIn={handleEmailSignIn} />;
  }
};

export default App;