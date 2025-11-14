import React from 'react';

interface ModalProps {
    onClose: () => void;
}

const WithdrawScreen: React.FC<ModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-2xl p-6 shadow-xl animate-slide-up">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-black dark:text-white">Withdraw</h2>
                    <button onClick={onClose} className="text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                 <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                    Off-ramp funds from your wallet to your linked Indian bank account.
                </p>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="amount" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Amount (USDC)</label>
                         <div className="relative mt-1">
                             <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-neutral-500">$</span>
                             <input
                                id="amount"
                                type="number"
                                placeholder="100.00"
                                className="w-full pl-8 pr-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-black dark:text-white"
                            />
                        </div>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">To</label>
                        <div className="mt-1 w-full p-4 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg">
                           <p className="font-semibold text-black dark:text-white">HDFC Bank</p>
                           <p className="text-xs text-neutral-500 dark:text-neutral-400">Savings •••• 8765</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full mt-6 bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform active:scale-95"
                >
                    Withdraw Funds
                </button>
            </div>
            <style>{`
                @keyframes slide-up {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default WithdrawScreen;
