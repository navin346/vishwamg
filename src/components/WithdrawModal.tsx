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
            stroke: #7ac142;
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
      setStep('options');
      setAmount('');
    }
  }, [isOpen]);

  const handleOptionClick = () => {
    if (!areBankDetailsAdded) {
      setStep('addBank');
    } else {
      setStep('enterAmount');
    }
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

  const renderContent = () => {
    if (step === 'processing') {
      return (
        <div className="flex flex-col items-center justify-center p-8 h-80">
           <CheckmarkIcon />
           <p className="text-xl font-bold text-white mt-4">Success!</p>
        </div>
      );
    }

    if (step === 'options') {
        return (
            <div className="p-6">
                <h2 className="text-2xl font-bold text-white text-center mb-6">Withdraw Funds</h2>
                <div className="space-y-4">
                    <button onClick={handleOptionClick} className="w-full text-left bg-slate-700/50 hover:bg-slate-700 p-4 rounded-lg transition-colors">
                        <p className="font-semibold text-white">Withdraw to Bank Account</p>
                        <p className="text-sm text-slate-400">Standard transfer (1-3 days)</p>
                    </button>
                    <button onClick={handleOptionClick} className="w-full text-left bg-slate-700/50 hover:bg-slate-700 p-4 rounded-lg transition-colors">
                        <p className="font-semibold text-white">Withdraw to UPI (India)</p>
                        <p className="text-sm text-slate-400">Instant transfer</p>
                    </button>
                </div>
            </div>
        );
    }

    if (step === 'addBank') {
        return (
            <form onSubmit={handleSaveDetails}>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-4">Add Bank Details</h2>
                    <div className="space-y-4">
                         <div>
                            <label htmlFor="accountHolder" className="block text-sm font-medium text-slate-400 mb-1">Account Holder Name</label>
                            <input id="accountHolder" type="text" required className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        </div>
                        <div>
                            <label htmlFor="accountNumber" className="block text-sm font-medium text-slate-400 mb-1">Account Number</label>
                            <input id="accountNumber" type="text" inputMode="numeric" required className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        </div>
                        <div>
                            <label htmlFor="routingNumber" className="block text-sm font-medium text-slate-400 mb-1">Routing Number</label>
                            <input id="routingNumber" type="text" inputMode="numeric" required className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        </div>
                    </div>
                </div>
                 <div className="bg-slate-900/50 p-6 rounded-b-xl">
                    <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg">
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
                    <h2 className="text-2xl font-bold text-white mb-4">Enter Amount</h2>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 text-2xl">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="100.00"
                        required
                        autoFocus
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-4 pl-10 pr-4 text-white text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                </div>
                 <div className="bg-slate-900/50 p-6 rounded-b-xl">
                    <button
                        type="submit"
                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg disabled:bg-slate-600"
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        <div className="relative">
            <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white z-10" aria-label="Close withdraw modal">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;