import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '@/src/context/AppContext';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/src/firebase';
import PieChart from '@/src/components/charts/PieChart';
import BarChart from '@/src/components/charts/BarChart';
import { TransactionSummary } from '@/src/data';
import { 
    Search, ArrowUpDown, Utensils, ShoppingBag, Car, Film, Receipt, Wallet, CreditCard, Filter
} from 'lucide-react';

type Timeframe = 'week' | 'month' | 'all';

interface AnalyticsScreenProps {
    onTransactionClick: (transaction: TransactionSummary) => void;
}

// Mock fallback data
const FALLBACK_TRANSACTIONS: TransactionSummary[] = [
    { id: 'm1', merchant: 'Starbucks', category: 'Food', amount: 5.75, date: 'Oct 28', timestamp: '08:30 AM', method: 'Card' },
    { id: 'm2', merchant: 'Uber', category: 'Travel', amount: 12.50, date: 'Oct 28', timestamp: '09:15 AM', method: 'Card' },
    { id: 'm3', merchant: 'Netflix', category: 'Entertainment', amount: 15.99, date: 'Oct 27', timestamp: '10:00 AM', method: 'Card' },
    { id: 'm4', merchant: 'Whole Foods', category: 'Shopping', amount: 84.20, date: 'Oct 26', timestamp: '06:45 PM', method: 'Card' },
    { id: 'm5', merchant: 'Electric Bill', category: 'Bills', amount: 120.00, date: 'Oct 25', timestamp: '01:00 PM', method: 'Bank' },
    { id: 'm6', merchant: 'Salary', category: 'Income', amount: 2500.00, date: 'Oct 24', timestamp: '09:00 AM', method: 'Transfer' },
    { id: 'm7', merchant: 'Spotify', category: 'Entertainment', amount: 9.99, date: 'Oct 23', timestamp: '11:00 AM', method: 'Card' },
];

const CategoryIcon: React.FC<{ category: string }> = ({ category }) => {
    const baseClass = "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-transform hover:scale-105 border border-transparent dark:border-white/5";
    switch (category.toLowerCase()) {
        case 'food': return <div className={`${baseClass} bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400`}><Utensils size={20} /></div>;
        case 'shopping': return <div className={`${baseClass} bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400`}><ShoppingBag size={20} /></div>;
        case 'travel': return <div className={`${baseClass} bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400`}><Car size={20} /></div>;
        case 'entertainment': return <div className={`${baseClass} bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400`}><Film size={20} /></div>;
        case 'bills': return <div className={`${baseClass} bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400`}><Receipt size={20} /></div>;
        case 'income': return <div className={`${baseClass} bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400`}><Wallet size={20} /></div>;
        default: return <div className={`${baseClass} bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-neutral-400`}><CreditCard size={20} /></div>;
    }
};

