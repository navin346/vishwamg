import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '@/src/context/AppContext';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/src/firebase';
import PieChart from '@/src/components/charts/PieChart';
import BarChart from '@/src/components/charts/BarChart';
import { TransactionSummary } from '@/src/data';
import VirtualCard from '@/src/components/VirtualCard';
import { ActiveModal } from '@/src/MainApp';

type Timeframe = 'week' | 'month' | 'all';

// Mock card details, as this isn't stored in Firestore for this version
const mockCard = {
  number: "1234 5678 9012 3456",
  name: "J. DOE",
  expiry: "12/28",
  cvv: "123"
};

interface SpendsScreenProps {
    onTransactionClick: (transaction: TransactionSummary) => void;
    setActiveModal: (modal: ActiveModal) => void;
}

const SpendsScreen: React.FC<SpendsScreenProps> = ({ onTransactionClick, setActiveModal }) => {
    const { user, userMode, balance, kycStatus, setAuthFlow } = useAppContext();
    const [timeframe, setTimeframe] = useState<Timeframe>('month');
    const [transactions, setTransactions] = useState<TransactionSummary[]>([]);
    const [loading, setLoading] = useState(true);

    const isInternational = userMode === 'INTERNATIONAL';
    const isCardActive = isInternational && kycStatus === 'verified';
    const currency = isInternational ? '$' : '₹';

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!user || !userMode) return; // <-- Guard against running before userMode is set
            
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
    }, [user, userMode]); // <-- Add userMode to dependency array


    const filteredTransactions = useMemo(() => {
        if (loading) return [];
        switch (timeframe) {
            case 'week': return transactions.slice(0, 2);
            case 'month': return transactions.slice(0, 5);
            case 'all': return transactions;
            default: return transactions;
        }
    }, [timeframe, transactions, loading]);

    const { totalSpent, categoryData, barChartData } = useMemo(() => {
        const total = filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0);
        
        const categoryMap = new Map<string, number>();
        filteredTransactions.forEach(tx => {
            if (tx.category.toLowerCase() !== 'income') { // Exclude income from spending charts
                categoryMap.set(tx.category, (categoryMap.get(tx.category) || 0) + tx.amount);
            }
        });
        const pieData = Array.from(categoryMap.entries()).map(([label, value]) => ({ label, value }));

        const barData = filteredTransactions.filter(tx => tx.category.toLowerCase() !== 'income').map(tx => ({ label: tx.date, value: tx.amount })).reverse();

        return { totalSpent: total, categoryData: pieData, barChartData: barData };

    }, [filteredTransactions]);

    const handleProtectedAction = (modal: ActiveModal) => {
        if (kycStatus !== 'verified') {
            setAuthFlow('kycStart');
        } else {
            setActiveModal(modal);
        }
    };
    
    if (!userMode) {
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
                <VirtualCard card={mockCard} disabled={!isCardActive} />
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2 text-center">
                <QuickAction icon={<AddMoneyIcon />} label="Add Money" onClick={() => handleProtectedAction('add_money')} />
                <QuickAction icon={<PayIcon />} label="Pay" onClick={() => handleProtectedAction('pay')} />
                <QuickAction icon={<WithdrawIcon />} label="Withdraw" onClick={() => handleProtectedAction('withdraw')} />
            </div>

            {/* Timeframe Selector */}
            <div className="flex w-full bg-gray-100/80 dark:bg-neutral-800/80 rounded-lg p-1 text-sm">
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
                <div className="bg-white/80 dark:bg-neutral-900/80 p-4 rounded-xl shadow-sm">
                    <h3 className="font-bold mb-4 text-gray-900 dark:text-white">By Category</h3>
                    <PieChart data={categoryData} currency={currency} />
                </div>
                 <div className="bg-white/80 dark:bg-neutral-900/80 p-4 rounded-xl shadow-sm">
                    <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Daily Spend</h3>
                     <BarChart data={barChartData} currency={currency} />
                </div>
            </div>

             {/* Transactions List */}
             <div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Transactions</h3>
                {loading ? <p className="text-sm text-gray-500">Loading transactions...</p> : (
                <div className="space-y-2">
                    {transactions.length > 0 ? transactions.map(tx => (
                        <button key={tx.id} onClick={() => onTransactionClick(tx)} className="w-full text-left bg-white/50 dark:bg-neutral-900/50 p-3 rounded-lg flex items-center justify-between hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
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
                )}
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