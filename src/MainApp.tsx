import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomeScreen from './pages/HomeScreen';
import PayScreen from './pages/PayScreen';
import HistoryScreen from './pages/HistoryScreen';

type ActivePage = 'home' | 'pay' | 'history';

interface MainAppProps {
  onLogout: () => void;
}

const MainApp: React.FC<MainAppProps> = ({ onLogout }) => {
  const [activePage, setActivePage] = useState<ActivePage>('home');

  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return <HomeScreen setActivePage={setActivePage} />;
      case 'pay':
        return <PayScreen />;
      case 'history':
        return <HistoryScreen />;
      default:
        return <HomeScreen setActivePage={setActivePage} />;
    }
  };

  return (
    <AppProvider>
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col border-x border-slate-200 dark:border-slate-800 bg-white dark:bg-black">
        <Header onLogout={onLogout} />
        <main className="flex-grow overflow-y-auto pb-20">
          {renderContent()}
        </main>
        <BottomNav activePage={activePage} setActivePage={setActivePage} />
      </div>
    </AppProvider>
  );
};

export default MainApp;