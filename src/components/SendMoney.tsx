import React, { useState } from 'react';

interface SendMoneyProps {
  onCancel: () => void;
}

const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const SendMoney: React.FC<SendMoneyProps> = ({ onCancel }) => {
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const handlePay = () => {
    // Basic validation
    if (!upiId || !amount) {
      alert('Please fill in UPI ID and Amount.');
      return;
    }

    const payeeName = "Vishwam Demo"; // Payee name for the transaction
    
    // Construct the UPI deep link
    const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${encodeURIComponent(amount)}&tn=${encodeURIComponent(note)}&cu=INR`;

    // Create an anchor element and click it to trigger the UPI app
    const a = document.createElement('a');
    a.href = upiUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 bg-slate-900 z-30 flex flex-col">
      {/* Top bar */}
      <header className="p-4 flex items-center">
            <button onClick={onCancel} className="text-white p-2" aria-label="Back">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-white mx-auto">Send Money</h1>
      </header>
      
      <main className="flex-grow flex flex-col p-6">
        <form className="space-y-6 flex flex-col flex-grow" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="upiId" className="block text-sm font-medium text-slate-400 mb-1">
              Recipient's UPI ID
            </label>
            <input
              id="upiId"
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="ceo@okbank"
              required
              autoFocus
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-slate-400 mb-1">
              Amount (INR)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">₹</span>
              <input
                id="amount"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100.00"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-8 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="note" className="block text-sm font-medium text-slate-400 mb-1">
              Note (Optional)
            </label>
            <input
              id="note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Demo"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex-grow"></div>

          <div className="pb-4">
            <button 
              type="button"
              onClick={handlePay}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-colors duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
              disabled={!upiId || !amount || parseFloat(amount) <= 0}
            >
                Pay via UPI App
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default SendMoney;