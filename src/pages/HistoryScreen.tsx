import React from 'react';
import { useAppContext } from '../context/AppContext';
import mockTransactionsUsd from '../data/mock-transactions-usd.json';
import mockTransactionsInr from '../data/mock-transactions-inr.json';

const HistoryScreen: React.FC = () => {
  const { userMode } = useAppContext();
  const isInternational = userMode === 'INTERNATIONAL';
  const transactions = isInternational ? mockTransactionsUsd.transactions : mockTransactionsInr.transactions;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Transaction History</h1>
      <div className="space-y-3">
        {transactions.map(tx => (
          <div key={tx.id} className="bg-neutral-900 p-4 rounded-lg flex items-center justify-between hover:bg-neutral-800">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-neutral-700 mr-4 flex items-center justify-center font-bold text-lg">
                {tx.merchant.charAt(0)}
              </div>
              <div>
                <p className="font-semibold">{tx.merchant}</p>
                <p className="text-xs text-neutral-400">{tx.category} · {tx.date}</p>
              </div>
            </div>
            <p className={`font-bold ${isInternational ? 'text-white' : 'text-green-400'}`}>
              {isInternational ? '-$' : '-₹'}{tx.amount.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryScreen;
