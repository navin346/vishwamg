import React, { useState } from 'react';
import LoginScreen from './src/pages/LoginScreen';
import OTPScreen from './src/pages/OTPScreen';
import MainApp from './src/MainApp';

type AuthStep = 'login' | 'otp' | 'loggedIn';

const App: React.FC = () => {
  const [authStep, setAuthStep] = useState<AuthStep>('login');

  const handleEmailSignIn = () => {
    setAuthStep('otp');
  };

  const handleOtpSuccess = () => {
    setAuthStep('loggedIn');
  };

  switch (authStep) {
    case 'login':
      return <LoginScreen onEmailSignIn={handleEmailSignIn} />;
    case 'otp':
      return <OTPScreen onSuccess={handleOtpSuccess} />;
    case 'loggedIn':
      return <MainApp />;
    default:
      return <LoginScreen onEmailSignIn={handleEmailSignIn} />;
  }
};

export default App;
