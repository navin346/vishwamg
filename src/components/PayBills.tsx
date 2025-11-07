import React, { useState } from 'react';
import { billersData, type BillerCategory, type BillerDetails } from '../data';

interface PayBillsProps {
    onCancel: () => void;
}

type Step = 'category' | 'biller' | 'fetch' | 'details' | 'success';

const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

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


const PayBills: React.FC<PayBillsProps> = ({ onCancel }) => {
    const [step, setStep] = useState<Step>('category');
    const [selectedCategory, setSelectedCategory] = useState<BillerCategory | null>(null);
    const [selectedBiller, setSelectedBiller] = useState<BillerDetails | null>(null);
    const [customerId, setCustomerId] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    
    // Mock bill details
    const mockBill = {
        dueDate: '30 Oct 2024',
        amount: '1200.00',
    };

    const handleCategorySelect = (category: BillerCategory) => {
        setSelectedCategory(category);
        setStep('biller');
    };

    const handleBillerSelect = (biller: BillerDetails) => {
        setSelectedBiller(biller);
        setStep('fetch');
    };
    
    const handleFetchBill = (e: React.FormEvent) => {
        e.preventDefault();
        if(!customerId) return;
        setIsFetching(true);
        setTimeout(() => {
            setIsFetching(false);
            setStep('details');
        }, 2000); // Simulate network delay
    };
    
    const handlePayBill = () => {
        setIsFetching(true); // Re-use fetching state for payment processing
        setTimeout(() => {
            setIsFetching(false);
            setStep('success');
        }, 1500);
    };

    const resetAndExit = () => {
        setStep('category');
        setSelectedCategory(null);
        setSelectedBiller(null);
        setCustomerId('');
        onCancel();
    };

    const getTitle = () => {
        switch (step) {
            case 'category': return 'Pay Bills';
            case 'biller': return selectedCategory?.name || 'Select Biller';
            case 'fetch': return selectedBiller?.name || 'Fetch Bill';
            case 'details': return 'Bill Details';
            case 'success': return 'Success';
            default: return 'Pay Bills';
        }
    };
    
    const handleBack = () => {
        if (step === 'biller') setStep('category');
        else if (step === 'fetch') setStep('biller');
        else if (step === 'details') setStep('fetch');
        else onCancel();
    };

    return (
        <div className="fixed inset-0 bg-slate-900 z-30 flex flex-col">
            <header className="p-4 flex items-center">
                 <button onClick={handleBack} className="text-white p-2" aria-label="Back">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold text-white mx-auto pr-8">{getTitle()}</h1>
            </header>

            <main className="flex-grow p-6 overflow-y-auto">
                {step === 'category' && (
                    <div className="grid grid-cols-3 gap-4">
                        {billersData.categories.map(cat => (
                            <button key={cat.name} onClick={() => handleCategorySelect(cat)} className="flex flex-col items-center justify-center p-4 bg-slate-800 rounded-lg aspect-square">
                                <span className="text-3xl">{cat.icon}</span>
                                <span className="text-sm mt-2 text-slate-300">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                )}

                {step === 'biller' && selectedCategory && (
                    <div className="space-y-3">
                        {selectedCategory.billers.map(biller => (
                            <button key={biller.name} onClick={() => handleBillerSelect(biller)} className="w-full flex items-center space-x-4 p-4 bg-slate-800 rounded-lg text-left">
                                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-xl font-bold">{biller.logo}</div>
                                <span className="font-semibold text-white">{biller.name}</span>
                            </button>
                        ))}
                    </div>
                )}

                {step === 'fetch' && (
                    <form onSubmit={handleFetchBill}>
                        <p className="text-slate-400 text-center mb-6">Enter your customer ID to fetch your latest bill.</p>
                         <div>
                            <label htmlFor="customerId" className="block text-sm font-medium text-slate-400 mb-1">
                                Customer ID
                            </label>
                            <input
                                id="customerId"
                                type="text"
                                value={customerId}
                                onChange={(e) => setCustomerId(e.target.value)}
                                placeholder="e.g., 123456789"
                                required
                                autoFocus
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>
                        <button type="submit" disabled={isFetching || !customerId} className="w-full mt-8 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg disabled:bg-slate-600">
                             {isFetching ? 'Fetching...' : 'Fetch Bill'}
                        </button>
                    </form>
                )}
                
                {step === 'details' && selectedBiller && (
                    <div className="flex flex-col h-full">
                        <div className="flex-grow text-center">
                             <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">{selectedBiller.logo}</div>
                             <p className="font-semibold text-white text-lg">{selectedBiller.name}</p>
                             <p className="text-sm text-slate-400 mb-8">Customer ID: {customerId}</p>
                             
                             <div className="bg-slate-800 p-4 rounded-lg mb-4">
                                <p className="text-sm text-slate-400">Due Date</p>
                                <p className="text-lg font-semibold text-white">{mockBill.dueDate}</p>
                             </div>
                              <div className="bg-slate-800 p-4 rounded-lg">
                                <p className="text-sm text-slate-400">Amount Due</p>
                                <p className="text-4xl font-bold text-white">₹{mockBill.amount}</p>
                             </div>
                        </div>
                        <button onClick={handlePayBill} disabled={isFetching} className="w-full mt-8 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg disabled:bg-slate-600">
                             {isFetching ? 'Processing...' : `Pay ₹${mockBill.amount}`}
                        </button>
                    </div>
                )}

                {step === 'success' && (
                    <div className="flex flex-col items-center justify-center text-center h-full">
                        <CheckmarkIcon />
                        <h2 className="text-2xl font-bold text-white mt-4">Payment Successful!</h2>
                        <p className="text-slate-400 mt-2">Your bill for {selectedBiller?.name} has been paid.</p>
                        <button onClick={resetAndExit} className="w-full mt-12 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg">
                            Done
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PayBills;
