import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '@/src/context/AppContext';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/src/firebase';
import PieChart from '@/src/components/charts/PieChart';
import BarChart from '@/src/components/charts/BarChart';
import { TransactionSummary } from '@/src/data';
import { 
    Search, ArrowUpDown, Utensils, ShoppingBag, Car, Film, Receipt, Wallet, CreditCard, X
} from 'lucide-react';

type Timeframe = 'week' | 'month' | 'all';

interface AnalyticsScreenProps {
    onTransactionClick: (transaction: TransactionSummary) => void;
}

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
    const baseClass = "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-transform hover:scale-105 border border-transparent";
    const lowerCat = category.toLowerCase();
    
    if (lowerCat.includes('food')) return <div className={`${baseClass} bg-orange-50 text-orange-600`}><Utensils size={20} /></div>;
    if (lowerCat.includes('shop')) return <div className={`${baseClass} bg-blue-50 text-blue-600`}><ShoppingBag size={20} /></div>;
    if (lowerCat.includes('travel') || lowerCat.includes('transport')) return <div className={`${baseClass} bg-yellow-50 text-yellow-600`}><Car size={20} /></div>;
    if (lowerCat.includes('entertain')) return <div className={`${baseClass} bg-purple-50 text-purple-600`}><Film size={20} /></div>;
    if (lowerCat.includes('bill')) return <div className={`${baseClass} bg-red-50 text-red-600`}><Receipt size={20} /></div>;
    if (lowerCat.includes('income')) return <div className={`${baseClass} bg-emerald-50 text-emerald-600`}><Wallet size={20} /></div>;
    
    return <div className={`${baseClass} bg-gray-50 text-gray-600`}><CreditCard size={20} /></div>;
};

const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ onTransactionClick }) => {
    const { user, userMode, categories } = useAppContext(); // Use dynamic categories
    const [timeframe, setTimeframe] = useState<Timeframe>('month');
    const [transactions, setTransactions] = useState<TransactionSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
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
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(tx => tx.merchant.toLowerCase().includes(q) || tx.category.toLowerCase().includes(q));
        }
        if (selectedCategoryFilter) {
            filtered = filtered.filter(tx => tx.category === selectedCategoryFilter);
        }
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
        <div className="flex flex-col h-full bg-transparent">
            {/* Header with Search, Filters and Sort */}
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xl border-b border-gray-100 pb-2 pt-safe-top">
                <div className="px-4 py-3">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Analytics</h1>
                        <button 
                            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')} 
                            className="flex items-center gap-1 text-xs font-bold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-full active:scale-95 transition-transform"
                        >
                             {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'} 
                             <ArrowUpDown size={12} className={`transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    <div className="flex gap-3 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search transactions..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-violet-100 focus:bg-white focus:border-violet-200 transition-all outline-none"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filters - Always Visible Horizontal Scroll */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
                         <button 
                            onClick={() => setSelectedCategoryFilter(null)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${selectedCategoryFilter === null ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
                         >
                            All
                         </button>
                         {categories.map(cat => (
                             <button 
                                key={cat}
                                onClick={() => setSelectedCategoryFilter(prev => prev === cat ? null : cat)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${selectedCategoryFilter === cat ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
                             >
                                {cat}
                             </button>
                         ))}
                    </div>
                </div>
                
                {/* Timeframe Toggle */}
                <div className="px-4">
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        {(['week', 'month', 'all'] as const).map(t => (
                            <button key={t} onClick={() => setTimeframe(t)} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${timeframe === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 p-4 space-y-6 overflow-y-auto pb-32">
                {/* Bar Chart Card */}
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
                    <div className="mb-6">
                         <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Spent</p>
                         <p className="text-4xl font-black text-gray-900 mt-1 tracking-tight">{currency}{totalSpent.toLocaleString()}</p>
                    </div>
                    <BarChart data={barChartData} currency={currency} />
                </div>

                {/* Pie Chart Card */}
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
                    <h3 className="text-sm font-bold text-gray-900 mb-6">Category Breakdown</h3>
                    <PieChart data={categoryData} currency={currency} />
                </div>

                 {/* Transaction List */}
                 <div className="space-y-3">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">History</h3>
                    
                    {filteredTransactions.length > 0 ? filteredTransactions.map((tx, i) => (
                        <button key={tx.id + i} onClick={() => onTransactionClick(tx)} className="w-full bg-white p-4 rounded-2xl flex items-center justify-between border border-gray-50 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:border-gray-200 transition-all active:scale-[0.99]">
                            <div className="flex items-center gap-4">
                                <CategoryIcon category={tx.category} />
                                <div className="text-left">
                                    <p className="font-bold text-gray-900 text-sm line-clamp-1">{tx.merchant}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{tx.date}</p>
                                </div>
                            </div>
                            <div className="text-right min-w-[80px]">
                                <p className={`font-bold text-sm ${tx.category === 'Income' ? 'text-emerald-600' : 'text-gray-900'}`}>
                                    {tx.category === 'Income' ? '+' : ''}{currency}{tx.amount.toFixed(2)}
                                </p>
                            </div>
                        </button>
                    )) : (
                         <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <Search size={32} className="mb-3 opacity-20" />
                            <p className="text-sm font-medium">No transactions found.</p>
                            {selectedCategoryFilter && <button onClick={() => setSelectedCategoryFilter(null)} className="text-xs text-violet-600 font-bold mt-2">Clear Filters</button>}
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsScreen;