
import React, { useState } from 'react';
import Header from './components/Header';
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
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-20">
        <Header />
        {renderContent()}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </AppProvider>
  );
};

export default MainApp;
