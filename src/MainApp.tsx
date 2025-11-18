import React, { useState, useEffect } from 'react';
import Header from '@/src/components/Header';
import BottomNav from '@/src/components/BottomNav';
import ProfileScreen from '@/src/pages/ProfileScreen';
import PayScreen from '@/src/pages/PayScreen';
import AddMoneyScreen from '@/src/pages/AddMoneyScreen';
import WithdrawScreen from '@/src/pages/WithdrawScreen';
import HomeScreen from '@/src/pages/HomeScreen';
import AnalyticsScreen from '@/src/pages/AnalyticsScreen';
import LinkBankAccountScreen from '@/src/pages/LinkBankAccountScreen';
import ManageCategoriesScreen from '@/src/pages/ManageCategoriesScreen';
import TransactionDetailScreen from '@/src/pages/TransactionDetailScreen';
import ScanQRModal from '@/src/pages/ScanQRModal';
import BillsScreen from '@/src/pages/BillsScreen';
import PayBillModal from '@/src/pages/PayBillModal';
import GlobalPayScreen from '@/src/pages/GlobalPayScreen';
import YieldScreen from '@/src/pages/YieldScreen';
import { TransactionSummary } from '@/src/data';
import { useAppContext } from '@/src/context/AppContext';

export type ActivePage = 'home' | 'analytics' | 'yield' | 'bills' | 'profile';
export type ActiveModal = 'pay' | 'add_money' | 'withdraw' | 'link_bank' | 'manage_categories' | 'transaction_detail' | 'scan_qr' | 'pay_bill' | null;
export type BankAccountType = 'us' | 'inr';

interface MainAppProps {
  onLogout: () => void;
}
interface SelectedBiller {
    name: string;
    amount: number;
}


const MainApp: React.FC<MainAppProps> = ({ onLogout }) => {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [bankAccountType, setBankAccountType] = useState<BankAccountType>('us');
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionSummary | null>(null);
  const [selectedBiller, setSelectedBiller] = useState<SelectedBiller | null>(null);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const { userMode, setAuthFlow } = useAppContext();

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
      case 'home':
        return <HomeScreen 
                  onTransactionClick={handleOpenTransactionDetail} 
                  setActiveModal={setActiveModal}
                />;
      case 'analytics':
        return <AnalyticsScreen 
                  onTransactionClick={handleOpenTransactionDetail} 
                />;
      case 'yield':
        return <YieldScreen />;
      case 'bills':
        return userMode === 'INDIA' 
          ? <BillsScreen onPayBiller={handleOpenPayBillModal} />
          : <GlobalPayScreen />;
      case 'profile':
        return <ProfileScreen 
                  setActiveModal={setActiveModal} 
                  openLinkBankModal={handleOpenLinkBankModal} 
                  installPrompt={installPrompt} 
                />;
      default:
        return <HomeScreen 
                  onTransactionClick={handleOpenTransactionDetail} 
                  setActiveModal={setActiveModal}
                />;
    }
  };

  const renderModal = () => {
    const handleClose = () => {
        setActiveModal(null);
        setSelectedTransaction(null);
        setSelectedBiller(null);
    };
    
    const handleGoToKyc = () => {
      handleClose(); 
      setAuthFlow('kycStart');
    };

    switch (activeModal) {
      case 'pay':
        return <PayScreen onClose={handleClose} onGoToKyc={handleGoToKyc} />;
      case 'add_money':
        const addMoneyLinkType: BankAccountType = userMode === 'INTERNATIONAL' ? 'us' : 'inr';
        return <AddMoneyScreen onClose={handleClose} openLinkBankModal={() => handleOpenLinkBankModal(addMoneyLinkType)} onGoToKyc={handleGoToKyc} />;
      case 'withdraw':
        return <WithdrawScreen onClose={handleClose} openLinkBankModal={() => handleOpenLinkBankModal('inr')} onGoToKyc={handleGoToKyc} />;
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
    <div className="relative mx-auto flex h-screen max-w-md flex-col border-x border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl transition-colors duration-300 overflow-hidden font-sans">
      <Header onLogout={onLogout} />
      
      {/* Scrollable content area */}
      <main className="flex-1 overflow-y-auto pb-32 scrollbar-hide bg-white dark:bg-zinc-950">
        {renderContent()}
      </main>

      {/* Fixed bottom container for QR button and Nav */}
      <div className="absolute bottom-0 left-0 right-0 z-50">
        <div className="relative flex justify-center pointer-events-none">
             <button
                onClick={() => setActiveModal('scan_qr')}
                className="pointer-events-auto absolute -top-8 w-16 h-16 rounded-full bg-white dark:bg-zinc-900 flex flex-col items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transform transition-all active:scale-90 hover:scale-105 border-[6px] border-white dark:border-zinc-950 z-50"
                aria-label="Scan QR code"
            >
                 <svg className="w-6 h-6 mb-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h4v4H4V4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M16 4h4v4h-4V4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M4 16h4v4H4v-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M16 16h4v4h-4v-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M10 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M20 12h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                 <span className="text-[9px] font-bold uppercase tracking-wide">Pay</span>
            </button>
        </div>
        <BottomNav activePage={activePage} setActivePage={setActivePage} />
      </div>

      {renderModal()}
    </div>
  );
}

export default MainApp;