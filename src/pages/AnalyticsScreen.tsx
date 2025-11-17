import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '@/src/context/AppContext';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/src/firebase';
import PieChart from '@/src/components/charts/PieChart';
import BarChart from '@/src/components/charts/BarChart';
import { TransactionSummary } from '@/src/data';

type Timeframe = 'week' | 'month' | 'all';

interface AnalyticsScreenProps {
    onTransactionClick: (transaction: TransactionSummary) => void;
}

const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ onTransactionClick }) => {
    const { user, userMode } = useAppContext();
    const [timeframe, setTimeframe] = useState<Timeframe>('month');
    const [transactions, setTransactions] = useState<TransactionSummary[]>([]);
    const [loading, setLoading] = useState(true);

    const isInternational = userMode === 'INTERNATIONAL';
    const currency = isInternational ? '$' : '₹';

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!user || !userMode) return;
            
            setLoading(true);
            try {
                const currencyToFetch = isInternational ? 'USD' : 'INR';
                const txCollection = collection(db, 'users', user.uid, 'transactions');
                const q = query(txCollection, where('currency', '==', currencyToFetch), orderBy('timestamp', 'desc'));
                
                const querySnapshot = await getDocs(q);
                const fetchedTransactions = querySnapshot.docs.map(doc => {
                    const data = doc.data() as any;
                    const date = (data.timestamp as Timestamp).toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    const time = (data.timestamp as Timestamp).toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    return {
                        ...data,
                        id: doc.id,
                        date: date,
                        timestamp: time,
                    } as TransactionSummary;
                });
                setTransactions(fetchedTransactions);
            } catch (error) {
                console.error("Error fetching transactions: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [user, userMode]);

    const filteredTransactions = useMemo(() => {
        if (loading) return [];
        // This logic is a mock for filtering, in a real app this would be more robust
        const now = new Date();
        return transactions.filter(tx => {
            if (timeframe === 'all') return true;
            // Note: This logic for filtering by date is simplified for this demo
            // and assumes recent mock data. A real app would parse timestamps properly.
            if (timeframe === 'month') return transactions.indexOf(tx) < 10; // Mock month filter
            if (timeframe === 'week') return transactions.indexOf(tx) < 5; // Mock week filter
            return true;
        });
    }, [timeframe, transactions, loading]);

    const { totalSpent, categoryData, barChartData } = useMemo(() => {
        const spentTransactions = filteredTransactions.filter(tx => tx.category.toLowerCase() !== 'income');
        const total = spentTransactions.reduce((sum, tx) => sum + tx.amount, 0);
        
        const categoryMap = new Map<string, number>();
        spentTransactions.forEach(tx => {
            categoryMap.set(tx.category, (categoryMap.get(tx.category) || 0) + tx.amount);
        });
        const pieData = Array.from(categoryMap.entries()).map(([label, value]) => ({ label, value }));

        const barData = spentTransactions.map(tx => ({ label: tx.date, value: tx.amount })).reverse();

        return { totalSpent: total, categoryData: pieData, barChartData: barData };

    }, [filteredTransactions]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <svg className="animate-spin h-8 w-8 text-violet-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        )
    }

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Spending Analytics</h1>

            {/* Timeframe Selector */}
            <div className="flex w-full bg-gray-100/70 dark:bg-neutral-800/70 rounded-lg p-1 text-sm">
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
                <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm p-4 rounded-xl shadow-sm">
                    <h3 className="font-bold mb-4 text-gray-900 dark:text-white">By Category</h3>
                    <PieChart data={categoryData} currency={currency} />
                </div>
                 <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm p-4 rounded-xl shadow-sm">
                    <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Daily Spend</h3>
                     <BarChart data={barChartData} currency={currency} />
                </div>
            </div>

             {/* Transactions List */}
             <div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">All Transactions</h3>
                <div className="space-y-2">
                    {filteredTransactions.length > 0 ? filteredTransactions.map(tx => (
                        <button key={tx.id} onClick={() => onTransactionClick(tx)} className="w-full text-left bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm p-3 rounded-lg flex items-center justify-between hover:bg-gray-100/80 dark:hover:bg-neutral-800/80 transition-colors cursor-pointer">
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">{tx.merchant}</p>
                                <p className="text-xs text-gray-500 dark:text-neutral-400">{tx.category} • {tx.date}</p>
                            </div>
                            <p className={`font-semibold text-sm ${tx.category === 'Income' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                                {tx.category === 'Income' ? '+' : ''}{currency}{tx.amount.toFixed(2)}
                            </p>
                        </button>
                    )) : <p className="text-sm text-center py-4 text-gray-500">No transactions for this period.</p>}
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
            className={`w-1/3 py-1.5 rounded-md font-semibold transition-colors ${isActive ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}
        >
            {label}
        </button>
    )
}

export default AnalyticsScreen;
