import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomeScreen from './pages/HomeScreen';
import PayScreen from './pages/PayScreen';
import HistoryScreen from './pages/HistoryScreen';
import ProfileScreen from './pages/ProfileScreen';
import SendMoneyScreen from './pages/SendMoneyScreen';
import AddMoneyScreen from './pages/AddMoneyScreen';
import WithdrawScreen from './pages/WithdrawScreen';
import KycScreen from './pages/KycScreen';

export type ActivePage = 'home' | 'pay' | 'history' | 'profile';
export type ActiveModal = 'send' | 'add_money' | 'withdraw' | 'kyc' | null;


interface MainAppProps {
  onLogout: () => void;
}

const MainApp: React.FC<MainAppProps> = ({ onLogout }) => {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return <HomeScreen setActivePage={setActivePage} setActiveModal={setActiveModal} />;
      case 'pay':
        return <PayScreen />;
      case 'history':
        return <HistoryScreen />;
      case 'profile':
        return <ProfileScreen setActiveModal={setActiveModal} />;
      default:
        return <HomeScreen setActivePage={setActivePage} setActiveModal={setActiveModal} />;
    }
  };

  const renderModal = () => {
    const handleClose = () => setActiveModal(null);
    switch (activeModal) {
      case 'send':
        return <SendMoneyScreen onClose={handleClose} />;
      case 'add_money':
        return <AddMoneyScreen onClose={handleClose} />;
      case 'withdraw':
        return <WithdrawScreen onClose={handleClose} />;
      case 'kyc':
          return <KycScreen onClose={handleClose} />;
      default:
        return null;
    }
  }

  return (
    <AppProvider>
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col border-x border-slate-200 dark:border-slate-800 bg-white dark:bg-black">
        <Header onLogout={onLogout} />
        <main className="flex-grow overflow-y-auto pb-20">
          {renderContent()}
        </main>
        {renderModal()}
        <BottomNav activePage={activePage} setActivePage={setActivePage} />
      </div>
    </AppProvider>
  );
};

export default MainApp;