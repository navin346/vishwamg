import React from 'react';

interface ConfirmPaymentProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);


const ConfirmPayment: React.FC<ConfirmPaymentProps> = ({ onConfirm, onCancel }) => {
  // Mock data for the demo
  const mockPaymentData = {
    recipient: 'Khaana Khazana',
    upiId: 'khaanakhazana@okhdfcbank',
    amount: '150.00',
    bank: 'HDFC Bank •••• 8765'
  };

  return (
    <div className="fixed inset-0 bg-slate-900 z-30 flex flex-col">
       {/* Top bar */}
       <header className="p-4 flex items-center">
            <button onClick={onCancel} className="text-white p-2" aria-label="Back">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-white mx-auto">Confirm Payment</h1>
      </header>
      
      <main className="flex-grow flex flex-col justify-between p-6">
        {/* Payment Details */}
        <div className="text-center">
            <div className="bg-slate-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 border-2 border-slate-700">
                <span className="text-3xl font-bold text-cyan-400">KK</span>
            </div>
            <p className="text-2xl font-bold text-white">{mockPaymentData.recipient}</p>
            <p className="text-slate-400">{mockPaymentData.upiId}</p>

            <div className="my-10">
                <p className="text-6xl font-bold text-white">
                    <span className="text-4xl align-top mr-1">₹</span>
                    {mockPaymentData.amount}
                </p>
            </div>
        </div>

        {/* Confirmation Area */}
        <div className="space-y-4">
            <div className="bg-slate-800 p-4 rounded-lg text-left">
                <p className="text-sm text-slate-400">Paying from:</p>
                <p className="font-semibold text-white">{mockPaymentData.bank}</p>
            </div>
            <button 
                onClick={onConfirm}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-colors duration-300"
            >
                Confirm & Pay
            </button>
        </div>
      </main>
    </div>
  );
};

export default ConfirmPayment;