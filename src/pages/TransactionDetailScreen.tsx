import React from 'react';
import { TransactionSummary } from '../data';
import { useAppContext } from '../context/AppContext';

interface ModalProps {
    onClose: () => void;
    transaction: TransactionSummary;
}

const CategoryIcon: React.FC<{ category: string }> = ({ category }) => {
    // Re-using the same icon logic from HistoryScreen
    let icon;
    switch (category.toLowerCase()) {
        case 'food':
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>;
            break;
        case 'shopping':
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
            break;
        case 'travel':
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>;
            break;
        case 'entertainment':
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 012-2h3a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" /></svg>;
            break;
        case 'bills':
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
            break;
        default:
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
            break;
    }
    return icon;
};


const TransactionDetailScreen: React.FC<ModalProps> = ({ onClose, transaction }) => {
    const { userMode } = useAppContext();
    const currency = userMode === 'INTERNATIONAL' ? '$' : '₹';

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-2xl p-6 shadow-xl animate-slide-up">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-black dark:text-white">Transaction Details</h2>
                    <button onClick={onClose} className="text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-4 text-slate-600 dark:text-slate-300">
                       <CategoryIcon category={transaction.category} />
                    </div>
                    <p className="text-4xl font-bold text-black dark:text-white tracking-tight">
                        {currency}{transaction.amount.toFixed(2)}
                    </p>
                    <p className="font-semibold text-lg text-black dark:text-white mt-1">{transaction.merchant}</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{transaction.date}</p>
                </div>

                <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                    <DetailRow label="Status" value="Completed" valueClass="text-green-600 dark:text-green-400" />
                    <DetailRow label="Category" value={transaction.category} />
                    <DetailRow label="Transaction ID" value={transaction.id} />
                </div>

                <button
                    onClick={onClose}
                    className="w-full mt-6 bg-slate-200 dark:bg-slate-700 text-black dark:text-white font-bold py-3 px-4 rounded-lg transition-transform transform active:scale-95"
                >
                    Close
                </button>

            </div>
            <style>{`
                @keyframes slide-up {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

const DetailRow: React.FC<{ label: string; value: string; valueClass?: string }> = ({ label, value, valueClass = ''}) => (
    <div className="flex justify-between items-center text-sm">
        <p className="text-neutral-500 dark:text-neutral-400">{label}</p>
        <p className={`font-semibold text-black dark:text-white ${valueClass}`}>{value}</p>
    </div>
);


export default TransactionDetailScreen;
