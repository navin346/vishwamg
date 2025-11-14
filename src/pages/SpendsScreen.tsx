import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import mockTransactionsUsd from '../data/mock-transactions-usd.json';
import mockTransactionsInr from '../data/mock-transactions-inr.json';
import PieChart from '../components/charts/PieChart';
import BarChart from '../components/charts/BarChart';
import { TransactionSummary } from '../data';

type Timeframe = 'week' | 'month' | 'all';

interface SpendsScreenProps {
    onTransactionClick: (transaction: TransactionSummary) => void;
}

const SpendsScreen: React.FC<SpendsScreenProps> = ({ onTransactionClick }) => {
    const { userMode } = useAppContext();
    const [timeframe, setTimeframe] = useState<Timeframe>('month');

    const { transactions, currency } = useMemo(() => ({
        transactions: userMode === 'INTERNATIONAL' ? mockTransactionsUsd.transactions : mockTransactionsInr.transactions,
        currency: userMode === 'INTERNATIONAL' ? '$' : '₹'
    }), [userMode]);

    // In a real app, date filtering would be more robust.
    // This is a simplified version for mock data.
    const filteredTransactions = useMemo(() => {
        // Since mock data dates are just "Oct 28", we can't do real filtering.
        // We'll just show different slices of the data for demonstration.
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

    return (
        <div className="p-4 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-black dark:text-white">Spends</h1>
            </div>
            
            {/* Timeframe Selector */}
            <div className="flex w-full bg-slate-100 dark:bg-neutral-800 rounded-lg p-1 text-sm">
                <TimeframeButton label="This Week" timeframe="week" active={timeframe} setActive={setTimeframe} />
                <TimeframeButton label="This Month" timeframe="month" active={timeframe} setActive={setTimeframe} />
                <TimeframeButton label="All Time" timeframe="all" active={timeframe} setActive={setTimeframe} />
            </div>

            {/* Total Spent */}
            <div className="text-center">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Spent</p>
                <p className="text-4xl font-bold text-black dark:text-white tracking-tight">{currency}{totalSpent.toFixed(2)}</p>
            </div>
            
            {/* Charts */}
            <div className="space-y-6">
                <div className="bg-slate-50 dark:bg-neutral-900 p-4 rounded-xl">
                    <h3 className="font-bold mb-4 text-black dark:text-white">By Category</h3>
                    <PieChart data={categoryData} currency={currency} />
                </div>
                 <div className="bg-slate-50 dark:bg-neutral-900 p-4 rounded-xl">
                    <h3 className="font-bold mb-4 text-black dark:text-white">Daily Spend</h3>
                     <BarChart data={barChartData} currency={currency} />
                </div>
            </div>

             {/* Transactions List */}
             <div>
                <h3 className="font-bold text-lg mb-2 text-black dark:text-white">Transactions</h3>
                <div className="space-y-2">
                    {filteredTransactions.map(tx => (
                        <button key={tx.id} onClick={() => onTransactionClick(tx)} className="w-full text-left bg-white dark:bg-neutral-900/50 p-3 rounded-lg flex items-center justify-between hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
                            <div>
                                <p className="font-semibold text-black dark:text-white">{tx.merchant}</p>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">{tx.category} • {tx.date}</p>
                            </div>
                            <p className="font-semibold text-sm text-black dark:text-white">
                                {currency}{tx.amount.toFixed(2)}
                            </p>
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
};

const TimeframeButton: React.FC<{label: string, timeframe: Timeframe, active: Timeframe, setActive: (tf: Timeframe) => void}> = ({ label, timeframe, active, setActive}) => {
    const isActive = timeframe === active;
    return (
        <button 
            onClick={() => setActive(timeframe)}
            className={`w-1/3 py-1.5 rounded-md font-semibold transition-colors ${isActive ? 'bg-white dark:bg-neutral-700 text-black dark:text-white' : 'text-neutral-500'}`}
        >
            {label}
        </button>
    )
}

export default SpendsScreen;