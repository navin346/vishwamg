import React, { useState } from 'react';
import VirtualCard from './VirtualCard';
import { mockData } from '../data';
import DepositModal from './DepositModal';
import SendModal from './SendModal';
import WithdrawModal from './WithdrawModal';
import Shopping from './Shopping';
import ReceiveMoney from './ReceiveMoney';
import AddCreditCard from './AddCreditCard';

// Icon Components
const DepositIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

const SwapIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
);

const WithdrawIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const ReceiveIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);

const ShoppingIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V6a4 4 0 118 0v1m-9 4h10l.867 7.804A2 2 0 0115.883 21H8.117a2 2 0 01-1.984-2.196L7 11z" />
    </svg>
);

const CreditCardIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 21z" />
    </svg>
);

const PrimaryActionButton: React.FC<{ label: string; icon: React.ReactNode; colorClasses: string; onClick?: () => void }> = ({ label, icon, colorClasses, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center aspect-square rounded-2xl shadow-lg p-4 text-white font-semibold transform hover:scale-105 transition-transform duration-300 ease-in-out ${colorClasses}`}
    >
        <div className="mb-2">{icon}</div>
        <span>{label}</span>
    </button>
);


type View = 'dashboard' | 'receive' | 'shopping' | 'addCard';

const InternationalDashboard: React.FC = () => {
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [balance, setBalance] = useState(mockData.international.balance);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [areBankDetailsAdded, setAreBankDetailsAdded] = useState(false);
  const [view, setView] = useState<View>('dashboard');

  const { currency, card, walletAddress } = mockData.international;
  
  const parseBalance = (balStr: string) => parseFloat(balStr.replace(/,/g, ''));
  const formatBalance = (num: number) => num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleDepositSuccess = (amount: number) => {
    const currentBalance = parseBalance(balance);
    const newBalance = currentBalance + amount;
    setBalance(formatBalance(newBalance));
    setIsDepositModalOpen(false);
  };

  const handleSendSuccess = (amount: number) => {
    const currentBalance = parseBalance(balance);
    const newBalance = currentBalance - amount;
    setBalance(formatBalance(newBalance));
    setIsSendModalOpen(false);
  };

  const handleWithdrawSuccess = (amount: number) => {
    const currentBalance = parseBalance(balance);
    const newBalance = currentBalance - amount;
    setBalance(formatBalance(newBalance));
    setIsWithdrawModalOpen(false);
  };

  if (view === 'receive') {
    return (
      <ReceiveMoney
        onCancel={() => setView('dashboard')}
        currency={currency}
        accountLabel="Wallet Address"
        accountValue={walletAddress}
      />
    );
  }

  if (view === 'shopping') {
    return <Shopping onCancel={() => setView('dashboard')} />;
  }

  if (view === 'addCard') {
    return <AddCreditCard onCancel={() => setView('dashboard')} />;
  }

  return (
      <>
      <main className="container mx-auto p-4 md:p-8 space-y-10">
        <header className="text-left space-y-3">
          <p className="text-sm uppercase tracking-wide text-slate-400">Global settlement</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">USDC account overview</h1>
          <p className="text-slate-400">Send and receive across borders with the same controls you use in India.</p>
        </header>

        <section className="grid md:grid-cols-[1.1fr,1fr] gap-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-6 flex flex-col space-y-6">
            <div>
              <p className="text-sm text-slate-400">Total Balance</p>
              <p className="text-4xl md:text-5xl font-bold text-white mt-2">
                ${balance}
              </p>
              <p className="text-xs uppercase tracking-wide text-slate-500 mt-1">Held in {currency}</p>
            </div>
            <div>
              <VirtualCard cardData={card} isFlipped={isCardFlipped} />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setIsCardFlipped((prev) => !prev)}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-slate-700 text-slate-200 text-sm hover:bg-slate-600"
                  aria-label={isCardFlipped ? 'Hide card details' : 'Show card details'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2zm8 4h6m-6 3h4m-8-4h.01" />
                  </svg>
                  {isCardFlipped ? 'Hide CVV' : 'Show CVV'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700 rounded-3xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <PrimaryActionButton
                label="Send"
                icon={<SendIcon className="w-10 h-10" />}
                colorClasses="bg-gradient-to-br from-blue-400 to-indigo-500"
                onClick={() => setIsSendModalOpen(true)}
              />
              <PrimaryActionButton
                label="Receive"
                icon={<ReceiveIcon className="w-10 h-10" />}
                colorClasses="bg-gradient-to-br from-green-400 to-teal-500"
                onClick={() => setView('receive')}
              />
              <PrimaryActionButton
                label="Shopping"
                icon={<ShoppingIcon className="w-10 h-10" />}
                colorClasses="bg-gradient-to-br from-purple-400 to-violet-500"
                onClick={() => setView('shopping')}
              />
              <PrimaryActionButton
                label="Add Card"
                icon={<CreditCardIcon className="w-10 h-10" />}
                colorClasses="bg-gradient-to-br from-orange-400 to-red-500"
                onClick={() => setView('addCard')}
              />
            </div>
          </div>
        </section>

        <section className="bg-slate-800/40 border border-slate-700 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Balance tools</h2>
            <span className="text-xs text-slate-500 uppercase tracking-wide">On/Off ramp</span>
          </div>
          <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
            <button
              onClick={() => setIsDepositModalOpen(true)}
              className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-2xl p-4 hover:border-cyan-500 transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-white">Deposit</p>
                <p className="text-xs text-slate-400 mt-1">Bank transfers and cards</p>
              </div>
              <DepositIcon className="w-6 h-6 text-cyan-400" />
            </button>
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-2xl p-4 hover:border-cyan-500 transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-white">Withdraw</p>
                <p className="text-xs text-slate-400 mt-1">Move back to INR</p>
              </div>
              <WithdrawIcon className="w-6 h-6 text-cyan-400" />
            </button>
            <div className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-2xl p-4 opacity-75">
              <div>
                <p className="text-sm font-semibold text-white">Swap</p>
                <p className="text-xs text-slate-400 mt-1">Coming soon</p>
              </div>
              <SwapIcon className="w-6 h-6 text-slate-500" />
            </div>
            <div className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-2xl p-4 opacity-75">
              <div>
                <p className="text-sm font-semibold text-white">Rewards</p>
                <p className="text-xs text-slate-400 mt-1">Earn yield with partners</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.886 0-3.417 1.343-3.417 3 0 1.657 1.531 3 3.417 3s3.417-1.343 3.417-3c0-1.657-1.531-3-3.417-3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364l-1.414-1.414M7.05 7.05 5.636 5.636m12.728 0-1.414 1.414M7.05 16.95l-1.414 1.414" />
              </svg>
            </div>
          </div>
        </section>

      </main>
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onDepositSuccess={handleDepositSuccess}
      />
      <SendModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        onSendSuccess={handleSendSuccess}
      />
       <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onWithdrawSuccess={handleWithdrawSuccess}
        areBankDetailsAdded={areBankDetailsAdded}
        setAreBankDetailsAdded={setAreBankDetailsAdded}
      />
      </>
  );
};

export default InternationalDashboard;