import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomeScreen from './pages/HomeScreen';
import ProfileScreen from './pages/ProfileScreen';
import SendMoneyScreen from './pages/SendMoneyScreen';
import AddMoneyScreen from './pages/AddMoneyScreen';
import WithdrawScreen from './pages/WithdrawScreen';
import KycScreen from './pages/KycScreen';
import SpendsScreen from './pages/SpendsScreen';
import LinkBankAccountScreen from './pages/LinkBankAccountScreen';
import ManageCategoriesScreen from './pages/ManageCategoriesScreen';
import TransactionDetailScreen from './pages/TransactionDetailScreen';
import ScanQRModal from './pages/ScanQRModal';
import { TransactionSummary } from './data';
import { useTheme } from './context/ThemeContext';

export type ActivePage = 'home' | 'spends' | 'profile';
export type ActiveModal = 'send' | 'add_money' | 'withdraw' | 'kyc' | 'link_bank' | 'manage_categories' | 'transaction_detail' | 'scan_qr' | null;
export type BankAccountType = 'us' | 'inr';

interface MainAppProps {
  onLogout: () => void;
}

const AppWithTheme: React.FC<MainAppProps> = ({ onLogout }) => {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [bankAccountType, setBankAccountType] = useState<BankAccountType>('us');
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionSummary | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const body = document.body;
    if (theme === 'dark') {
      body.classList.add('bg-black');
      body.classList.remove('bg-gray-50');
    } else {
      body.classList.add('bg-gray-50');
      body.classList.remove('bg-black');
    }
  }, [theme]);


  const handleOpenLinkBankModal = (type: BankAccountType) => {
    setBankAccountType(type);
    setActiveModal('link_bank');
  }

  const handleOpenTransactionDetail = (transaction: TransactionSummary) => {
    setSelectedTransaction(transaction);
    setActiveModal('transaction_detail');
  };

  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return <HomeScreen setActivePage={setActivePage} setActiveModal={setActiveModal} onTransactionClick={handleOpenTransactionDetail} />;
      case 'spends':
        return <SpendsScreen onTransactionClick={handleOpenTransactionDetail} />;
      case 'profile':
        return <ProfileScreen setActiveModal={setActiveModal} openLinkBankModal={handleOpenLinkBankModal} />;
      default:
        return <HomeScreen setActivePage={setActivePage} setActiveModal={setActiveModal} onTransactionClick={handleOpenTransactionDetail} />;
    }
  };

  const renderModal = () => {
    const handleClose = () => {
        setActiveModal(null);
        setSelectedTransaction(null);
    };
    switch (activeModal) {
      case 'send':
        return <SendMoneyScreen onClose={handleClose} />;
      case 'add_money':
        return <AddMoneyScreen onClose={handleClose} />;
      case 'withdraw':
        return <WithdrawScreen onClose={handleClose} openLinkBankModal={() => handleOpenLinkBankModal('inr')} setActiveModal={setActiveModal} />;
      case 'kyc':
          return <KycScreen onClose={handleClose} />;
      case 'link_bank':
          return <LinkBankAccountScreen onClose={handleClose} type={bankAccountType} />;
      case 'manage_categories':
          return <ManageCategoriesScreen onClose={handleClose} />;
      case 'transaction_detail':
          return selectedTransaction && <TransactionDetailScreen onClose={handleClose} transaction={selectedTransaction} />;
      case 'scan_qr':
          return <ScanQRModal onClose={handleClose} />;
      default:
        return null;
    }
  }

  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col border-x border-gray-200 dark:border-slate-800 bg-white dark:bg-black">
      <Header onLogout={onLogout} />
      <main className="flex-grow overflow-y-auto pb-20">
        {renderContent()}
      </main>
      {renderModal()}
      <BottomNav activePage={activePage} setActivePage={setActivePage} />
    </div>
  );
}

const MainApp: React.FC<MainAppProps> = ({ onLogout }) => {
  return (
    <AppProvider>
      <AppWithTheme onLogout={onLogout} />
    </AppProvider>
  );
};


export default MainApp;