import React from 'react';
import { useAppContext } from '../context/AppContext';
import mockData from '../data/mock-data.json';
import VirtualCard from '../components/VirtualCard';

const HomeScreen: React.FC<{ setActivePage: (page: 'home' | 'pay' | 'history') => void }> = ({ setActivePage }) => {
    const { userMode, balance } = useAppContext();
    const isInternational = userMode === 'INTERNATIONAL';
    const currency = isInternational ? mockData.international.currency : 'INR';

    return (
        <div className="p-4 space-y-6">
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-900 dark:to-black rounded-xl p-6 text-center text-white shadow-xl">
                <p className="text-sm text-slate-400">Your Balance</p>
                <p className="text-4xl font-bold tracking-tight mt-1">
                    {isInternational ? '$' : '₹'}{balance} <span className="text-lg font-normal text-slate-500">{currency}</span>
                </p>
            </div>

            {/* Mode-specific display */}
            {isInternational ? (
                <VirtualCard card={mockData.international.card} />
            ) : (
                <div className="bg-slate-50 dark:bg-neutral-900 rounded-xl p-4">
                    <h3 className="font-bold mb-3 px-2 text-black dark:text-white">Linked Accounts</h3>
                    {mockData.india.linkedAccounts.map(account => (
                        <div key={account.bankName} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-neutral-800 transition-colors">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-gray-700 mr-3"></div>
                                <div>
                                    <p className="font-semibold text-sm text-black dark:text-white">{account.bankName}</p>
                                    <p className="text-xs text-slate-500 dark:text-neutral-400">{account.accountNumberMask}</p>
                                </div>
                            </div>
                            <svg className="w-5 h-5 text-slate-400 dark:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </div>
                    ))}
                </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-4 text-center">
                <QuickAction icon={<SendIcon />} label="Send" />
                <QuickAction icon={<ReceiveIcon />} label="Receive" />
                <QuickAction icon={<ScanIcon />} label="Scan QR" />
                <QuickAction icon={<BillsIcon />} label="Bills" onClick={() => setActivePage('pay')} />
            </div>

        </div>
    );
};

const QuickAction: React.FC<{ icon: React.ReactNode; label: string, onClick?: () => void }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center group">
        <div className="w-14 h-14 bg-slate-100 dark:bg-neutral-800 rounded-full flex items-center justify-center text-2xl mb-2 group-hover:bg-slate-200 dark:group-hover:bg-neutral-700 transition-all transform group-active:scale-90">
            {icon}
        </div>
        <span className="text-xs text-slate-600 dark:text-neutral-300">{label}</span>
    </button>
);

// SVG Icons
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>;
const ReceiveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>;
const ScanIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h2m12 0h2a2 2 0 012 2v2m0 8v2a2 2 0 01-2 2h-2m-12 0H5a2 2 0 01-2-2v-2" /></svg>;
const BillsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;


export default HomeScreen;