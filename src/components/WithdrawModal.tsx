import React, { useState, useEffect } from 'react';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdrawSuccess: (amount: number) => void;
  areBankDetailsAdded: boolean;
  setAreBankDetailsAdded: (value: boolean) => void;
}

type Step = 'options' | 'addBank' | 'enterAmount' | 'processing';

// Re-using the CheckmarkIcon for success animation
const CheckmarkIcon: React.FC = () => (
    <svg className="w-24 h-24 text-green-400" viewBox="0 0 52 52">
        <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
        <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        <style>{`
        .checkmark__circle {
            stroke-dasharray: 166;
            stroke-dashoffset: 166;
            stroke-width: 2;
            stroke-miterlimit: 10;
            stroke: #4ade80;
            fill: none;
            animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        .checkmark__check {
            transform-origin: 50% 50%;
            stroke-dasharray: 48;
            stroke-dashoffset: 48;
            animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }
        @keyframes stroke {
            100% {
                stroke-dashoffset: 0;
            }
        }
        `}</style>
    </svg>
);

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose, onWithdrawSuccess, areBankDetailsAdded, setAreBankDetailsAdded }) => {
  const [step, setStep] = useState<Step>('options');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('options');
        setAmount('');
      }, 300);
    }
  }, [isOpen]);
  
  useEffect(() => {
    if(isOpen) {
        setStep(areBankDetailsAdded ? 'enterAmount' : 'options');
    }
  }, [isOpen, areBankDetailsAdded]);

  const handleOptionClick = () => {
    setStep('addBank');
  };
  
  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setAreBankDetailsAdded(true);
    setStep('enterAmount');
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount > 0) {
      setStep('processing');
      setTimeout(() => {
        onWithdrawSuccess(withdrawAmount);
      }, 2000); // 2-second success animation
    }
  };
  
  const getTitle = () => {
      switch(step) {
        case 'options': return 'Withdraw Funds';
        case 'addBank': return 'Add Bank Details';
        case 'enterAmount': return 'Enter Amount';
        case 'processing': return 'Success';
        default: return '';
      }
  }

  const renderContent = () => {
    if (step === 'processing') {
      return (
        <div className="flex flex-col items-center justify-center p-8 h-96">
           <CheckmarkIcon />
           <p className="text-2xl font-bold text-white mt-4">Withdraw Successful!</p>
        </div>
      );
    }

    if (step === 'options') {
        return (
            <div className="p-6">
                <div className="space-y-4">
                    <button onClick={handleOptionClick} className="w-full text-left bg-near-black/50 hover:bg-white/5 p-4 rounded-lg transition-colors border border-white/10">
                        <p className="font-semibold text-white">Withdraw to Bank Account</p>
                        <p className="text-sm text-subtle">Standard transfer (1-3 days)</p>
                    </button>
                    <button onClick={handleOptionClick} className="w-full text-left bg-near-black/50 hover:bg-white/5 p-4 rounded-lg transition-colors border border-white/10">
                        <p className="font-semibold text-white">Withdraw to UPI (India)</p>
                        <p className="text-sm text-subtle">Instant transfer</p>
                    </button>
                </div>
            </div>
        );
    }

    if (step === 'addBank') {
        return (
            <form onSubmit={handleSaveDetails}>
                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="accountHolder" className="block text-sm font-medium text-subtle mb-2">Account Holder Name</label>
                        <input id="accountHolder" type="text" required className="w-full bg-near-black/50 border-2 border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" />
                    </div>
                    <div>
                        <label htmlFor="accountNumber" className="block text-sm font-medium text-subtle mb-2">Account Number</label>
                        <input id="accountNumber" type="text" inputMode="numeric" required className="w-full bg-near-black/50 border-2 border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" />
                    </div>
                    <div>
                        <label htmlFor="routingNumber" className="block text-sm font-medium text-subtle mb-2">Routing Number</label>
                        <input id="routingNumber" type="text" inputMode="numeric" required className="w-full bg-near-black/50 border-2 border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" />
                    </div>
                </div>
                 <div className="bg-black/20 p-6 rounded-b-xl mt-2">
                    <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white font-bold py-4 px-4 rounded-lg shadow-lg">
                        Save Details
                    </button>
                </div>
            </form>
        )
    }

     if (step === 'enterAmount') {
        return (
            <form onSubmit={handleWithdrawSubmit}>
                <div className="p-6">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-subtle text-3xl">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="100.00"
                        required
                        autoFocus
                        className="w-full bg-near-black/50 border-2 border-white/10 rounded-lg py-4 pl-12 pr-4 text-white text-3xl font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      />
                    </div>
                </div>
                 <div className="bg-black/20 p-6 rounded-b-xl mt-2">
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white font-bold py-4 px-4 rounded-lg shadow-lg transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!amount || parseFloat(amount) <= 0}
                    >
                        Withdraw
                    </button>
                </div>
            </form>
        )
    }

    return null;
  };

  return (
    <div className={`fixed inset-0 z-50 flex justify-center items-end md:items-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-modal="true" role="dialog">
      <div className="fixed inset-0 bg-black/70" onClick={onClose}></div>
      <div className={`bg-surface/80 backdrop-blur-xl border border-white/10 rounded-t-2xl md:rounded-2xl shadow-2xl w-full max-w-md transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="relative">
            <div className="p-6 flex justify-between items-center">
                 <h2 className="text-2xl font-bold text-white">{getTitle()}</h2>
                <button type="button" onClick={onClose} className="text-subtle hover:text-white z-10" aria-label="Close withdraw modal">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;