const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ onTransactionClick }) => {
    const { user, userMode } = useAppContext();
    const [timeframe, setTimeframe] = useState<Timeframe>('month');
    const [transactions, setTransactions] = useState<TransactionSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);

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
                let fetchedTransactions = querySnapshot.docs.map(doc => {
                    const data = doc.data() as any;
                    const jsDate = (data.timestamp as Timestamp).toDate();
                    return {
                        ...data,
                        id: doc.id,
                        date: jsDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        timestamp: jsDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        rawTimestamp: jsDate
                    } as TransactionSummary & { rawTimestamp: Date };
                });

                if (fetchedTransactions.length === 0) {
                    fetchedTransactions = FALLBACK_TRANSACTIONS.map(t => ({
                        ...t,
                        amount: isInternational ? t.amount : t.amount * 84,
                        currency: isInternational ? 'USD' : 'INR',
                        rawTimestamp: new Date()
                    })) as any;
                }
                setTransactions(fetchedTransactions);
            } catch (error) {
                setTransactions(FALLBACK_TRANSACTIONS as any);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, [user, userMode]);

    const filteredTransactions = useMemo(() => {
        let filtered = [...transactions];

        // Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(tx => tx.merchant.toLowerCase().includes(q) || tx.category.toLowerCase().includes(q));
        }
        // Category Filter
        if (selectedCategoryFilter) {
            filtered = filtered.filter(tx => tx.category === selectedCategoryFilter);
        }

        // Sort
        filtered.sort((a, b) => {
            const dateA = (a as any).rawTimestamp ? (a as any).rawTimestamp.getTime() : 0;
            const dateB = (b as any).rawTimestamp ? (b as any).rawTimestamp.getTime() : 0;
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });

        return filtered;
    }, [transactions, searchQuery, sortOrder, selectedCategoryFilter]);

    const { totalSpent, categoryData, barChartData } = useMemo(() => {
        const spentTransactions = filteredTransactions.filter(tx => tx.category.toLowerCase() !== 'income');
        const total = spentTransactions.reduce((sum, tx) => sum + tx.amount, 0);
        
        const categoryMap = new Map<string, number>();
        spentTransactions.forEach(tx => categoryMap.set(tx.category, (categoryMap.get(tx.category) || 0) + tx.amount));
        const pieData = Array.from(categoryMap.entries()).map(([label, value]) => ({ label, value }));

        const dateMap = new Map<string, number>();
        spentTransactions.forEach(tx => dateMap.set(tx.date, (dateMap.get(tx.date) || 0) + tx.amount));
        const barData = Array.from(dateMap.entries()).map(([label, value]) => ({ label, value })).slice(0, 7).reverse();

        return { totalSpent: total, categoryData: pieData, barChartData: barData };
    }, [filteredTransactions]);

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-black transition-colors duration-300">
            {/* Sticky Header with Premium Glass Effect */}
            <div className="sticky top-0 z-20 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 p-4 space-y-4 transition-colors duration-300">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Analytics</h1>
                    <div className="flex gap-2">
                         <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`p-2 rounded-full transition-all ${isFilterOpen ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400' : 'bg-gray-100 dark:bg-neutral-900 text-gray-600 dark:text-neutral-400 hover:bg-gray-200 dark:hover:bg-neutral-800'}`}>
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                {isFilterOpen && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide animate-in slide-in-from-top-2 fade-in">
                         {['Food', 'Travel', 'Shopping', 'Entertainment', 'Bills'].map(cat => (
                             <button 
                                key={cat}
                                onClick={() => setSelectedCategoryFilter(prev => prev === cat ? null : cat)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${selectedCategoryFilter === cat ? 'bg-black text-white border-black dark:bg-white dark:text-black' : 'bg-white text-gray-600 border-gray-200 dark:bg-neutral-900 dark:text-neutral-400 dark:border-neutral-800'}`}
                             >
                                {cat}
                             </button>
                         ))}
                    </div>
                )}

                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-neutral-500" />
                        <input 
                            type="text" 
                            placeholder="Search transactions..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-gray-100 dark:bg-neutral-900 border-none rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-600 focus:ring-2 focus:ring-indigo-500 transition-colors"
                        />
                    </div>
                </div>
                
                <div className="flex bg-gray-100 dark:bg-neutral-900 p-1 rounded-xl">
                    {(['week', 'month', 'all'] as const).map(t => (
                        <button key={t} onClick={() => setTimeframe(t)} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${timeframe === t ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm' : 'text-gray-500 dark:text-neutral-500 hover:text-gray-900 dark:hover:text-neutral-300'}`}>
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 p-4 space-y-6 overflow-y-auto pb-32">
                {/* Charts Card - Premium Dark Mode: #0A0A0A background with subtle border */}
                <div className="bg-white dark:bg-[#0A0A0A] p-6 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-xl dark:shadow-none">
                    <div className="mb-8">
                         <p className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest">Total Spent</p>
                         <p className="text-4xl font-black text-gray-900 dark:text-white mt-1 tracking-tight">{currency}{totalSpent.toLocaleString()}</p>
                    </div>
                    <BarChart data={barChartData} currency={currency} />
                </div>

                <div className="bg-white dark:bg-[#0A0A0A] p-6 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-xl dark:shadow-none">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-6">Category Breakdown</h3>
                    <PieChart data={categoryData} currency={currency} />
                </div>

                 {/* Transactions List */}
                 <div className="space-y-3">
                    <div className="flex justify-between items-center px-2">
                        <h3 className="text-xs font-bold text-gray-500 dark:text-neutral-500 uppercase tracking-wider">History</h3>
                        <button onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')} className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-lg">
                             Sort <ArrowUpDown size={12} className={`transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                    
                    {filteredTransactions.length > 0 ? filteredTransactions.map((tx, i) => (
                        <button key={tx.id + i} onClick={() => onTransactionClick(tx)} className="w-full bg-white dark:bg-[#0A0A0A] p-4 rounded-2xl flex items-center justify-between border border-gray-100 dark:border-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all group">
                            <div className="flex items-center gap-4">
                                <CategoryIcon category={tx.category} />
                                <div className="text-left">
                                    <p className="font-bold text-gray-900 dark:text-white text-sm">{tx.merchant}</p>
                                    <p className="text-xs text-gray-500 dark:text-neutral-500 mt-0.5">{tx.date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-bold text-sm ${tx.category === 'Income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                                    {tx.category === 'Income' ? '+' : ''}{currency}{tx.amount.toFixed(2)}
                                </p>
                            </div>
                        </button>
                    )) : (
                         <div className="text-center py-10 text-gray-400 dark:text-neutral-600 text-sm">No transactions match your filters.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsScreen;