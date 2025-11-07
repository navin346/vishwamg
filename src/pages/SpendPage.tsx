
import React from 'react';
import { useAppContext } from '../context/AppContext';
import InfoCard from '../components/InfoCard';
import transactionsInrData from '../data/mock-transactions-inr.json' with { type: 'json' };
import transactionsUsdData from '../data/mock-transactions-usd.json' with { type: 'json' };

type Transaction = {
    id: string;
    merchant: string;
    category: string;
    amount: number;
    date: string;
};

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

    // Calculate totals for the chart
    const categoryTotals = transactions.reduce((acc, transaction) => {
        if (!acc[transaction.category]) {
            acc[transaction.category] = 0;
        }
        acc[transaction.category] += transaction.amount;
        return acc;
    }, {} as { [key: string]: number });
    
    // FIX: Explicitly type `value` as a number in the map's destructuring to resolve type inference issues.
    const chartData = Object.entries(categoryTotals).map(([label, value]: [string, number]) => ({ label, value }));
    const maxValue = Math.max(0, ...chartData.map(d => d.value));

    return (
        <main className="container mx-auto p-4 md:p-8">
            <InfoCard header={`Spending Analytics (${currencySymbol})`}>
                {/* Bar Chart */}
                <div className="mb-10">
                    <h3 className="text-lg font-semibold text-slate-300 mb-4">By Category</h3>
                    <div className="h-64 bg-slate-800/50 p-4 rounded-lg flex justify-around items-end gap-2 md:gap-4 border border-slate-700">
                        {chartData.map(({ label, value }) => (
                            <div key={label} className="flex flex-col items-center flex-1 h-full pt-4">
                               <div className="w-full h-full flex items-end">
                                     <div 
                                        className={`w-full rounded-t-md transition-all duration-500 ease-out ${categoryColors[label] || 'bg-cyan-500'}`}
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
                        {transactions.map((tx: Transaction) => (
                            <li key={tx.id} className="flex items-center justify-between bg-slate-800/50 p-3 md:p-4 rounded-lg border border-slate-700">
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
            </InfoCard>
        </main>
    );
};

export default SpendPage;