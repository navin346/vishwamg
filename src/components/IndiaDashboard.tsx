import React, { useState } from 'react';
import { mockData } from '../data';
import SendMoney from './SendMoney';
import Shopping from './Shopping';
import AddCreditCard from './AddCreditCard';
import ReceiveMoney from './ReceiveMoney';
import VirtualCard from './VirtualCard';

// --- Icon Components ---

const SendMoneyIcon: React.FC<{ className?: string }> = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.826-1.106-2.256 0-3.082C10.544 7.26 11.27 7 12 7c.725 0 1.45.22 2.003.659" />
    </svg>
);

const ReceiveIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);

const ShoppingIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V6a4 4 0 118 0v1m-9 4h10l.867 7.804A2 2 0 0115.883 21H8.117a2 2 0 01-1.984-2.196L7 11z" />
    </svg>
);

const BankIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V3m0 18H3.75M12 21h8.25M12 3H3.75M12 3h8.25M3.75 21V3m16.5 18V3M3.75 12h16.5m-16.5 3.75h16.5M3.75 6.75h16.5" />
    </svg>
);

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const CreditCardIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 21z" />
    </svg>
);


interface ActionButtonProps {
    label: string;
    icon: React.ReactNode;
    colorClasses: string;
    onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ label, icon, colorClasses, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center aspect-square rounded-2xl shadow-lg p-4 text-white font-semibold transform hover:scale-105 transition-transform duration-300 ease-in-out ${colorClasses}`}>
            <div className="mb-2">{icon}</div>
            <span>{label}</span>
        </button>
    )
}

type View = 'dashboard' | 'send' | 'receive' | 'shopping' | 'addCard';


const IndiaDashboard: React.FC = () => {
    const { linkedAccounts, balance, currency, card, upiHandle } = mockData.india;
    const [view, setView] = useState<View>('dashboard');
    const [isCardFlipped, setIsCardFlipped] = useState(false);

    if (view === 'send') {
        return <SendMoney onCancel={() => setView('dashboard')} />;
    }

    if (view === 'receive') {
        return (
            <ReceiveMoney
                onCancel={() => setView('dashboard')}
                currency={currency}
                accountLabel="UPI ID"
                accountValue={upiHandle}
            />
        );
    }

    if (view === 'shopping') {
        return <Shopping onCancel={() => setView('dashboard')} />;
    }

    if (view === 'addCard') {
        return <AddCreditCard onCancel={() => setView('dashboard')} />;
    }


    return (
        <main className="container mx-auto p-4 md:p-8 space-y-10">
            <header className="text-left space-y-3">
                <p className="text-sm uppercase tracking-wide text-slate-400">Multi-currency wallet</p>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Welcome back, Aditi</h1>
                <p className="text-slate-400">Your balances and cards stay consistent across India and international modes.</p>
            </header>

            <section className="grid md:grid-cols-[1.1fr,1fr] gap-8">
                <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-6 flex flex-col space-y-6">
                    <div>
                        <p className="text-sm text-slate-400">Total Balance</p>
                        <p className="text-4xl md:text-5xl font-bold text-white mt-2">₹{balance}</p>
                        <p className="text-xs uppercase tracking-wide text-slate-500 mt-1">Settled in {currency}</p>
                    </div>
                    <div>
                        <VirtualCard cardData={card} isFlipped={isCardFlipped} />
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setIsCardFlipped((prev) => !prev)}
                                className="inline-flex items-center px-4 py-2 rounded-lg bg-slate-700 text-slate-200 text-sm hover:bg-slate-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2zm8 4h6m-6 3h4m-8-4h.01" />
                                </svg>
                                {isCardFlipped ? 'Hide CVV' : 'Show CVV'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/40 border border-slate-700 rounded-3xl p-6 space-y-6">
                    <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <ActionButton
                            label="Send"
                            icon={<SendMoneyIcon className="w-10 h-10" />}
                            colorClasses="bg-gradient-to-br from-blue-400 to-indigo-500"
                            onClick={() => setView('send')}
                        />
                        <ActionButton
                            label="Receive"
                            icon={<ReceiveIcon className="w-10 h-10" />}
                            colorClasses="bg-gradient-to-br from-green-400 to-teal-500"
                            onClick={() => setView('receive')}
                        />
                        <ActionButton
                            label="Shopping"
                            icon={<ShoppingIcon className="w-10 h-10" />}
                            colorClasses="bg-gradient-to-br from-purple-400 to-violet-500"
                            onClick={() => setView('shopping')}
                        />
                        <ActionButton
                            label="Add Card"
                            icon={<CreditCardIcon className="w-10 h-10" />}
                            colorClasses="bg-gradient-to-br from-orange-400 to-red-500"
                            onClick={() => setView('addCard')}
                        />
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Linked Accounts</h2>
                    <button className="text-sm text-cyan-400 hover:text-cyan-300">Manage</button>
                </div>
                <div className="space-y-3">
                    {linkedAccounts.map((account, index) => (
                        <div key={index} className="bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-700">
                            <div className="flex items-center space-x-4">
                                <div className="bg-slate-700 p-3 rounded-full">
                                    <BankIcon className="w-6 h-6 text-cyan-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white">{account.bankName}</p>
                                    <p className="text-sm text-slate-400">Account ending in {account.accountNumberMask}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="grid grid-cols-2 gap-3">
                        <button className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold py-3 px-2 rounded-xl shadow-lg transition-colors duration-300 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900">
                            <PlusIcon className="w-5 h-5" />
                            <span className="text-sm">Add Bank</span>
                        </button>
                        <button
                            onClick={() => setView('addCard')}
                            className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold py-3 px-2 rounded-xl shadow-lg transition-colors duration-300 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                        >
                            <CreditCardIcon className="w-5 h-5" />
                            <span className="text-sm">Add Credit Card</span>
                        </button>
                    </div>
                </div>
            </section>

        </main>
    );
};

export default IndiaDashboard;