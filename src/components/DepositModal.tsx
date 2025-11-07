import React, { useState, useEffect } from 'react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDepositSuccess: (amount: number) => void;
}

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


const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onDepositSuccess }) => {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Reset state when modal is closed
    if (!isOpen) {
      setAmount('');
      setIsProcessing(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const depositAmount = parseFloat(amount);
    if (depositAmount > 0) {
      setIsProcessing(true);
      setTimeout(() => {
        onDepositSuccess(depositAmount);
      }, 2000); // 2-second success animation
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center p-8 h-64">
             <CheckmarkIcon />
             <p className="text-xl font-bold text-white mt-4">Success!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Deposit Funds</h2>
                <button type="button" onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Close deposit modal">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
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
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-colors duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
                disabled={!amount || parseFloat(amount) <= 0}
              >
                Pay with US Bank Account
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default DepositModal;