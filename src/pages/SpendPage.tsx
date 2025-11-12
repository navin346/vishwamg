import React from 'react';
import { useAppContext } from '../context/AppContext';
import { type TransactionSummary } from '../data';
import transactionsInrData from '../data/mock-transactions-inr.json';
import transactionsUsdData from '../data/mock-transactions-usd.json';

const categoryIcons: { [key: string]: string } = {
    Food: '🍔',
    Travel: '✈️',
    Shopping: '🛍️',
    Bills: '📄',
    Entertainment: '🎬',
};

const categoryColors: { [key: string]: string } = {
    Food: 'bg-red-500',
    Travel: 'bg-blue-500',
    Shopping: 'bg-purple-500',
    Bills: 'bg-yellow-500',
    Entertainment: 'bg-pink-500',
};


const SpendPage: React.FC = () => {
    const { userMode } = useAppContext();

    const { transactions, currencySymbol } = userMode === 'INDIA' 
        ? { transactions: transactionsInrData.transactions, currencySymbol: '₹' }
        : { transactions: transactionsUsdData.transactions, currencySymbol: '$' };

    const categoryTotals = transactions.reduce((acc, transaction) => {
        if (!acc[transaction.category]) {
            acc[transaction.category] = 0;
        }
        acc[transaction.category] += transaction.amount;
        return acc;
    }, {} as { [key: string]: number });
    
    const chartData = Object.entries(categoryTotals).map(([label, value]: [string, number]) => ({ label, value }));
    const maxValue = Math.max(0, ...chartData.map(d => d.value));

    return (
        <main className="p-4 md:p-6 space-y-8">
            <div className="text-left pt-4">
                <h1 className="text-3xl font-bold text-white">Spending Analytics</h1>
                <p className="text-slate-400">Your spending summary in {userMode === 'INDIA' ? 'INR' : 'USD'}.</p>
            </div>
            
            <div className="bg-slate-800/50 border border-white/10 rounded-xl shadow-lg p-6">
                {/* Bar Chart */}
                <div className="mb-10">
                    <h3 className="text-lg font-semibold text-slate-300 mb-4">By Category</h3>
                    <div className="h-64 bg-black/20 p-4 rounded-lg flex justify-around items-end gap-2 md:gap-4 border border-white/10">
                        {chartData.map(({ label, value }) => (
                            <div key={label} className="flex flex-col items-center flex-1 h-full pt-4">
                               <div className="w-full h-full flex items-end">
                                     <div 
                                        className={`w-full rounded-t-md transition-all duration-1000 ease-out ${categoryColors[label] || 'bg-cyan-500'}`}
                                        style={{ height: maxValue > 0 ? `${(value / maxValue) * 100}%` : '0%' }}
                                        title={`${label}: ${currencySymbol}${value.toFixed(2)}`}
                                    ></div>
                               </div>
                                <span className="text-xs text-slate-400 mt-2 truncate">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Transaction List */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-4">Recent Transactions</h3>
                    <ul className="space-y-3">
                        {transactions.map((tx: TransactionSummary) => (
                            <li key={tx.id} className="flex items-center justify-between bg-black/20 p-3 md:p-4 rounded-lg border border-white/10">
                                <div className="flex items-center gap-4">
                                    <div className="bg-slate-700 rounded-full w-10 h-10 flex-shrink-0 flex items-center justify-center text-xl">
                                        {categoryIcons[tx.category] || '💰'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">{tx.merchant}</p>
                                        <p className="text-sm text-slate-400">{tx.date}</p>
                                    </div>
                                </div>
                                <p className="font-semibold text-white text-md md:text-lg whitespace-nowrap">
                                    {currencySymbol}{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </main>
    );
};

export default SpendPage;