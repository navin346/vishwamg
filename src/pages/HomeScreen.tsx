import React from 'react';
import { useAppContext } from '../context/AppContext';
import mockData from '../data/mock-data.json';
import mockTransactionsUsd from '../data/mock-transactions-usd.json';
import VirtualCard from '../components/VirtualCard';

const HomeScreen: React.FC = () => {
    const { userMode, balance } = useAppContext();
    const isInternational = userMode === 'INTERNATIONAL';
    const currency = isInternational ? mockData.international.currency : 'INR';
    const transactions = isInternational ? mockTransactionsUsd.transactions.slice(0, 3) : []; // Placeholder for INR

    return (
        <div className="p-4 space-y-6">
            {/* Balance Card */}
            <div className="bg-neutral-900 rounded-xl p-6 text-center">
                <p className="text-sm text-neutral-400">Your Balance</p>
                <p className="text-4xl font-bold tracking-tight mt-1">
                    {isInternational ? '$' : '₹'}{balance} <span className="text-lg font-normal text-neutral-500">{currency}</span>
                </p>
            </div>

            {/* Mode-specific display */}
            {isInternational ? (
                <VirtualCard card={mockData.international.card} />
            ) : (
                <div className="bg-neutral-900 rounded-xl p-4">
                    <h3 className="font-bold mb-3 px-2">Linked Accounts</h3>
                    {mockData.india.linkedAccounts.map(account => (
                        <div key={account.bankName} className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-800">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-700 mr-3"></div>
                                <div>
                                    <p className="font-semibold">{account.bankName}</p>
                                    <p className="text-xs text-neutral-400">{account.accountNumberMask}</p>
                                </div>
                            </div>
                            <svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </div>
                    ))}
                </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-4 text-center">
                <QuickAction icon="⬆️" label="Send" />
                <QuickAction icon="⬇️" label="Receive" />
                <QuickAction icon="📱" label="Scan QR" />
                <QuickAction icon="🧾" label="Bills" />
            </div>

        </div>
    );
};

const QuickAction: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
    <div className="flex flex-col items-center">
        <button className="w-14 h-14 bg-neutral-800 rounded-full flex items-center justify-center text-2xl mb-2 hover:bg-neutral-700">
            {icon}
        </button>
        <span className="text-xs text-neutral-300">{label}</span>
    </div>
);

export default HomeScreen;
