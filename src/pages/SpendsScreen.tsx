import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import mockTransactionsUsd from '../data/mock-transactions-usd.json';
import mockTransactionsInr from '../data/mock-transactions-inr.json';
import PieChart from '../components/charts/PieChart';
import BarChart from '../components/charts/BarChart';
import { TransactionSummary } from '../data';
import mockData from '../data/mock-data.json';
import VirtualCard from '../components/VirtualCard';
import { ActiveModal } from '../MainApp';

type Timeframe = 'week' | 'month' | 'all';

interface SpendsScreenProps {
    onTransactionClick: (transaction: TransactionSummary) => void;
    setActiveModal: (modal: ActiveModal) => void;
}

const SpendsScreen: React.FC<SpendsScreenProps> = ({ onTransactionClick, setActiveModal }) => {
    const { userMode, balance, kycStatus, setAuthStep } = useAppContext();
    const [timeframe, setTimeframe] = useState<Timeframe>('month');

    const isInternational = userMode === 'INTERNATIONAL';
    const isCardActive = isInternational && kycStatus === 'verified';

    const { transactions, currency } = useMemo(() => ({
        transactions: isInternational ? mockTransactionsUsd.transactions : mockTransactionsInr.transactions,
        currency: isInternational ? '$' : '₹'
    }), [userMode, isInternational]);

    // This is a simplified version for mock data.
    const filteredTransactions = useMemo(() => {
        switch (timeframe) {
            case 'week': return transactions.slice(0, 2);
            case 'month': return transactions.slice(0, 5);
            case 'all': return transactions;
            default: return transactions;
        }
    }, [timeframe, transactions]);

    const { totalSpent, categoryData, barChartData } = useMemo(() => {
        const total = filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0);
        
        const categoryMap = new Map<string, number>();
        filteredTransactions.forEach(tx => {
            categoryMap.set(tx.category, (categoryMap.get(tx.category) || 0) + tx.amount);
        });
        const pieData = Array.from(categoryMap.entries()).map(([label, value]) => ({ label, value }));

        const barData = filteredTransactions.map(tx => ({ label: tx.date, value: tx.amount })).reverse();

        return { totalSpent: total, categoryData: pieData, barChartData: barData };

    }, [filteredTransactions]);

    // KYC Check handler for protected actions
    const handleProtectedAction = (modal: ActiveModal) => {
        if (kycStatus !== 'verified') {
            setAuthStep('kycStart');
        } else {
            setActiveModal(modal);
        }
    };


    return (
        <div className="p-4 space-y-6">
            
            {/* Balance Card */}
            <div className="relative rounded-xl p-6 text-white shadow-xl overflow-hidden">
                 <div className="absolute inset-0 aurora-gradient"></div>
                 <div className="relative z-10">
                    <div className="flex justify-between items-start">
                        <p className="text-sm text-indigo-200">Your Balance</p>
                    </div>
                    <p className="text-5xl font-bold tracking-tight mt-2">
                        {currency}{balance} <span className="text-xl font-medium text-indigo-300/80">{isInternational ? 'USDC' : 'INR'}</span>
                    </p>
                </div>
            </div>

            {/* International Virtual Card */}
            {isInternational && (
                <VirtualCard card={mockData.international.card} disabled={!isCardActive} />
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2 text-center">
                <QuickAction icon={<AddMoneyIcon />} label="Add Money" onClick={() => handleProtectedAction('add_money')} />
                <QuickAction icon={<PayIcon />} label="Pay" onClick={() => handleProtectedAction('pay')} />
                <QuickAction icon={<WithdrawIcon />} label="Withdraw" onClick={() => handleProtectedAction('withdraw')} />
            </div>

            {/* Timeframe Selector */}
            <div className="flex w-full bg-gray-100 dark:bg-neutral-800 rounded-lg p-1 text-sm">
                <TimeframeButton label="This Week" timeframe="week" active={timeframe} setActive={setTimeframe} />
                <TimeframeButton label="This Month" timeframe="month" active={timeframe} setActive={setTimeframe} />
                <TimeframeButton label="All Time" timeframe="all" active={timeframe} setActive={setTimeframe} />
            </div>

            {/* Total Spent */}
            <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-neutral-400">Total Spent</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">{currency}{totalSpent.toFixed(2)}</p>
            </div>
            
            {/* Charts */}
            <div className="space-y-6">
                <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl shadow-sm">
                    <h3 className="font-bold mb-4 text-gray-900 dark:text-white">By Category</h3>
                    <PieChart data={categoryData} currency={currency} />
                </div>
                 <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl shadow-sm">
                    <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Daily Spend</h3>
                     <BarChart data={barChartData} currency={currency} />
                </div>
            </div>

             {/* Transactions List */}
             <div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Transactions</h3>
                <div className="space-y-2">
                    {filteredTransactions.map(tx => (
                        <button key={tx.id} onClick={() => onTransactionClick(tx)} className="w-full text-left bg-white dark:bg-neutral-900/50 p-3 rounded-lg flex items-center justify-between hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">{tx.merchant}</p>
                                <p className="text-xs text-gray-500 dark:text-neutral-400">{tx.category} • {tx.date}</p>
                            </div>
                            <p className="font-semibold text-sm text-gray-900 dark:text-white">
                                {currency}{tx.amount.toFixed(2)}
                            </p>
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
};

// --- Child Components ---

const TimeframeButton: React.FC<{label: string, timeframe: Timeframe, active: Timeframe, setActive: (tf: Timeframe) => void}> = ({ label, timeframe, active, setActive}) => {
    const isActive = timeframe === active;
    return (
        <button 
            onClick={() => setActive(timeframe)}
            className={`w-1/3 py-1.5 rounded-md font-semibold transition-colors ${isActive ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-white' : 'text-gray-500'}`}
        >
            {label}
        </button>
    )
}

const QuickAction: React.FC<{ icon: React.ReactNode; label: string, onClick?: () => void }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center group p-2">
        <div className="w-14 h-14 bg-gray-100/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl mb-2 group-hover:bg-gray-200 dark:group-hover:bg-neutral-700 transition-all transform group-active:scale-90">
            {icon}
        </div>
        <span className="text-xs font-medium text-gray-600 dark:text-neutral-300">{label}</span>
    </button>
);

// SVG Icons
const AddMoneyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>;
const PayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>;
const WithdrawIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>;


export default SpendsScreen;
