import React, { useState } from 'react';
import VirtualCard from './VirtualCard';
import mockData from '../data/mock-data.json';
import DepositModal from './DepositModal';
import SendModal from './SendModal';
import WithdrawModal from './WithdrawModal';

// Icon Components
const DepositIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>);
const SendIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>);
const SwapIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>);
const WithdrawIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>);

// ActionButton component for reuse
const ActionButton: React.FC<{icon: React.ReactNode, label: string, onClick?: () => void}> = ({ icon, label, onClick }) => (
    <div className="flex flex-col items-center space-y-2">
        <button 
            onClick={onClick}
            className="bg-slate-800/70 hover:bg-slate-800 border border-white/10 rounded-full w-16 h-16 flex items-center justify-center transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-[#0D0C22]"
            aria-label={label}
        >
            {icon}
        </button>
        <span className="text-sm font-medium text-slate-300">{label}</span>
    </div>
);


const InternationalDashboard: React.FC = () => {
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [balance, setBalance] = useState(mockData.international.balance);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [areBankDetailsAdded, setAreBankDetailsAdded] = useState(false);

  const { currency, card } = mockData.international;
  
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

  return (
      <>
      <main className="p-4 md:p-6 space-y-8">
        {/* Balance Display */}
        <div className="text-center pt-4">
          <p className="text-lg text-slate-400 mb-1">Total Balance</p>
          <h1 className="text-6xl font-extrabold text-white tracking-tight">
            ${balance}
            <span className="text-4xl text-slate-500 ml-2 font-medium">{currency}</span>
          </h1>
        </div>

        {/* Virtual Card Section */}
        <div className="w-full">
            <VirtualCard cardData={card} isFlipped={isCardFlipped} />
        
            {/* Action Button */}
            <div className="mt-6 flex justify-center">
                <button
                    onClick={() => setIsCardFlipped(!isCardFlipped)}
                    className="bg-slate-800/70 hover:bg-slate-800 border border-white/10 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out flex items-center justify-center"
                    aria-label={isCardFlipped ? "Hide Card Details" : "Show Card Details"}
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    {isCardFlipped ? 'Hide Details' : 'Show Details'}
                </button>
            </div>
        </div>
        
        {/* Core Action Buttons */}
        <div className="w-full mt-4">
          <div className="grid grid-cols-4 gap-4">
            <ActionButton icon={<DepositIcon className="w-7 h-7 text-cyan-400" />} label="Deposit" onClick={() => setIsDepositModalOpen(true)} />
            <ActionButton icon={<SendIcon className="w-7 h-7 text-green-400" />} label="Send" onClick={() => setIsSendModalOpen(true)} />
            <ActionButton icon={<SwapIcon className="w-7 h-7 text-purple-400" />} label="Swap" />
            <ActionButton icon={<WithdrawIcon className="w-7 h-7 text-orange-400" />} label="Withdraw" onClick={() => setIsWithdrawModalOpen(true)} />
          </div>
        </div>

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