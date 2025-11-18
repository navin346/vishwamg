import React, { useState } from 'react';
import { TransactionSummary } from '@/src/data';
import { useAppContext } from '@/src/context/AppContext';
import { Users, Share2, X } from 'lucide-react';
import { triggerHaptic } from '@/src/utils/haptics';

interface ModalProps {
    onClose: () => void;
    transaction: TransactionSummary;
}

const CategoryIcon: React.FC<{ category: string }> = ({ category }) => {
    return <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-2xl shadow-inner">
        {category[0]}
    </div>;
};


const TransactionDetailScreen: React.FC<ModalProps> = ({ onClose, transaction }) => {
    const { userMode } = useAppContext();
    const currency = userMode === 'INTERNATIONAL' ? '$' : '₹';
    const [isSplitting, setIsSplitting] = useState(false);

    const handleSplit = () => {
        triggerHaptic('medium');
        setIsSplitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSplitting(false);
            onClose();
            alert(`Split request sent for ${currency}${(transaction.amount / 2).toFixed(2)}`);
        }, 1000);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-end justify-center">
            <div className="w-full max-w-md bg-white dark:bg-[#0A0A0A] rounded-t-3xl p-6 shadow-2xl animate-slide-up border-t border-gray-200 dark:border-neutral-800">
                <div className="flex justify-end mb-2">
                    <button onClick={onClose} className="bg-gray-100 dark:bg-neutral-800 p-2 rounded-full text-gray-600 dark:text-gray-400">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="flex flex-col items-center mb-8">
                    <div className="mb-4 shadow-xl rounded-2xl">
                       <CategoryIcon category={transaction.category} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">
                        {currency}{transaction.amount.toFixed(2)}
                    </h2>
                    <p className="text-gray-500 dark:text-neutral-400 font-medium">{transaction.merchant}</p>
                    <p className="text-xs text-gray-400 mt-1">{transaction.date} • {transaction.timestamp}</p>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-4 space-y-3 border border-gray-100 dark:border-neutral-800">
                        <DetailRow label="Status" value="Completed" valueClass="text-emerald-600 dark:text-emerald-400" />
                        <DetailRow label="Category" value={transaction.category} />
                        <DetailRow label="Payment Method" value={transaction.method} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={handleSplit}
                        disabled={isSplitting}
                        className="flex items-center justify-center gap-2 py-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold text-sm transition-transform active:scale-95"
                    >
                        {isSplitting ? 'Sending...' : <><Users size={18} /> Split Bill</>}
                    </button>
                    <button className="flex items-center justify-center gap-2 py-4 rounded-xl bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white font-bold text-sm transition-transform active:scale-95">
                        <Share2 size={18} /> Share Receipt
                    </button>
                </div>

            </div>
            <style>{`
                @keyframes slide-up {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
};

const DetailRow: React.FC<{ label: string; value: string; valueClass?: string }> = ({ label, value, valueClass = 'text-gray-900 dark:text-white' }) => (
    <div className="flex justify-between items-center text-sm">
        <p className="text-gray-500 dark:text-neutral-500">{label}</p>
        <p className={`font-semibold ${valueClass}`}>{value}</p>
    </div>
);

export default TransactionDetailScreen;