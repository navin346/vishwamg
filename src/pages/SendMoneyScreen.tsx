
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/src/context/AppContext';
import { RemittanceService, FxQuote, Beneficiary } from '@/src/services/banking/RemittanceService';
import { ArrowRight, RefreshCw, CheckCircle, User, AlertCircle, ArrowLeft } from 'lucide-react';
import { triggerHaptic } from '@/src/utils/haptics';

interface ModalProps {
    onClose: () => void;
    onGoToKyc: () => void;
}

type Step = 'amount' | 'beneficiary' | 'review' | 'success';

const SendMoneyScreen: React.FC<ModalProps> = ({ onClose, onGoToKyc }) => {
    const { user, kycStatus, balance, linkedAccounts } = useAppContext();
    const [step, setStep] = useState<Step>('amount');
    
    // Amount State
    const [amount, setAmount] = useState<string>('');
    const [quote, setQuote] = useState<FxQuote | null>(null);
    const [loadingQuote, setLoadingQuote] = useState(false);
    
    // Beneficiary State
    const [beneficiary, setBeneficiary] = useState<Beneficiary>({
        name: user?.displayName || 'My India Account',
        accountNumber: linkedAccounts.inr?.accountNumber || '',
        ifsc: '',
        isSelf: true
    });

    // Execute State
    const [processing, setProcessing] = useState(false);

    // Fetch Quote Debounce
    useEffect(() => {
        const val = parseFloat(amount);
        if (!isNaN(val) && val > 0) {
            setLoadingQuote(true);
            const timer = setTimeout(() => {
                RemittanceService.getFxQuote(val).then(q => {
                    setQuote(q);
                    setLoadingQuote(false);
                });
            }, 800);
            return () => clearTimeout(timer);
        } else {
            setQuote(null);
        }
    }, [amount]);

    const handleNext = () => {
        triggerHaptic('light');
        if (step === 'amount' && quote) setStep('beneficiary');
        else if (step === 'beneficiary') setStep('review');
    };

    const handleExecute = async () => {
        if (!user || !quote) return;
        setProcessing(true);
        triggerHaptic('medium');
        try {
            await RemittanceService.executeTransfer(user.uid, quote, beneficiary);
            setStep('success');
            triggerHaptic('success');
        } catch (e) {
            alert("Transfer failed. Please check your balance.");
            console.error(e);
        } finally {
            setProcessing(false);
        }
    };

    // KYC Gate
    if (kycStatus !== 'verified') {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center">
                <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-2xl p-6 shadow-xl animate-slide-up">
                    <div className="text-center py-4">
                         <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Verification Required</h3>
                         <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">International transfers require KYC verification.</p>
                         <button onClick={onGoToKyc} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-4 rounded-lg">Start KYC</button>
                         <button onClick={onClose} className="mt-4 text-sm text-gray-500">Cancel</button>
                    </div>
                </div>
            </div>
        );
    }

    const maxBalance = parseFloat(balance.replace(/,/g, ''));

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end justify-center">
            <div className="w-full max-w-md bg-white dark:bg-[#0A0A0A] rounded-t-3xl p-6 shadow-2xl h-[90vh] flex flex-col animate-slide-up border-t border-gray-100 dark:border-neutral-800">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    {step !== 'amount' && step !== 'success' && (
                        <button onClick={() => setStep(prev => prev === 'review' ? 'beneficiary' : 'amount')} className="p-2 -ml-2 text-gray-500">
                            <ArrowLeft size={24} />
                        </button>
                    )}
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex-1 text-center pr-6">
                        {step === 'amount' ? 'Send to India' : step === 'beneficiary' ? 'Beneficiary' : step === 'review' ? 'Confirm Transfer' : 'Success'}
                    </h2>
                    {step === 'amount' && (
                         <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-full text-gray-500">
                            <ArrowRight size={20} className="rotate-45" />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    
                    {step === 'amount' && (
                        <div className="space-y-6">
                            {/* Input Card */}
                            <div className="bg-gray-50 dark:bg-neutral-900 p-6 rounded-3xl border border-gray-100 dark:border-neutral-800">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">You Send</label>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-3xl font-bold text-gray-900 dark:text-white">$</span>
                                    <input 
                                        type="number" 
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-transparent text-5xl font-bold text-gray-900 dark:text-white focus:outline-none placeholder-gray-200"
                                        autoFocus
                                    />
                                </div>
                                <div className="mt-4 flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Balance: ${balance}</span>
                                    {parseFloat(amount || '0') > maxBalance && <span className="text-xs text-red-500 font-bold">Insufficient Balance</span>}
                                </div>
                            </div>

                            {/* Quote Preview */}
                            <div className="relative">
                                <div className="absolute left-6 -top-3 bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 rounded-full p-1.5 shadow-sm">
                                    {loadingQuote ? <RefreshCw size={16} className="animate-spin text-violet-600" /> : <ArrowRight size={16} className="text-gray-400 rotate-90" />}
                                </div>
                                <div className="border-l-2 border-dashed border-gray-200 dark:border-neutral-800 ml-9 pl-8 py-4 space-y-4">
                                     <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Fees (1%)</span>
                                        <span className="text-gray-900 dark:text-white font-medium">${quote?.fees.toFixed(2) || '0.00'}</span>
                                     </div>
                                     <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Rate</span>
                                        <span className="text-emerald-600 font-bold">1 USD = {quote?.rate.toFixed(2) || '84.50'} INR</span>
                                     </div>
                                </div>
                            </div>

                            <div className="bg-violet-50 dark:bg-violet-900/20 p-6 rounded-3xl border border-violet-100 dark:border-violet-500/20">
                                <label className="text-xs font-bold text-violet-600/60 uppercase tracking-wider">Recipient Gets</label>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-3xl font-bold text-violet-700 dark:text-violet-400">₹</span>
                                    <span className="text-4xl font-bold text-violet-700 dark:text-violet-400">
                                        {quote ? quote.amountOut.toLocaleString() : '0.00'}
                                    </span>
                                </div>
                                <p className="text-xs text-violet-600/60 mt-2 font-medium">⚡️ Instant Delivery</p>
                            </div>
                        </div>
                    )}

                    {step === 'beneficiary' && (
                        <div className="space-y-4">
                            <button 
                                onClick={() => setBeneficiary({ ...beneficiary, isSelf: true, name: user?.displayName || 'My Account', accountNumber: linkedAccounts.inr?.accountNumber || '**** 1234' })}
                                className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${beneficiary.isSelf ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20' : 'border-gray-100 dark:border-neutral-800'}`}
                            >
                                <div className="w-12 h-12 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center">
                                    <User size={24} />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-gray-900 dark:text-white">Myself</p>
                                    <p className="text-sm text-gray-500">Transfer to my linked India account</p>
                                </div>
                                {beneficiary.isSelf && <CheckCircle className="ml-auto text-violet-600" size={24} />}
                            </button>

                            <button 
                                onClick={() => setBeneficiary({ ...beneficiary, isSelf: false, name: '', accountNumber: '' })}
                                className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${!beneficiary.isSelf ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20' : 'border-gray-100 dark:border-neutral-800'}`}
                            >
                                <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                                    <User size={24} />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-gray-900 dark:text-white">Someone Else</p>
                                    <p className="text-sm text-gray-500">Send to another bank account</p>
                                </div>
                                {!beneficiary.isSelf && <CheckCircle className="ml-auto text-violet-600" size={24} />}
                            </button>

                            {!beneficiary.isSelf && (
                                <div className="mt-6 space-y-4 animate-fade-in">
                                    <input 
                                        type="text" 
                                        placeholder="Account Holder Name" 
                                        value={beneficiary.name}
                                        onChange={e => setBeneficiary({...beneficiary, name: e.target.value})}
                                        className="w-full p-4 bg-gray-50 dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800"
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Account Number / UPI ID" 
                                        value={beneficiary.accountNumber}
                                        onChange={e => setBeneficiary({...beneficiary, accountNumber: e.target.value})}
                                        className="w-full p-4 bg-gray-50 dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800"
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="IFSC Code" 
                                        value={beneficiary.ifsc}
                                        onChange={e => setBeneficiary({...beneficiary, ifsc: e.target.value})}
                                        className="w-full p-4 bg-gray-50 dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {step === 'review' && quote && (
                        <div className="space-y-6">
                            <div className="bg-gray-50 dark:bg-neutral-900 p-6 rounded-3xl border border-gray-100 dark:border-neutral-800 text-center">
                                <p className="text-sm text-gray-500 mb-2">You are sending</p>
                                <p className="text-4xl font-bold text-gray-900 dark:text-white">${amount}</p>
                                <div className="my-4 border-b border-gray-200 dark:border-neutral-700 w-1/2 mx-auto"></div>
                                <p className="text-sm text-gray-500 mb-2">They receive</p>
                                <p className="text-4xl font-bold text-violet-600">₹{quote.amountOut.toLocaleString()}</p>
                            </div>

                            <div className="space-y-3">
                                <DetailRow label="Exchange Rate" value={`1 USD = ${quote.rate} INR`} />
                                <DetailRow label="Fees" value={`$${quote.fees.toFixed(2)}`} />
                                <DetailRow label="Total Debit" value={`$${quote.amountIn.toFixed(2)}`} />
                                <div className="pt-2 border-t border-gray-100 dark:border-neutral-800">
                                    <DetailRow label="To" value={beneficiary.name} />
                                    <DetailRow label="Account" value={beneficiary.accountNumber || 'Linked Account'} />
                                </div>
                            </div>

                            <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl flex gap-3 items-start">
                                <AlertCircle size={18} className="text-amber-600 mt-0.5" />
                                <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                                    Transfers are usually instant but can take up to 24 hours depending on the receiving bank.
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 animate-bounce">
                                <CheckCircle size={48} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Transfer Initiated!</h2>
                            <p className="text-gray-500 mb-8">₹{quote?.amountOut.toLocaleString()} is on its way to India.</p>
                            <button onClick={onClose} className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl">Done</button>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                {step !== 'success' && (
                    <div className="pt-4 mt-4 border-t border-gray-100 dark:border-neutral-800">
                        <button
                            onClick={step === 'review' ? handleExecute : handleNext}
                            disabled={!quote || (step === 'amount' && parseFloat(amount) > maxBalance) || processing}
                            className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-gray-300 dark:disabled:bg-neutral-700 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {processing ? 'Processing...' : step === 'review' ? 'Confirm & Send' : 'Continue'}
                            {!processing && <ArrowRight size={20} />}
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
                    animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm">
        <p className="text-gray-500">{label}</p>
        <p className="font-semibold text-gray-900 dark:text-white">{value}</p>
    </div>
);

export default SendMoneyScreen;
