
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/src/context/AppContext';
import { CoreBankingService, BankAccountDetails } from '@/src/services/banking/CoreBankingService';
import { RazorpayService } from '@/src/services/razorpay';
import BankDetailsCard from '@/src/components/BankDetailsCard';
import { Info } from 'lucide-react';

interface ModalProps {
    onClose: () => void;
    openLinkBankModal: () => void;
    onGoToKyc: () => void;
}

const AddMoneyScreen: React.FC<ModalProps> = ({ onClose, openLinkBankModal, onGoToKyc }) => {
    const { userMode, linkedAccounts, kycStatus, addMoney, user, lrsUsage, lrsLimit } = useAppContext();
    const isInternational = userMode === 'INTERNATIONAL';
    
    // For INR Mode
    const currency = 'INR';
    const currencySymbol = '₹';
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    // For USD Mode (Bank Dashboard)
    const [bankDetails, setBankDetails] = useState<BankAccountDetails | null>(null);
    const [loadingBank, setLoadingBank] = useState(false);

    // Fetch International Bank Details
    useEffect(() => {
        if (isInternational && user) {
            setLoadingBank(true);
            CoreBankingService.getAccountDetails(user.uid)
                .then(setBankDetails)
                .finally(() => setLoadingBank(false));
        }
    }, [isInternational, user]);

    // Handle INR Payment via Razorpay
    const handleAddMoneyInr = async () => {
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        setLoading(true);
        
        RazorpayService.openPayment(
            parsedAmount,
            "Add Money to Vishwam Wallet",
            user,
            async (paymentId) => {
                // Payment Success
                try {
                    await addMoney(parsedAmount, 'UPI'); // Record in ledger
                    setLoading(false);
                    onClose();
                } catch (error) {
                    console.error("Ledger update failed:", error);
                    alert("Payment successful but failed to update balance. Contact support.");
                    setLoading(false);
                }
            },
            (error) => {
                // Payment Failure/Cancel
                console.error("Payment failed:", error);
                setLoading(false);
            }
        );
    };

    // KYC Gate
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
                         <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Open Global Account</h3>
                         <p className="text-sm text-gray-500 dark:text-neutral-400 mb-6">Complete KYC to get your GIFT City USD Account.</p>
                         <button onClick={onGoToKyc} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform active:scale-95">
                            Start KYC
                         </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center">
            <div className="w-full max-w-md bg-white dark:bg-[#0A0A0A] rounded-t-2xl p-6 shadow-xl animate-slide-up max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {isInternational ? 'My Global Account' : 'Add Money'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {isInternational ? (
                    // --- INTERNATIONAL MODE: SHOW BANK DETAILS ---
                    <div className="space-y-6">
                         {loadingBank || !bankDetails ? (
                             <div className="p-10 flex justify-center">
                                <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full"></div>
                             </div>
                         ) : (
                            <>
                                <BankDetailsCard details={bankDetails} />

                                {/* LRS Footer */}
                                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex gap-3 items-start border border-amber-100 dark:border-amber-800">
                                    <Info size={16} className="text-amber-600 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-amber-700 dark:text-amber-500">LRS Limit: ${lrsUsage.toLocaleString()} / ${lrsLimit.toLocaleString()}</p>
                                        <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">Funds wired from India are subject to RBI LRS limits.</p>
                                    </div>
                                </div>
                            </>
                         )}
                    </div>
                ) : (
                    // --- INDIA MODE: SHOW RAZORPAY INPUT ---
                    <>
                        {linkedAccounts.inr ? (
                            <>
                                <p className="text-sm text-gray-500 dark:text-neutral-400 mb-6">
                                    Add funds securely via Razorpay (UPI, Card, Netbanking).
                                </p>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="amount" className="text-sm font-medium text-gray-700 dark:text-neutral-300">Amount ({currency})</label>
                                        <div className="relative mt-1">
                                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500">{currencySymbol}</span>
                                            <input
                                                id="amount"
                                                type="number"
                                                placeholder="5,000.00"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="w-full pl-8 pr-4 py-3 bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white font-bold text-lg"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">From</label>
                                        <div className="mt-1 w-full p-4 bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg">
                                        <p className="font-semibold text-gray-900 dark:text-white">{linkedAccounts.inr.bankName}</p>
                                        <p className="text-xs text-gray-500 dark:text-neutral-400">
                                            Savings •••• {linkedAccounts.inr.accountNumber.slice(-4)}
                                        </p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleAddMoneyInr}
                                    disabled={loading}
                                    className="w-full mt-6 bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform active:scale-95 disabled:bg-violet-400 disabled:cursor-not-allowed flex justify-center items-center"
                                >
                                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Proceed to Pay'}
                                </button>
                            </>
                        ) : (
                            <div className="text-center py-4">
                                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Complete Your Setup</h3>
                                <p className="text-sm text-gray-500 dark:text-neutral-400 mb-6">Please link your Indian bank account to add funds.</p>
                                <button
                                    onClick={() => { onClose(); openLinkBankModal(); }}
                                    className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform active:scale-95"
                                >
                                    Link Account
                                </button>
                            </div>
                        )}
                    </>
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
            `}</style>
        </div>
    );
};

export default AddMoneyScreen;
