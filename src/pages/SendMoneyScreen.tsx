import React, { useState } from 'react';

interface ModalProps {
    onClose: () => void;
}

const mockContacts = [
    { name: 'Alice', phone: '+1 (555) 111-2222' },
    { name: 'Bob', phone: '+1 (555) 333-4444' },
    { name: 'Charlie', phone: '+1 (555) 555-6666' },
    { name: 'Diana', phone: '+1 (555) 777-8888' },
];

const SendMoneyScreen: React.FC<ModalProps> = ({ onClose }) => {
    const [view, setView] = useState<'contacts' | 'input'>('contacts');
    const [selectedContact, setSelectedContact] = useState<{ name: string; phone: string } | null>(null);

    const handleSelectContact = (contact: { name: string; phone: string }) => {
        setSelectedContact(contact);
        setView('input');
    };

    const InputView = () => (
        <>
            <div className="bg-slate-50 dark:bg-neutral-800 p-3 rounded-lg mb-4">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Sending to</p>
                <p className="font-semibold text-black dark:text-white">{selectedContact?.name}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{selectedContact?.phone}</p>
            </div>
            
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
                    <label htmlFor="note" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Note (Optional)</label>
                    <input
                        id="note"
                        type="text"
                        placeholder="e.g., For dinner last night"
                        className="w-full mt-1 px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-black dark:text-white"
                    />
                </div>
            </div>

            <button
                onClick={onClose}
                className="w-full mt-6 bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform active:scale-95"
            >
                Send
            </button>
        </>
    );

    const ContactsView = () => (
        <div>
            <input type="search" placeholder="Search contacts..." className="w-full px-4 py-2 mb-4 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-black dark:text-white" />
            <div className="space-y-2 max-h-64 overflow-y-auto">
                {mockContacts.map(contact => (
                    <button key={contact.phone} onClick={() => handleSelectContact(contact)} className="w-full text-left p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <p className="font-semibold text-black dark:text-white">{contact.name}</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">{contact.phone}</p>
                    </button>
                ))}
            </div>
            <p className="text-center text-xs text-neutral-400 mt-4">Or <button onClick={() => { setSelectedContact({name: 'New Contact', phone: ''}); setView('input')}} className="font-semibold text-violet-500">enter a number manually</button>.</p>
        </div>
    );


    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-2xl p-6 shadow-xl animate-slide-up">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        {view === 'input' && (
                             <button onClick={() => setView('contacts')} className="text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full p-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                             </button>
                        )}
                        <h2 className="text-xl font-bold text-black dark:text-white">{view === 'contacts' ? 'Send To' : 'Send Money'}</h2>
                    </div>
                    <button onClick={onClose} className="text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full p-1">
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
            `}</style>
        </div>
    );
};

export default SendMoneyScreen;