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
import SpendsScreen from './pages/SpendsScreen';
import LinkBankAccountScreen from './pages/LinkBankAccountScreen';
import ManageCategoriesScreen from './pages/ManageCategoriesScreen';
import TransactionDetailScreen from './pages/TransactionDetailScreen';
import { TransactionSummary } from './data';

export type ActivePage = 'home' | 'pay' | 'history' | 'spends' | 'profile';
export type ActiveModal = 'send' | 'add_money' | 'withdraw' | 'kyc' | 'link_bank' | 'manage_categories' | 'transaction_detail' | null;
export type BankAccountType = 'us' | 'inr';

interface MainAppProps {
  onLogout: () => void;
}

const MainApp: React.FC<MainAppProps> = ({ onLogout }) => {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [bankAccountType, setBankAccountType] = useState<BankAccountType>('us');
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionSummary | null>(null);

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
        return <HomeScreen setActivePage={setActivePage} setActiveModal={setActiveModal} />;
      case 'pay':
        return <PayScreen />;
      case 'history':
        return <HistoryScreen onTransactionClick={handleOpenTransactionDetail} />;
      case 'spends':
        return <SpendsScreen onTransactionClick={handleOpenTransactionDetail} />;
      case 'profile':
        return <ProfileScreen setActiveModal={setActiveModal} openLinkBankModal={handleOpenLinkBankModal} />;
      default:
        return <HomeScreen setActivePage={setActivePage} setActiveModal={setActiveModal} />;
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