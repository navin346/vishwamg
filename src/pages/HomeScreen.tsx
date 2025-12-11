
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/src/context/AppContext';
import { collection, query, where, getDocs, orderBy, Timestamp, limit } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { TransactionSummary } from '@/src/data';
import VirtualCard from '@/src/components/VirtualCard';
import { ActiveModal } from '@/src/MainApp';
import { ArrowDownLeft, ArrowUpRight, Download, CreditCard, Plus, Sparkles } from 'lucide-react';
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

    const handleProtectedAction = (actionType: 'pay' | 'add' | 'withdraw') => {
        triggerHaptic('light');
        if (kycStatus !== 'verified') {
            setAuthFlow('kycStart');
            return;
        }

        if (actionType === 'pay') {
            // Smart Routing: International -> SendMoneyScreen (Remittance), India -> PayScreen (UPI)
            if (isInternational) {
                setActiveModal('send_international');
            } else {
                setActiveModal('pay');
            }
        } else if (actionType === 'add') {
            setActiveModal('add_money');
        } else if (actionType === 'withdraw') {
            setActiveModal('withdraw');
        }
    };
    
    return (
        <div className="p-5 space-y-8 pb-24">
            {/* Aave-inspired Balance Card: Clean white with subtle border/gradient */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                 {/* Decorative ambient gradient */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-violet-50 to-transparent rounded-full -mr-16 -mt-16 opacity-60 pointer-events-none"></div>
                 
                 <div className="relative z-10">
                    <div className="flex justify-between items-center mb-4">
                         <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                            <Sparkles size={12} className="text-violet-600" />
                            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Total Balance</span>
                         </div>
                        <div className="bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                             <span className="text-xs font-bold text-emerald-700">▲ 2.4%</span>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-[3.5rem] leading-none font-bold tracking-tighter text-gray-900">
                            {currency}{balance}
                        </h1>
                        <span className="text-lg font-medium text-gray-400 mt-2 ml-1">{isInternational ? 'USDC' : 'INR'}</span>
                    </div>
                 </div>
            </div>

            {/* Action Grid */}
            <div className="grid grid-cols-3 gap-4">
                <ActionButton 
                    icon={<ArrowUpRight className="w-6 h-6 text-white" />} 
                    label="Send" 
                    onClick={() => handleProtectedAction('pay')} 
                    variant="primary"
                />
                <ActionButton 
                    icon={<ArrowDownLeft className="w-6 h-6" />} 
                    label="Deposit" 
                    onClick={() => handleProtectedAction('add')} 
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
                    <h2 className="text-xs font-bold text-gray-500 tracking-widest uppercase">My Cards</h2>
                    <button className="text-violet-600 text-xs font-bold hover:bg-violet-50 px-2 py-1 rounded-md transition-colors">Manage</button>
                </div>
                {isInternational ? (
                    <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide">
                         {/* Card 1 */}
                         <div className="min-w-[85%] snap-center">
                             <VirtualCard card={mockCards[0]} disabled={!isCardActive} />
                         </div>
                         {/* Card 2 (Placeholder) */}
                         <div className="min-w-[85%] snap-center opacity-90">
                             <div className="relative w-full aspect-[1.586] bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 text-white border border-gray-200 flex flex-col justify-between shadow-xl">
                                 <div className="flex justify-between">
                                     <span className="text-xs font-mono text-gray-400">Metal</span>
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
                            <button className="w-14 h-14 rounded-full bg-white border-2 border-dashed border-gray-300 flex items-center justify-center mx-auto shadow-sm">
                                <Plus className="text-gray-400" />
                            </button>
                         </div>
                    </div>
                ) : (
                    <button className="w-full h-40 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col items-center justify-center group transition-all active:scale-98">
                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3 text-gray-400 group-hover:bg-violet-50 group-hover:text-violet-600 transition-colors">
                            <Plus className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-sm text-gray-900">Order Physical Card</span>
                        <span className="text-xs text-gray-400 mt-1">Free for premium members</span>
                    </button>
                )}
            </div>

            {/* Transactions List */}
            <div className="space-y-3">
                <div className="flex justify-between items-end mb-2 px-1">
                    <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                    <button className="text-xs font-bold text-gray-400 hover:text-gray-600">View All</button>
                </div>
                
                {loading ? (
                    // Skeleton Loader
                    [1,2,3].map(i => (
                        <div key={i} className="w-full h-20 bg-white rounded-2xl animate-pulse shadow-sm border border-gray-50" />
                    ))
                ) : (
                    <div className="space-y-3">
                        {transactions.length > 0 ? transactions.map((tx, index) => (
                            <button 
                                key={tx.id} 
                                onClick={() => onTransactionClick(tx)} 
                                className="w-full text-left p-4 flex items-center justify-between bg-white rounded-[1.25rem] border border-gray-50 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 border border-gray-100">
                                        <CreditCard size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-base">{tx.merchant}</p>
                                        <p className="text-xs text-gray-500 font-medium mt-0.5">{tx.category} • {tx.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                     <p className={`font-bold text-base ${tx.category === 'Income' ? 'text-emerald-600' : 'text-gray-900'}`}>
                                        {tx.category === 'Income' ? '+' : ''}{currency}{tx.amount.toFixed(2)}
                                    </p>
                                </div>
                            </button>
                        )) : <p className="text-sm text-center py-8 text-gray-400">No recent activity.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

const ActionButton: React.FC<{ icon: React.ReactNode, label: string, onClick?: () => void, variant: 'primary' | 'secondary' }> = ({ icon, label, onClick, variant }) => {
    const baseClasses = "flex flex-col items-center justify-center rounded-[1.75rem] h-24 w-full transition-all transform active:scale-95";
    
    // Primary: Solid Black/Dark Gray
    // Secondary: White with shadow
    const variantClasses = variant === 'primary' 
        ? "bg-gray-900 text-white shadow-lg shadow-gray-900/20 hover:bg-black" 
        : "bg-white text-gray-900 border border-gray-100 shadow-sm hover:bg-gray-50";

    return (
        <button onClick={onClick} className={`${baseClasses} ${variantClasses}`}>
            <div className={`mb-1 ${variant === 'secondary' ? 'text-gray-900' : ''}`}>{icon}</div>
            <span className="text-xs font-bold mt-1">{label}</span>
        </button>
    )
}

export default HomeScreen;
