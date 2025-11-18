import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/src/context/AppContext';
import { collection, query, where, getDocs, orderBy, Timestamp, limit } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { TransactionSummary } from '@/src/data';
import VirtualCard from '@/src/components/VirtualCard';
import { ActiveModal } from '@/src/MainApp';
import { Plus, ArrowUpRight, Download, CreditCard, ChevronRight } from 'lucide-react';

// Mock card details
const mockCard = {
  number: "1234 5678 9012 3456",
  name: "J. DOE",
  expiry: "12/28",
  cvv: "123"
};

interface HomeScreenProps {
    onTransactionClick: (transaction: TransactionSummary) => void;
    setActiveModal: (modal: ActiveModal) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onTransactionClick, setActiveModal }) => {
    const { user, userMode, balance, kycStatus, setAuthFlow } = useAppContext();
    const [transactions, setTransactions] = useState<TransactionSummary[]>([]);
    const [loading, setLoading] = useState(true);

    const isInternational = userMode === 'INTERNATIONAL';
    const isCardActive = isInternational && kycStatus === 'verified';
    const currency = isInternational ? '$' : '₹';

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!user || !userMode) return;
            
            setLoading(true);
            try {
                const currencyToFetch = isInternational ? 'USD' : 'INR';
                const txCollection = collection(db, 'users', user.uid, 'transactions');
                const q = query(txCollection, where('currency', '==', currencyToFetch), orderBy('timestamp', 'desc'), limit(10));
                
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

        if (user && userMode) {
            fetchTransactions();
        } else {
            setLoading(false);
        }
    }, [user, userMode]);

    const handleProtectedAction = (modal: ActiveModal) => {
        if (kycStatus !== 'verified') {
            setAuthFlow('kycStart');
        } else {
            setActiveModal(modal);
        }
    };
    
    return (
        <div className="p-5 space-y-8 pb-24">
            {/* Balance Header */}
            <div className="space-y-1">
                 <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Balance</p>
                 <div className="flex items-baseline gap-1">
                    <h1 className="text-5xl font-bold text-zinc-900 dark:text-white tracking-tight">
                        {currency}{balance}
                    </h1>
                 </div>
            </div>

            {/* Action Grid */}
            <div className="grid grid-cols-3 gap-3">
                <ActionButton 
                    icon={<ArrowUpRight className="w-6 h-6" />} 
                    label="Send" 
                    onClick={() => handleProtectedAction('pay')} 
                    variant="primary"
                />
                <ActionButton 
                    icon={<Plus className="w-6 h-6" />} 
                    label="Add Money" 
                    onClick={() => handleProtectedAction('add_money')} 
                    variant="secondary"
                />
                 <ActionButton 
                    icon={<Download className="w-6 h-6" />} 
                    label="Withdraw" 
                    onClick={() => handleProtectedAction('withdraw')} 
                    variant="secondary"
                />
            </div>

            {/* Cards Section */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <h2 className="text-sm font-bold text-zinc-500 dark:text-zinc-400 tracking-wider uppercase">My Cards</h2>
                </div>
                {isInternational ? (
                     <VirtualCard card={mockCard} disabled={!isCardActive} />
                ) : (
                    <button className="w-full h-40 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group">
                        <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <Plus className="w-6 h-6 text-zinc-500 dark:text-zinc-400" />
                        </div>
                        <span className="font-medium text-sm">Add Card</span>
                    </button>
                )}
            </div>

            {/* Transactions List */}
            <div className="space-y-2">
                <div className="flex justify-between items-end mb-2">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Recent Transactions</h3>
                </div>
                
                {loading ? <p className="text-sm text-zinc-500 p-4">Loading...</p> : (
                    <div className="space-y-0 relative">
                        {transactions.length > 0 ? transactions.map((tx, index) => (
                            <button 
                                key={tx.id} 
                                onClick={() => onTransactionClick(tx)} 
                                className={`w-full text-left p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors ${index !== transactions.length - 1 ? 'border-b border-zinc-100 dark:border-zinc-800' : ''}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                                        <CreditCard size={18} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">{tx.merchant}</p>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{tx.category} • {tx.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                     <p className={`font-bold text-sm ${tx.category === 'Income' ? 'text-emerald-600 dark:text-emerald-500' : 'text-zinc-900 dark:text-white'}`}>
                                        {tx.category === 'Income' ? '+' : ''}{currency}{tx.amount.toFixed(2)}
                                    </p>
                                </div>
                            </button>
                        )) : <p className="text-sm text-center py-8 text-zinc-500">No transactions yet.</p>}
                        
                        {/* Scroll Hint Gradient */}
                        {transactions.length > 5 && (
                            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-zinc-950 to-transparent pointer-events-none"></div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const ActionButton: React.FC<{ icon: React.ReactNode, label: string, onClick?: () => void, variant: 'primary' | 'secondary' }> = ({ icon, label, onClick, variant }) => {
    const baseClasses = "flex flex-col items-center justify-center rounded-2xl h-24 w-full transition-all transform active:scale-95";
    const variantClasses = variant === 'primary' 
        ? "bg-zinc-900 dark:bg-white text-white dark:text-black shadow-lg hover:bg-zinc-800 dark:hover:bg-zinc-200" 
        : "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800";

    return (
        <button onClick={onClick} className={`${baseClasses} ${variantClasses}`}>
            <div className="mb-2">{icon}</div>
            <span className="text-xs font-bold">{label}</span>
        </button>
    )
}

export default HomeScreen;