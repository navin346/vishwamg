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
      <Header onLogout={onLogout} onScanClick={() => setActiveModal('scan_qr')} />
      
      {/* Scrollable content area */}
      <main className="flex-1 overflow-y-auto pb-28 scrollbar-hide">
        {renderContent()}
      </main>

      {/* Fixed Bottom Nav */}
      <BottomNav activePage={activePage} setActivePage={setActivePage} />

      {renderModal()}
    </div>
  );
}

export default MainApp;