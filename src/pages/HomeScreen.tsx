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
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 to-black dark:from-neutral-900 dark:to-black p-6 text-white shadow-2xl shadow-black/20">
                 <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                 <div className="relative z-10">
                    <p className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Total Balance</p>
                    <div className="flex items-baseline gap-1 mt-2">
                        <h1 className="text-5xl font-bold tracking-tight">
                            {currency}{balance}
                        </h1>
                        <span className="text-xl font-medium text-neutral-500">{isInternational ? 'USDC' : 'INR'}</span>
                    </div>
                 </div>
            </div>

            {/* Action Grid */}
            <div className="grid grid-cols-3 gap-4">
                <ActionButton 
                    icon={<ArrowUpRight className="w-6 h-6" />} 
                    label="Send" 
                    onClick={() => handleProtectedAction('pay')} 
                    variant="primary"
                />
                <ActionButton 
                    icon={<Plus className="w-6 h-6" />} 
                    label="Add" 
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
            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <h2 className="text-sm font-bold text-gray-500 dark:text-neutral-400 tracking-wider uppercase">My Cards</h2>
                </div>
                {isInternational ? (
                     <VirtualCard card={mockCard} disabled={!isCardActive} />
                ) : (
                    <button className="w-full h-48 rounded-3xl border-2 border-dashed border-gray-300 dark:border-neutral-800 flex flex-col items-center justify-center text-gray-400 dark:text-neutral-600 hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors group">
                        <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform text-gray-500 dark:text-neutral-400">
                            <Plus className="w-6 h-6" />
                        </div>
                        <span className="font-medium text-sm">Add Card</span>
                    </button>
                )}
            </div>

            {/* Transactions List */}
            <div className="space-y-2">
                <div className="flex justify-between items-end mb-2 px-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
                </div>
                
                {loading ? <p className="text-sm text-gray-500 p-4">Loading...</p> : (
                    <div className="space-y-0 relative">
                        {transactions.length > 0 ? transactions.map((tx, index) => (
                            <button 
                                key={tx.id} 
                                onClick={() => onTransactionClick(tx)} 
                                className={`w-full text-left p-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-neutral-900 rounded-2xl transition-colors`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-neutral-900 flex items-center justify-center text-gray-500 dark:text-neutral-400">
                                        <CreditCard size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">{tx.merchant}</p>
                                        <p className="text-xs text-gray-500 dark:text-neutral-500 font-medium mt-0.5">{tx.category} • {tx.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                     <p className={`font-bold text-sm ${tx.category === 'Income' ? 'text-emerald-600 dark:text-emerald-500' : 'text-gray-900 dark:text-white'}`}>
                                        {tx.category === 'Income' ? '+' : ''}{currency}{tx.amount.toFixed(2)}
                                    </p>
                                </div>
                            </button>
                        )) : <p className="text-sm text-center py-8 text-gray-500">No transactions yet.</p>}
                        
                        {/* Scroll Hint Gradient */}
                        {transactions.length > 5 && (
                            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 dark:from-black to-transparent pointer-events-none"></div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const ActionButton: React.FC<{ icon: React.ReactNode, label: string, onClick?: () => void, variant: 'primary' | 'secondary' }> = ({ icon, label, onClick, variant }) => {
    const baseClasses = "flex flex-col items-center justify-center rounded-3xl h-24 w-full transition-all transform active:scale-95";
    const variantClasses = variant === 'primary' 
        ? "bg-gray-900 dark:bg-white text-white dark:text-black shadow-lg hover:bg-gray-800 dark:hover:bg-gray-200" 
        : "bg-white dark:bg-neutral-900 text-gray-900 dark:text-white border border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800";

    return (
        <button onClick={onClick} className={`${baseClasses} ${variantClasses}`}>
            <div className="mb-1">{icon}</div>
            <span className="text-xs font-bold">{label}</span>
        </button>
    )
}

export default HomeScreen;