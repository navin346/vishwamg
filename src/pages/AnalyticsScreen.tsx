import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '@/src/context/AppContext';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/src/firebase';
import PieChart from '@/src/components/charts/PieChart';
import BarChart from '@/src/components/charts/BarChart';
import { TransactionSummary } from '@/src/data';
import { Search, ArrowUpDown, Calendar } from 'lucide-react';

type Timeframe = 'week' | 'month' | 'all';

interface AnalyticsScreenProps {
    onTransactionClick: (transaction: TransactionSummary) => void;
}

const CategoryIcon: React.FC<{ category: string }> = ({ category }) => {
    const styles = "w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm";
    switch (category.toLowerCase()) {
        case 'food': return <div className={`${styles} bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400`}>🍔</div>;
        case 'shopping': return <div className={`${styles} bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400`}>🛍️</div>;
        case 'travel': return <div className={`${styles} bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400`}>🚕</div>;
        case 'entertainment': return <div className={`${styles} bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400`}>🎬</div>;
        case 'bills': return <div className={`${styles} bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400`}>🧾</div>;
        case 'income': return <div className={`${styles} bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400`}>💰</div>;
        default: return <div className={`${styles} bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400`}>💳</div>;
    }
};

const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ onTransactionClick }) => {
    const { user, userMode } = useAppContext();
    const [timeframe, setTimeframe] = useState<Timeframe>('month');
    const [transactions, setTransactions] = useState<TransactionSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

    const isInternational = userMode === 'INTERNATIONAL';
    const currency = isInternational ? '$' : '₹';

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!user || !userMode) return;
            
            setLoading(true);
            try {
                const currencyToFetch = isInternational ? 'USD' : 'INR';
                const txCollection = collection(db, 'users', user.uid, 'transactions');
                // Fetch all then filter client side for search/sort responsiveness in this demo
                const q = query(txCollection, where('currency', '==', currencyToFetch), orderBy('timestamp', 'desc'));
                
                const querySnapshot = await getDocs(q);
                const fetchedTransactions = querySnapshot.docs.map(doc => {
                    const data = doc.data() as any;
                    const jsDate = (data.timestamp as Timestamp).toDate();
                    const date = jsDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    const time = jsDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    return {
                        ...data,
                        id: doc.id,
                        date: date,
                        timestamp: time,
                        rawTimestamp: jsDate // Keep for sorting
                    } as TransactionSummary & { rawTimestamp: Date };
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
        
        let filtered = transactions;

        // 1. Timeframe Filter
        if (timeframe !== 'all') {
            const now = new Date();
            const cutoff = new Date();
            if (timeframe === 'week') cutoff.setDate(now.getDate() - 7);
            if (timeframe === 'month') cutoff.setMonth(now.getMonth() - 1);
            filtered = filtered.filter(tx => (tx as any).rawTimestamp >= cutoff);
        }

        // 2. Search Filter
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(tx => 
                tx.merchant.toLowerCase().includes(q) || 
                tx.category.toLowerCase().includes(q) ||
                tx.amount.toString().includes(q)
            );
        }

        // 3. Sort
        filtered.sort((a, b) => {
            const dateA = (a as any).rawTimestamp.getTime();
            const dateB = (b as any).rawTimestamp.getTime();
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });

        return filtered;
    }, [timeframe, transactions, loading, searchQuery, sortOrder]);

    const { totalSpent, categoryData, barChartData } = useMemo(() => {
        const spentTransactions = filteredTransactions.filter(tx => tx.category.toLowerCase() !== 'income');
        const total = spentTransactions.reduce((sum, tx) => sum + tx.amount, 0);
        
        const categoryMap = new Map<string, number>();
        spentTransactions.forEach(tx => {
            categoryMap.set(tx.category, (categoryMap.get(tx.category) || 0) + tx.amount);
        });
        const pieData = Array.from(categoryMap.entries()).map(([label, value]) => ({ label, value }));

        // Bar data grouped by date
        const dateMap = new Map<string, number>();
        spentTransactions.forEach(tx => {
            const dateKey = tx.date; // e.g. "Oct 24"
            dateMap.set(dateKey, (dateMap.get(dateKey) || 0) + tx.amount);
        });
        // Limit to last 7 active days to keep bar chart clean, reverse for chronological left-to-right
        const barData = Array.from(dateMap.entries())
            .map(([label, value]) => ({ label, value }))
            .slice(0, 7)
            .reverse();

        return { totalSpent: total, categoryData: pieData, barChartData: barData };

    }, [filteredTransactions]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen pb-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
            </div>
        )
    }

    return (
        <div className="p-4 space-y-6 min-h-full">
            {/* Header Area */}
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-end">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Analytics</h1>
                </div>

                {/* Search and Sort Row */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input 
                            type="text" 
                            placeholder="Search transactions..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white/50 dark:bg-black/30 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-gray-900 dark:text-white placeholder-gray-500"
                        />
                    </div>
                    <button 
                        onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                        className="p-2.5 bg-white/50 dark:bg-black/30 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-white/10 active:scale-95 transition-all"
                        aria-label="Sort"
                    >
                        <ArrowUpDown size={18} />
                    </button>
                </div>
            </div>

            {/* Timeframe Selector */}
            <div className="flex w-full bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
                <TimeframeButton label="Week" timeframe="week" active={timeframe} setActive={setTimeframe} />
                <TimeframeButton label="Month" timeframe="month" active={timeframe} setActive={setTimeframe} />
                <TimeframeButton label="All" timeframe="all" active={timeframe} setActive={setTimeframe} />
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl border border-white/40 dark:border-white/5 p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-start mb-4 border-b border-gray-200 dark:border-white/10 pb-2">
                         <div>
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Spent</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{currency}{totalSpent.toFixed(2)}</p>
                         </div>
                         <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                            <Calendar size={20} className="text-violet-600 dark:text-violet-400" />
                         </div>
                    </div>
                    <BarChart data={barChartData} currency={currency} />
                </div>

                <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl border border-white/40 dark:border-white/5 p-6 rounded-2xl shadow-lg">
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6 text-center">Spending Breakdown</h3>
                    <PieChart data={categoryData} currency={currency} />
                </div>
            </div>

             {/* Detailed Transactions List */}
             <div className="pb-6">
                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">History</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-full">{filteredTransactions.length} items</span>
                </div>
                
                <div className="space-y-3">
                    {filteredTransactions.length > 0 ? filteredTransactions.map(tx => (
                        <button 
                            key={tx.id} 
                            onClick={() => onTransactionClick(tx)} 
                            className="group w-full text-left bg-white/70 dark:bg-neutral-900/60 backdrop-blur-md p-3.5 rounded-2xl flex items-center justify-between hover:bg-white dark:hover:bg-neutral-800 hover:shadow-md transition-all duration-200 border border-transparent hover:border-violet-500/20"
                        >
                            <div className="flex items-center gap-4">
                                <CategoryIcon category={tx.category} />
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{tx.merchant}</p>
                                    <p className="text-xs font-medium text-gray-500 dark:text-neutral-400 mt-0.5 flex items-center gap-1">
                                        {tx.category} <span className="w-0.5 h-0.5 bg-gray-400 rounded-full"></span> {tx.date}, {tx.timestamp}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-bold text-sm ${tx.category === 'Income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                                    {tx.category === 'Income' ? '+' : ''}{currency}{tx.amount.toFixed(2)}
                                </p>
                            </div>
                        </button>
                    )) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                                <Search className="text-gray-400" size={24} />
                            </div>
                            <p className="text-gray-900 dark:text-white font-medium">No transactions found</p>
                            <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filter.</p>
                        </div>
                    )}
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
            className={`flex-1 py-1.5 rounded-lg font-semibold text-xs transition-all duration-200 ${
                isActive 
                ? 'bg-white dark:bg-neutral-800 text-violet-700 dark:text-white shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
        >
            {label}
        </button>
    )
}

export default AnalyticsScreen;
