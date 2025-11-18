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
import PayBillModal from '@/src/pages/PayBillModal';
import ServicesHub from '@/src/pages/ServicesHub';
import { TransactionSummary } from '@/src/data';
import { useAppContext } from '@/src/context/AppContext';
import { Scan, QrCode } from 'lucide-react';
import { triggerHaptic } from '@/src/utils/haptics';

export type ActivePage = 'home' | 'analytics' | 'services' | 'profile';
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

  const handleScanClick = () => {
      triggerHaptic('medium');
      setActiveModal('scan_qr');
  }

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
      case 'services':
        return <ServicesHub onPayBiller={handleOpenPayBillModal} />;
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
    <div className="relative mx-auto flex h-screen max-w-md flex-col bg-transparent shadow-2xl overflow-hidden font-sans border-x border-gray-200/20 dark:border-neutral-800/50">
      <Header onLogout={onLogout} />
      
      {/* Scrollable content area - Background handled by App.tsx Mesh */}
      <main className="flex-1 overflow-y-auto pb-28 scrollbar-hide">
        {renderContent()}
      </main>

      {/* Fixed bottom container for QR button and Nav */}
      <div className="absolute bottom-0 left-0 right-0 z-50">
        <div className="relative flex justify-center pointer-events-none">
             <button
                onClick={handleScanClick}
                className="pointer-events-auto absolute -top-6 h-14 px-6 rounded-full bg-black dark:bg-white flex items-center gap-2 text-white dark:text-black shadow-[0_8px_30px_rgba(0,0,0,0.3)] shadow-indigo-500/20 transform transition-all active:scale-90 hover:scale-105 border-[4px] border-transparent z-50"
                aria-label="Scan QR code"
            >
                 <QrCode size={20} strokeWidth={2.5} />
                 <span className="font-bold text-sm tracking-wide uppercase">Scan & Pay</span>
            </button>
        </div>
        <BottomNav activePage={activePage} setActivePage={setActivePage} />
      </div>

      {renderModal()}
    </div>
  );
}

export default MainApp;