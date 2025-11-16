import React, { useState } from 'react';
import { useAppContext } from '@/src/context/AppContext';

interface ModalProps {
    onClose: () => void;
    openLinkBankModal: () => void;
    onGoToKyc: () => void;
}

const AddMoneyScreen: React.FC<ModalProps> = ({ onClose, openLinkBankModal, onGoToKyc }) => {
    const { userMode, linkedAccounts, kycStatus, addMoney } = useAppContext();
    const isInternational = userMode === 'INTERNATIONAL';
    
    const account = isInternational ? linkedAccounts.us : linkedAccounts.inr;
    const isAccountLinked = !!account;

    const currency = isInternational ? 'USD' : 'INR';
    const currencySymbol = isInternational ? '$' : '₹';
    const accountTypeText = isInternational ? 'US bank account' : 'Indian bank account';

    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGoToLinkBank = () => {
        onClose();
        openLinkBankModal();
    };
    
    const handleAddMoney = async () => {
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        setLoading(true);
        try {
            await addMoney(parsedAmount);
            onClose(); // Close modal on success
        } catch (error) {
            console.error("Failed to add money:", error);
            alert("There was an error adding funds. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // If KYC is not verified, show the prompt first.
    if (kycStatus !== 'verified') {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center animate-fade-in">
                <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-2xl p-6 shadow-xl animate-slide-up">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Verification Required</h2>
                        <button onClick={onClose} className="text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className="text-center py-4">
                         <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Complete Your Setup</h3>
                         <p className="text-sm text-gray-500 dark:text-neutral-400 mb-6">To add money, please verify your identity (KYC) first.</p>
                         <button onClick={onGoToKyc} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform active:scale-95">
                            Start KYC
                         </button>
                    </div>
                </div>
            </div>
        )
    }

    // --- Normal Flow (KYC Verified) ---

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-2xl p-6 shadow-xl animate-slide-up">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Money</h2>
                    <button onClick={onClose} className="text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {isAccountLinked ? (
                    <>
                        <p className="text-sm text-gray-500 dark:text-neutral-400 mb-6">
                            On-ramp funds from your linked {accountTypeText}.
                        </p>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="amount" className="text-sm font-medium text-gray-700 dark:text-neutral-300">Amount ({currency})</label>
                                 <div className="relative mt-1">
                                     <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500">{currencySymbol}</span>
                                     <input
                                        id="amount"
                                        type="number"
                                        placeholder={isInternational ? "1,000.00" : "50,000.00"}
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full pl-8 pr-4 py-3 bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>
                             <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">From</label>
                                <div className="mt-1 w-full p-4 bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg">
                                   <p className="font-semibold text-gray-900 dark:text-white">{account?.bankName}</p>
                                   <p className="text-xs text-gray-500 dark:text-neutral-400">
                                       {isInternational ? 'Checking' : 'Savings'} •••• {account?.accountNumber.slice(-4)}
                                   </p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleAddMoney}
                            disabled={loading}
                            className="w-full mt-6 bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform active:scale-95 disabled:bg-violet-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : 'Add Money'}
                        </button>
                    </>
                ) : (
                    <div className="text-center py-4">
                        <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Complete Your Setup</h3>
                        <p className="text-sm text-gray-500 dark:text-neutral-400 mb-6">Please link your {accountTypeText} to add funds.</p>
                        <button
                            onClick={handleGoToLinkBank}
                            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform active:scale-95"
                        >
                            Link Account
                        </button>
                    </div>
                )}
            </div>
            <style>{`
                @keyframes slide-up {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out forwards;
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default AddMoneyScreen;
