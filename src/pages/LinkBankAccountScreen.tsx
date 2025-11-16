import React, { useState } from 'react';
import { useAppContext } from '@/src/context/AppContext';
import { BankAccountType } from '@/src/MainApp';

interface ModalProps {
    onClose: () => void;
    type: BankAccountType;
}

const LinkBankAccountScreen: React.FC<ModalProps> = ({ onClose, type }) => {
    const { linkAccount } = useAppContext();
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [routingNumber, setRoutingNumber] = useState('');

    const isUs = type === 'us';

    const handleSubmit = () => {
        if (bankName && accountNumber && routingNumber) {
            linkAccount(type, { bankName, accountNumber, routingNumber });
            onClose();
        } else {
            alert('Please fill all fields');
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-2xl p-6 shadow-xl animate-slide-up">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Link {isUs ? 'US' : 'Indian'} Bank Account
                    </h2>
                    <button onClick={onClose} className="text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="bankName" className="text-sm font-medium text-gray-700 dark:text-neutral-300">Bank Name</label>
                        <input id="bankName" type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder={isUs ? 'e.g. Bank of America' : 'e.g. HDFC Bank'} className="w-full mt-1 px-3 py-2 bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500 text-gray-900 dark:text-white" />
                    </div>
                     <div>
                        <label htmlFor="accountNumber" className="text-sm font-medium text-gray-700 dark:text-neutral-300">Account Number</label>
                        <input id="accountNumber" type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Enter account number" className="w-full mt-1 px-3 py-2 bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500 text-gray-900 dark:text-white" />
                    </div>
                     <div>
                        <label htmlFor="routingNumber" className="text-sm font-medium text-gray-700 dark:text-neutral-300">{isUs ? 'Routing Number' : 'IFSC Code'}</label>
                        <input id="routingNumber" type="text" value={routingNumber} onChange={(e) => setRoutingNumber(e.target.value)} placeholder={isUs ? 'Enter 9-digit routing number' : 'Enter 11-character IFSC'} className="w-full mt-1 px-3 py-2 bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500 text-gray-900 dark:text-white" />
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full mt-6 bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform active:scale-95"
                >
                    Link Account
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

export default LinkBankAccountScreen;