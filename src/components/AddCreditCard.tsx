import React from 'react';

interface AddCreditCardProps {
  onCancel: () => void;
}

const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const AddCreditCard: React.FC<AddCreditCardProps> = ({ onCancel }) => {
  return (
    <div className="fixed inset-0 bg-slate-900 z-30 flex flex-col">
      {/* Top bar */}
      <header className="p-4 flex items-center">
        <button onClick={onCancel} className="text-white p-2" aria-label="Back">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-white mx-auto">Add Credit Card</h1>
      </header>

      <main className="flex-grow flex flex-col p-6 relative">
        {/* Form UI */}
        <form className="space-y-6 flex flex-col flex-grow" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-slate-400 mb-1">
              Card Number
            </label>
            <input
              id="cardNumber"
              type="text"
              placeholder="•••• •••• •••• ••••"
              disabled
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none disabled:opacity-50"
            />
          </div>
          <div>
            <label htmlFor="cardName" className="block text-sm font-medium text-slate-400 mb-1">
              Name on Card
            </label>
            <input
              id="cardName"
              type="text"
              placeholder="J. Doe"
              disabled
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none disabled:opacity-50"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiry" className="block text-sm font-medium text-slate-400 mb-1">
                Expiry Date
              </label>
              <input
                id="expiry"
                type="text"
                placeholder="MM / YY"
                disabled
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none disabled:opacity-50"
              />
            </div>
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-slate-400 mb-1">
                CVV
              </label>
              <input
                id="cvv"
                type="text"
                placeholder="•••"
                disabled
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none disabled:opacity-50"
              />
            </div>
          </div>
          <div className="flex-grow"></div>
          <div className="pb-4">
            <button
              type="button"
              disabled
              className="w-full bg-cyan-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-colors duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              Link Card
            </button>
          </div>
        </form>

        {/* "Coming Soon" Overlay */}
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
           <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-300 font-semibold py-3 px-6 rounded-lg shadow-lg">
                <p className="text-2xl">🚀</p>
                <p className="text-xl font-bold mt-2">Coming Soon!</p>
                <p className="text-sm text-yellow-400 mt-1">This feature is on our roadmap.</p>
           </div>
        </div>
      </main>
    </div>
  );
};

export default AddCreditCard;
