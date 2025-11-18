import React, { useState } from 'react';
import { useAppContext } from '@/src/context/AppContext';

interface ModalProps {
    onClose: () => void;
    onGoToKyc: () => void;
}

const mockContacts = [
    { name: 'Alice', phone: '+1 (555) 111-2222' },
    { name: 'Bob', phone: '+1 (555) 333-4444' },
    { name: 'Charlie', phone: '+1 (555) 555-6666' },
    { name: 'Diana', phone: '+1 (555) 777-8888' },
];

const PayScreen: React.FC<ModalProps> = ({ onClose, onGoToKyc }) => {
    const { kycStatus, userMode } = useAppContext();
    const isIndiaMode = userMode === 'INDIA';
    const [view, setView] = useState<'contacts' | 'input'>('contacts');
    const [selectedContact, setSelectedContact] = useState<{ name: string; phone: string } | null>(null);

    const handleSelectContact = (contact: { name: string; phone: string }) => {
        setSelectedContact(contact);
        setView('input');
    };
    
    // If KYC is not verified, show the prompt.
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
                         <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">To pay contacts, please verify your identity (KYC) first.</p>
                         <button onClick={onGoToKyc} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform active:scale-95">
                            Start KYC
                         </button>
                    </div>
                </div>
            </div>
        )
    }

    // --- Normal Flow (KYC Verified) ---

    const InputView = () => (
        <>
            <div className="bg-gray-100 dark:bg-neutral-800 p-3 rounded-lg mb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">Paying</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selectedContact?.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedContact?.phone}</p>
            </div>
            
            <div className="space-y-4">
                <div>
                    <label htmlFor="amount" className="text-sm font-medium text-gray-700 dark:text-gray-200">Amount ({isIndiaMode ? 'INR' : 'USDC'})</label>
                    <div className="relative mt-1">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500">{isIndiaMode ? '₹' : '$'}</span>
                            <input
                            id="amount"
                            type="number"
                            placeholder={isIndiaMode ? "500.00" : "100.00"}
                            className="w-full pl-8 pr-4 py-3 bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white"
                        />
                    </div>
                </div>
                 <div>
                    <label htmlFor="note" className="text-sm font-medium text-gray-700 dark:text-gray-200">Note (Optional)</label>
                    <input
                        id="note"
                        type="text"
                        placeholder="e.g., For dinner last night"
                        className="w-full mt-1 px-4 py-3 bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white"
                    />
                </div>
            </div>

            <button
                onClick={onClose}
                className="w-full mt-6 bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform active:scale-95"
            >
                Pay
            </button>
        </>
    );

    const ContactsView = () => (
        <div>
            <input type="search" placeholder={isIndiaMode ? "Search by UPI ID or Phone..." : "Search contacts..."} className="w-full px-4 py-2 mb-4 bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white" />
            <div className="space-y-2 max-h-64 overflow-y-auto">
                {mockContacts.map(contact => (
                    <button key={contact.phone} onClick={() => handleSelectContact(contact)} className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                        <p className="font-semibold text-gray-900 dark:text-white">{contact.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-300">{contact.phone}</p>
                    </button>
                ))}
            </div>
            <p className="text-center text-xs text-gray-400 mt-4">Or <button onClick={() => { setSelectedContact({name: 'New Contact', phone: ''}); setView('input')}} className="font-semibold text-violet-500">enter a number manually</button>.</p>
        </div>
    );


    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-2xl p-6 shadow-xl animate-slide-up">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        {view === 'input' && (
                             <button onClick={() => setView('contacts')} className="text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full p-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                             </button>
                        )}
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{view === 'contacts' ? (isIndiaMode ? 'Pay with UPI' : 'Pay To') : (isIndiaMode ? 'Confirm UPI Payment' : 'Pay Contact')}</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                {view === 'contacts' ? <ContactsView /> : <InputView />}

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

export default PayScreen;