import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/src/context/AppContext';
import { collection, query, where, getDocs, orderBy, Timestamp, limit } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { TransactionSummary } from '@/src/data';
import VirtualCard from '@/src/components/VirtualCard';
import { ActiveModal } from '@/src/MainApp';

// Mock card details, as this isn't stored in Firestore for this version
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
                const q = query(txCollection, where('currency', '==', currencyToFetch), orderBy('timestamp', 'desc'), limit(5));
                
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

            {/* Transactions List */}
            <div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Recent Transactions</h3>
                {loading ? <p className="text-sm text-gray-500">Loading transactions...</p> : (
                <div className="space-y-2">
                    {transactions.length > 0 ? transactions.map(tx => (
                        <button key={tx.id} onClick={() => onTransactionClick(tx)} className="w-full text-left bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm p-3 rounded-lg flex items-center justify-between hover:bg-gray-100/80 dark:hover:bg-neutral-800/80 transition-colors cursor-pointer">
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">{tx.merchant}</p>
                                <p className="text-xs text-gray-500 dark:text-neutral-400">{tx.category} • {tx.date}</p>
                            </div>
                            <p className={`font-semibold text-sm ${tx.category === 'Income' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                                {tx.category === 'Income' ? '+' : ''}{currency}{tx.amount.toFixed(2)}
                            </p>
                        </button>
                    )) : <p className="text-sm text-center py-4 text-gray-500">No transactions yet.</p>}
                </div>
                )}
            </div>
        </div>
    );
};

// --- Child Components ---

const QuickAction: React.FC<{ icon: React.ReactNode; label: string, onClick?: () => void }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center group p-2">
        <div className="w-14 h-14 bg-gray-100/70 dark:bg-neutral-800/70 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl mb-2 group-hover:bg-gray-200/80 dark:group-hover:bg-neutral-700/80 transition-all transform group-active:scale-90">
            {icon}
        </div>
        <span className="text-xs font-medium text-gray-600 dark:text-neutral-300">{label}</span>
    </button>
);

// SVG Icons
const AddMoneyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>;
const PayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>;
const WithdrawIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>;

export default HomeScreen;
