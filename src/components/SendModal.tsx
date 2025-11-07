import React, { useState, useEffect } from 'react';

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


interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendSuccess: (amount: number) => void;
}

const SendModal: React.FC<SendModalProps> = ({ isOpen, onClose, onSendSuccess }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Reset state when modal is closed
    if (!isOpen) {
      setRecipient('');
      setAmount('');
      setIsProcessing(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sendAmount = parseFloat(amount);
    if (sendAmount > 0 && recipient) {
      setIsProcessing(true);
      setTimeout(() => {
        onSendSuccess(sendAmount);
      }, 2000); // 2-second success animation
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center p-8 h-80">
             <CheckmarkIcon />
             <p className="text-xl font-bold text-white mt-4">Success!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Send Funds</h2>
                <button type="button" onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Close send modal">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="recipient" className="block text-sm font-medium text-slate-400 mb-1">Phone Number or Email</label>
                  <input
                    id="recipient"
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="name@example.com"
                    required
                    autoFocus
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-slate-400 mb-1">USD Amount</label>
                  <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">$</span>
                      <input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="10.00"
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-8 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-b-xl">
              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-colors duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
                disabled={!recipient || !amount || parseFloat(amount) <= 0}
              >
                Send
              </button>
              <p className="text-xs text-slate-500 text-center mt-4">
                First-time transfers are limited to $10. KYC is required for higher limits.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SendModal;