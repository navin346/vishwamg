import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import mockData from '../data/mock-data.json';
import VirtualCard from '../components/VirtualCard';
import { ActiveModal, ActivePage } from '../MainApp';
import mockTransactionsUsd from '../data/mock-transactions-usd.json';
import mockTransactionsInr from '../data/mock-transactions-inr.json';
import { TransactionSummary } from '../data';

interface HomeScreenProps {
    setActivePage: (page: ActivePage) => void;
    setActiveModal: (modal: ActiveModal) => void;
    onTransactionClick: (transaction: TransactionSummary) => void;
}

const CategoryIcon: React.FC<{ category: string }> = ({ category }) => {
    let icon;
    switch (category.toLowerCase()) {
        case 'food': icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>; break;
        case 'shopping': icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>; break;
        case 'travel': icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>; break;
        case 'entertainment': icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 012-2h3a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" /></svg>; break;
        case 'bills': icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>; break;
        default: icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>; break;
    }
    return <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-gray-600 dark:text-slate-300">{icon}</div>;
};


const HomeScreen: React.FC<HomeScreenProps> = ({ setActivePage, setActiveModal, onTransactionClick }) => {
    const { userMode, balance, kycStatus } = useAppContext();
    const isInternational = userMode === 'INTERNATIONAL';
    const currency = isInternational ? mockData.international.currency : 'INR';
    const isCardActive = isInternational && kycStatus === 'verified';
    const [filter, setFilter] = useState('all');

    const { transactions, currencySymbol } = userMode === 'INTERNATIONAL'
        ? { transactions: mockTransactionsUsd.transactions, currencySymbol: '$' }
        : { transactions: mockTransactionsInr.transactions, currencySymbol: '₹' };
    
    // This is a mock filter. In a real app, you would filter by date.
    const filteredTransactions = transactions.slice(0, filter === 'today' ? 2 : transactions.length);

    return (
        <div className="p-4 space-y-6">
            {/* Balance Card */}
            <div className="relative rounded-xl p-6 text-white shadow-xl overflow-hidden">
                 <div className="absolute inset-0 aurora-gradient"></div>
                 <div className="relative z-10">
                    <div className="flex justify-between items-start">
                        <p className="text-sm text-indigo-200">Your Balance</p>
                        <button onClick={() => setActiveModal('scan_qr')} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-2 px-3 rounded-full flex items-center gap-2 text-sm transition-colors transform active:scale-95 -mt-1">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 7V3H7" />
                                <path d="M17 3H21V7" />
                                <path d="M21 17V21H17" />
                                <path d="M7 21H3V17" />
                            </svg>
                            Scan & Pay
                        </button>
                    </div>
                    <p className="text-5xl font-bold tracking-tight mt-2">
                        {isInternational ? '$' : '₹'}{balance} <span className="text-xl font-medium text-indigo-300/80">{currency}</span>
                    </p>
                </div>
            </div>

            {/* Mode-specific display */}
            {isInternational ? (
                <VirtualCard card={mockData.international.card} disabled={!isCardActive} />
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => setActiveModal('scan_qr')}
                        className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl p-4 flex flex-col items-center justify-center text-center aspect-square transition-transform transform active:scale-95 shadow-lg shadow-violet-500/30"
                    >
                        <svg className="w-10 h-10 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 7V3H7" />
                            <path d="M17 3H21V7" />
                            <path d="M21 17V21H17" />
                            <path d="M7 21H3V17" />
                        </svg>
                        <span className="font-bold">Scan & Pay</span>
                        <span className="text-xs text-violet-200 mt-1">Pay any UPI QR</span>
                    </button>
                    <button 
                        onClick={() => setActiveModal('bills')}
                        className="bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-xl p-4 flex flex-col items-center justify-center text-center aspect-square transition-colors hover:bg-gray-100 dark:hover:bg-neutral-700 active:scale-95 transform shadow-lg dark:shadow-black/20"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mb-2 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="font-bold">Pay Bills</span>
                        <span className="text-xs text-gray-500 dark:text-neutral-400 mt-1">Recharge & Utilities</span>
                    </button>
                </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-2 text-center">
                <QuickAction icon={<AddMoneyIcon />} label="Add Money" onClick={() => setActiveModal('add_money')} />
                <QuickAction icon={<SendIcon />} label="Send" onClick={() => setActiveModal('send')} />
                <QuickAction icon={<WithdrawIcon />} label="Withdraw" onClick={() => setActiveModal('withdraw')} />
                <QuickAction icon={<BillsIcon />} label="Bills" onClick={() => setActiveModal('bills')} />
            </div>

            {/* Recent Activity */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
                    <div className="flex items-center gap-2 text-sm">
                        <FilterButton label="All" value="all" activeFilter={filter} setFilter={setFilter} />
                        <FilterButton label="Today" value="today" activeFilter={filter} setFilter={setFilter} />
                    </div>
                </div>
                <div className="space-y-2">
                    {filteredTransactions.map(tx => (
                        <button key={tx.id} onClick={() => onTransactionClick(tx)} className="w-full text-left bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm p-3 rounded-lg flex items-center justify-between hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors">
                            <div className="flex items-center gap-4">
                                <CategoryIcon category={tx.category} />
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{tx.merchant}</p>
                                    <p className="text-sm text-gray-500 dark:text-neutral-400">{tx.method} &bull; {tx.timestamp}</p>
                                </div>
                            </div>
                            <p className="font-bold text-gray-900 dark:text-white">
                                {currencySymbol}{tx.amount.toFixed(2)}
                            </p>
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
};

const QuickAction: React.FC<{ icon: React.ReactNode; label: string, onClick?: () => void }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center group p-2">
        <div className="w-14 h-14 bg-gray-100/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl mb-2 group-hover:bg-gray-200 dark:group-hover:bg-neutral-700 transition-all transform group-active:scale-90">
            {icon}
        </div>
        <span className="text-xs font-medium text-gray-600 dark:text-neutral-300">{label}</span>
    </button>
);

const FilterButton: React.FC<{label: string, value: string, activeFilter: string, setFilter: (f: string) => void}> = ({ label, value, activeFilter, setFilter }) => (
    <button 
        onClick={() => setFilter(value)}
        className={`px-3 py-1 rounded-full font-semibold ${activeFilter === value ? 'bg-violet-600 text-white' : 'bg-gray-200 dark:bg-neutral-800 text-gray-800 dark:text-white'}`}
    >
        {label}
    </button>
);


// SVG Icons
const AddMoneyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>;
const WithdrawIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>;
const BillsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;


export default HomeScreen;