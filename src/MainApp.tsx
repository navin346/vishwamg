import React, { useState, useEffect } from 'react';
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
import BillsScreen from './pages/BillsScreen';
import PayBillModal from './pages/PayBillModal';
import { TransactionSummary } from './data';
import { useTheme } from './context/ThemeContext';
import { useAppContext } from './context/AppContext';
import GlobalPayScreen from './pages/GlobalPayScreen';

export type ActivePage = 'spends' | 'bills' | 'profile';
export type ActiveModal = 'send' | 'add_money' | 'withdraw' | 'kyc' | 'link_bank' | 'manage_categories' | 'transaction_detail' | 'scan_qr' | 'pay_bill' | null;
export type BankAccountType = 'us' | 'inr';

interface MainAppProps {
  onLogout: () => void;
}
interface SelectedBiller {
    name: string;
    amount: number;
}


const MainApp: React.FC<MainAppProps> = ({ onLogout }) => {
  const [activePage, setActivePage] = useState<ActivePage>('spends');
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [bankAccountType, setBankAccountType] = useState<BankAccountType>('us');
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionSummary | null>(null);
  const [selectedBiller, setSelectedBiller] = useState<SelectedBiller | null>(null);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const { theme } = useTheme();
  const { userMode } = useAppContext();

  useEffect(() => {
    const body = document.body;
    if (theme === 'dark') {
      body.classList.add('dark');
      body.classList.remove('light');
      body.classList.add('bg-black');
      body.classList.remove('bg-gray-50');
    } else {
      body.classList.add('light');
      body.classList.remove('dark');
      body.classList.add('bg-gray-50');
      body.classList.remove('bg-black');
    }
  }, [theme]);

  useEffect(() => {
    const handler = (e: Event) => {
        e.preventDefault();
        setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);


  const handleOpenLinkBankModal = (type: BankAccountType) => {
    setBankAccountType(type);
    setActiveModal('link_bank');
  }

  const handleOpenTransactionDetail = (transaction: TransactionSummary) => {
    setSelectedTransaction(transaction);
    setActiveModal('transaction_detail');
  };

  const handleOpenPayBillModal = (billerName: string, amount: number) => {
    setSelectedBiller({ name: billerName, amount });
    setActiveModal('pay_bill');
  };

  const renderContent = () => {
    switch (activePage) {
      // The original 'home' screen is now split between 'spends' and 'profile' functionality.
      // 'spends' is now the landing page.
      case 'spends':
        return <SpendsScreen onTransactionClick={handleOpenTransactionDetail} />;
      case 'bills':
        return userMode === 'INDIA' 
          ? <BillsScreen onPayBiller={handleOpenPayBillModal} />
          : <GlobalPayScreen />;
      case 'profile':
        return <ProfileScreen setActiveModal={setActiveModal} openLinkBankModal={handleOpenLinkBankModal} installPrompt={installPrompt} />;
      default:
        return <SpendsScreen onTransactionClick={handleOpenTransactionDetail} />;
    }
  };

  const renderModal = () => {
    const handleClose = () => {
        setActiveModal(null);
        setSelectedTransaction(null);
        setSelectedBiller(null);
    };
    switch (activeModal) {
      case 'send':
        return <SendMoneyScreen onClose={handleClose} />;
      case 'add_money':
        return <AddMoneyScreen onClose={handleClose} openLinkBankModal={() => handleOpenLinkBankModal('us')} />;
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
      case 'pay_bill':
          return selectedBiller && <PayBillModal onClose={handleClose} billerName={selectedBiller.name} amount={selectedBiller.amount} />;
      default:
        return null;
    }
  }

  return (
    <>
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col border-x border-gray-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-black/80 backdrop-blur-2xl">
        <Header onLogout={onLogout} />
        <main className="flex-grow overflow-y-auto pb-20">
          {renderContent()}
        </main>
        {renderModal()}
        
        {/* FAB for QR Scanner */}
        <div className="absolute bottom-8 right-1/2 z-20 translate-x-1/2">
             <button
                onClick={() => setActiveModal('scan_qr')}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/50 transform transition-transform active:scale-90"
                aria-label="Scan QR code"
            >
                 <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h4v4H4V4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M16 4h4v4h-4V4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M4 16h4v4H4v-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M16 16h4v4h-4v-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M10 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M20 12h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            </button>
        </div>

        <BottomNav activePage={activePage} setActivePage={setActivePage} />
      </div>
    </>
  );
}

export default MainApp;