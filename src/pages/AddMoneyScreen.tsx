
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/src/context/AppContext';
import { CoreBankingService, BankAccountDetails } from '@/src/services/banking/CoreBankingService';
import { Copy, Share2, FileText, Info } from 'lucide-react';
import { triggerHaptic } from '@/src/utils/haptics';

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

    useEffect(() => {
        if (isInternational && user) {
            setLoadingBank(true);
            CoreBankingService.getAccountDetails(user.uid)
                .then(setBankDetails)
                .finally(() => setLoadingBank(false));
        }
    }, [isInternational, user]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        triggerHaptic('light');
    };

    const handleAddMoneyInr = async () => {
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        setLoading(true);
        try {
            await addMoney(parsedAmount, 'UPI');
            onClose(); 
        } catch (error) {
            console.error("Failed to add money:", error);
            alert("There was an error adding funds.");
        } finally {
            setLoading(false);
        }
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
                    // --- GLOBAL ACCOUNT DASHBOARD ---
                    <div className="space-y-6">
                         {loadingBank || !bankDetails ? (
                             <div className="p-10 flex justify-center">
                                <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full"></div>
                             </div>
                         ) : (
                            <>
                                {/* Bank Card Header */}
                                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Bank Name</p>
                                                <p className="font-bold text-lg">{bankDetails.bankName}</p>
                                                <p className="text-sm text-slate-300">{bankDetails.branchName}</p>
                                            </div>
                                            <div className="bg-white/10 p-2 rounded-lg">
                                                <Share2 size={18} />
                                            </div>
                                        </div>
                                        
                                        <div className="mt-6">
                                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Beneficiary</p>
                                            <p className="font-medium">{bankDetails.accountName}</p>
                                        </div>
                                    </div>
                                    {/* Decor */}
                                    <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                                </div>

                                {/* Account Details List */}
                                <div className="space-y-4">
                                    <div className="bg-gray-50 dark:bg-neutral-900 rounded-xl p-4 flex justify-between items-center border border-gray-100 dark:border-neutral-800">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold">Account Number</p>
                                            <p className="font-mono text-lg font-bold text-gray-900 dark:text-white mt-1">{bankDetails.accountNumber}</p>
                                        </div>
                                        <button onClick={() => handleCopy(bankDetails.accountNumber)} className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-lg text-violet-600 font-bold text-xs flex items-center gap-1">
                                            <Copy size={14} /> Copy
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 dark:bg-neutral-900 rounded-xl p-4 border border-gray-100 dark:border-neutral-800">
                                            <p className="text-xs text-gray-500 uppercase font-bold">SWIFT Code</p>
                                            <div className="flex justify-between items-end mt-1">
                                                <p className="font-mono font-bold text-gray-900 dark:text-white">{bankDetails.swiftCode}</p>
                                                <button onClick={() => handleCopy(bankDetails.swiftCode)}><Copy size={14} className="text-gray-400" /></button>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-neutral-900 rounded-xl p-4 border border-gray-100 dark:border-neutral-800">
                                            <p className="text-xs text-gray-500 uppercase font-bold">IFSC Code</p>
                                            <div className="flex justify-between items-end mt-1">
                                                <p className="font-mono font-bold text-gray-900 dark:text-white">{bankDetails.ifscCode}</p>
                                                <button onClick={() => handleCopy(bankDetails.ifscCode)}><Copy size={14} className="text-gray-400" /></button>
                                            </div>
                                        </div>
                                    </div>

                                    {bankDetails.routingNumber && (
                                        <div className="bg-gray-50 dark:bg-neutral-900 rounded-xl p-4 border border-gray-100 dark:border-neutral-800">
                                            <p className="text-xs text-gray-500 uppercase font-bold">Correspondent Routing (US)</p>
                                            <div className="flex justify-between items-end mt-1">
                                                <p className="font-mono font-bold text-gray-900 dark:text-white">{bankDetails.routingNumber}</p>
                                                <button onClick={() => handleCopy(bankDetails.routingNumber)}><Copy size={14} className="text-gray-400" /></button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Actions */}
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                     <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 dark:border-neutral-800 font-bold text-sm text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-800">
                                        <FileText size={18} /> Statement
                                     </button>
                                     <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black font-bold text-sm hover:opacity-90">
                                        Share Details
                                     </button>
                                </div>

                                {/* LRS Footer */}
                                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex gap-3 items-start">
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
                    // --- INR / UPI FLOW ---
                    <>
                        {linkedAccounts.inr ? (
                            <>
                                <p className="text-sm text-gray-500 dark:text-neutral-400 mb-6">
                                    Add funds instantly via UPI or Netbanking.
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
                                                className="w-full pl-8 pr-4 py-3 bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white"
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
                                    className="w-full mt-6 bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform active:scale-95 disabled:bg-violet-400 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Processing...' : 'Add Money'}
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
