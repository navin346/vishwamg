import React, { useState } from 'react';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import SpendPage from './pages/SpendPage';
import ProfilePage from './pages/ProfilePage';
import { AppProvider } from './context/AppContext';

export type Tab = 'home' | 'spend' | 'profile';

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'spend':
        return <SpendPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };
  
  return (
    <AppProvider>
      <div className="min-h-screen bg-near-black text-white font-sans pb-28">
        <div className="container mx-auto max-w-lg">
            {renderContent()}
        </div>
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </AppProvider>
  );
};

export default MainApp;