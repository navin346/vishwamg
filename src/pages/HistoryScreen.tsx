import React from 'react';
import { useAppContext } from '../context/AppContext';
import mockTransactionsUsd from '../data/mock-transactions-usd.json';
import mockTransactionsInr from '../data/mock-transactions-inr.json';

const CategoryIcon: React.FC<{ category: string }> = ({ category }) => {
    let icon;
    switch (category.toLowerCase()) {
        case 'food':
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>;
            break;
        case 'shopping':
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
            break;
        case 'travel':
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>;
            break;
        case 'entertainment':
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 012-2h3a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" /></svg>;
            break;
        case 'bills':
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
            break;
        default:
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
    }
    return (
        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-neutral-800 mr-4 flex items-center justify-center text-slate-500 dark:text-slate-400">
            {icon}
        </div>
    );
};

const HistoryScreen: React.FC = () => {
  const { userMode } = useAppContext();
  const isInternational = userMode === 'INTERNATIONAL';
  const transactions = isInternational ? mockTransactionsUsd.transactions : mockTransactionsInr.transactions;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-black dark:text-white">History</h1>
      <div className="space-y-3">
        {transactions.map(tx => (
          <div key={tx.id} className="bg-white dark:bg-neutral-900/50 p-3 rounded-lg flex items-center justify-between hover:bg-slate-50 dark:hover:bg-neutral-800/50 transition-colors">
            <div className="flex items-center">
              <CategoryIcon category={tx.category} />
              <div>
                <p className="font-semibold text-black dark:text-white">{tx.merchant}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{tx.date}</p>
              </div>
            </div>
            <p className="font-semibold text-sm text-red-500">
              {isInternational ? '-$' : '-₹'}{tx.amount.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryScreen;