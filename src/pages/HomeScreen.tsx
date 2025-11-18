import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/src/context/AppContext';
import { collection, query, where, getDocs, orderBy, Timestamp, limit } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { TransactionSummary } from '@/src/data';
import VirtualCard from '@/src/components/VirtualCard';
import { ActiveModal } from '@/src/MainApp';
import { ArrowDownLeft, ArrowUpRight, Download, CreditCard, Plus, ChevronRight } from 'lucide-react';
import { triggerHaptic } from '@/src/utils/haptics';

// Mock card details
const mockCards = [
  { id: 1, number: "4111 1111 1111 1111", name: "J. DOE", expiry: "12/28", cvv: "123", type: 'visa' },
  { id: 2, number: "5332 4321 8765 4321", name: "J. DOE", expiry: "09/26", cvv: "456", type: 'mastercard' },
];

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
        triggerHaptic('light');
        if (kycStatus !== 'verified') {
            setAuthFlow('kycStart');
        } else {
            setActiveModal(modal);
        }
    };
    
    return (
        <div className="p-5 space-y-8 pb-24">
            {/* Balance Header */}
            <div className="relative overflow-hidden rounded-[2rem] bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 p-6 shadow-2xl">
                 <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500 rounded-full blur-[60px] opacity-20 -mr-10 -mt-10"></div>
                 <div className="relative z-10">
                    <div className="flex justify-between items-start">
                        <p className="text-xs font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-widest">Total Balance</p>
                        <div className="bg-green-500/20 px-2 py-1 rounded-md">
                             <span className="text-xs font-bold text-green-700 dark:text-green-400">▲ 2.4%</span>
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1 mt-2">
                        <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {currency}{balance}
                        </h1>
                        <span className="text-xl font-medium text-gray-500 dark:text-neutral-400">{isInternational ? 'USDC' : 'INR'}</span>
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
                    icon={<ArrowDownLeft className="w-6 h-6" />} 
                    label="Deposit" 
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

            {/* Cards Section - Carousel */}
            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <h2 className="text-xs font-bold text-gray-500 dark:text-neutral-400 tracking-widest uppercase">My Cards</h2>
                    <button className="text-indigo-600 dark:text-indigo-400 text-xs font-bold">Manage</button>
                </div>
                {isInternational ? (
                    <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide">
                         {/* Card 1 */}
                         <div className="min-w-[85%] snap-center">
                             <VirtualCard card={mockCards[0]} disabled={!isCardActive} />
                         </div>
                         {/* Card 2 (Placeholder) */}
                         <div className="min-w-[85%] snap-center opacity-90">
                             <div className="relative w-full aspect-[1.586] bg-gradient-to-br from-gray-800 to-black rounded-xl p-6 text-white border border-white/10 flex flex-col justify-between">
                                 <div className="flex justify-between">
                                     <span className="text-xs font-mono">Metal</span>
                                     <span className="text-xs font-bold italic">VISA</span>
                                 </div>
                                 <div className="text-center">
                                     <p className="text-xs text-gray-400">Tap to activate</p>
                                     <p className="text-lg font-mono tracking-widest mt-1">•••• •••• •••• 4321</p>
                                 </div>
                             </div>
                         </div>
                         {/* Add Card Button */}
                         <div className="min-w-[20%] snap-center flex items-center">
                            <button className="w-14 h-14 rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center mx-auto">
                                <Plus className="text-gray-500" />
                            </button>
                         </div>
                    </div>
                ) : (
                    <button className="w-full h-48 rounded-3xl border-2 border-dashed border-gray-300 dark:border-neutral-800 flex flex-col items-center justify-center text-gray-400 dark:text-neutral-600 hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors group bg-white/50 dark:bg-black/50 backdrop-blur-sm">
                        <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform text-gray-500 dark:text-neutral-400">
                            <Plus className="w-6 h-6" />
                        </div>
                        <span className="font-medium text-sm text-gray-900 dark:text-gray-300">Order Physical Card</span>
                    </button>
                )}
            </div>

            {/* Transactions List */}
            <div className="space-y-2">
                <div className="flex justify-between items-end mb-2 px-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                </div>
                
                {loading ? (
                    // Skeleton Loader
                    [1,2,3].map(i => (
                        <div key={i} className="w-full h-16 bg-gray-200 dark:bg-neutral-800 rounded-2xl animate-pulse" />
                    ))
                ) : (
                    <div className="space-y-2 relative">
                        {transactions.length > 0 ? transactions.map((tx, index) => (
                            <button 
                                key={tx.id} 
                                onClick={() => onTransactionClick(tx)} 
                                className={`w-full text-left p-4 flex items-center justify-between bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md border border-gray-100 dark:border-neutral-800 rounded-2xl transition-all hover:scale-[1.02]`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-gray-500 dark:text-neutral-400">
                                        <CreditCard size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">{tx.merchant}</p>
                                        <p className="text-xs text-gray-500 dark:text-neutral-400 font-medium mt-0.5">{tx.category} • {tx.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                     <p className={`font-bold text-sm ${tx.category === 'Income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                                        {tx.category === 'Income' ? '+' : ''}{currency}{tx.amount.toFixed(2)}
                                    </p>
                                </div>
                            </button>
                        )) : <p className="text-sm text-center py-8 text-gray-500 dark:text-neutral-500">No recent activity.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

const ActionButton: React.FC<{ icon: React.ReactNode, label: string, onClick?: () => void, variant: 'primary' | 'secondary' }> = ({ icon, label, onClick, variant }) => {
    const baseClasses = "flex flex-col items-center justify-center rounded-[1.5rem] h-24 w-full transition-all transform active:scale-95 backdrop-blur-md";
    
    // Updated variants for high contrast in dark mode
    const variantClasses = variant === 'primary' 
        ? "bg-black text-white dark:bg-white dark:text-black shadow-xl shadow-indigo-500/20" 
        : "bg-white/70 dark:bg-neutral-900/70 text-gray-900 dark:text-white border border-gray-200 dark:border-neutral-800 shadow-sm";

    return (
        <button onClick={onClick} className={`${baseClasses} ${variantClasses}`}>
            <div className="mb-1">{icon}</div>
            <span className="text-xs font-bold">{label}</span>
        </button>
    )
}

export default HomeScreen;