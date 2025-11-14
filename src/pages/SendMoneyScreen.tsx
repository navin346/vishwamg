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
    const [view, setView] = useState<'input' | 'contacts'>('input');
    const [phone, setPhone] = useState('');

    const handleSelectContact = (contactPhone: string) => {
        setPhone(contactPhone);
        setView('input');
    };

    const InputView = () => (
        <>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                Send to any phone number. If the receiver doesn't have a Vishwam wallet, they'll get an SMS with a link to claim the funds.
            </p>

            <div className="space-y-4">
                <div>
                    <label htmlFor="phone" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Recipient's Phone Number</label>
                    <div className="relative mt-1">
                        <input
                            id="phone"
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-black dark:text-white pr-12"
                        />
                        <button onClick={() => setView('contacts')} className="absolute inset-y-0 right-0 px-3 flex items-center text-neutral-500 hover:text-violet-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </button>
                    </div>
                </div>
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
            </div>

            <button
                onClick={onClose} // In a real app, this would trigger the send logic
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
                    <button key={contact.phone} onClick={() => handleSelectContact(contact.phone)} className="w-full text-left p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <p className="font-semibold text-black dark:text-white">{contact.name}</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">{contact.phone}</p>
                    </button>
                ))}
            </div>
        </div>
    );


    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-2xl p-6 shadow-xl animate-slide-up">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        {view === 'contacts' && (
                             <button onClick={() => setView('input')} className="text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full p-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                             </button>
                        )}
                        <h2 className="text-xl font-bold text-black dark:text-white">{view === 'input' ? 'Send Money' : 'Select Contact'}</h2>
                    </div>
                    <button onClick={onClose} className="text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                {view === 'input' ? <InputView /> : <ContactsView />}

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