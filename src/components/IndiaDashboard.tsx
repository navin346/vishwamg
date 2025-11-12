import React, { useState } from 'react';
import mockData from '../data/mock-data.json';
import ScanQR from './ScanQR';
import ConfirmPayment from './ConfirmPayment';
import SendMoney from './SendMoney';
import PayBills from './PayBills';
import AddCreditCard from './AddCreditCard';

// --- Icon Components ---
const QRIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125-1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 14.625v4.5a1.125 1.125 0 001.125 1.125h4.5a1.125 1.125 0 001.125-1.125v-4.5a1.125 1.125 0 00-1.125-1.125h-4.5a1.125 1.125 0 00-1.125 1.125z" />
    </svg>
);
const SendMoneyIcon: React.FC<{ className?: string }> = ({ className }) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.826-1.106-2.256 0-3.082C10.544 7.26 11.27 7 12 7c.725 0 1.45.22 2.003.659" /></svg>);
const PayBillsIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>);
const RechargeIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>);
const BankIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21V3m0 18H3.75M12 21h8.25M12 3H3.75M12 3h8.25M3.75 21V3m16.5 18V3M3.75 12h16.5m-16.5 3.75h16.5M3.75 6.75h16.5" /></svg>);
const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>);
const CreditCardIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" ><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 21z" /></svg>);


interface ActionButtonProps {
    label: string;
    icon: React.ReactNode;
    onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ label, icon, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className="flex items-center space-x-4 p-4 bg-slate-800/50 hover:bg-slate-800 border border-white/10 rounded-xl transition-all duration-300 w-full text-left"
        >
            <div className="bg-slate-700 p-3 rounded-full">
                {icon}
            </div>
            <span className="font-semibold text-white">{label}</span>
        </button>
    )
}

type View = 'dashboard' | 'scan' | 'confirm' | 'send' | 'payBills' | 'addCard';

const IndiaDashboard: React.FC = () => {
    const { linkedAccounts } = mockData.india;
    const [view, setView] = useState<View>('dashboard');

    const handlePaymentConfirm = () => {
        alert('Payment Successful!'); // Simple feedback for the demo
        setView('dashboard');
    };

    if (view === 'scan') return <ScanQR onTestPaymentClick={() => setView('confirm')} onCancel={() => setView('dashboard')} />;
    if (view === 'confirm') return <ConfirmPayment onConfirm={handlePaymentConfirm} onCancel={() => setView('dashboard')} />;
    if (view === 'send') return <SendMoney onCancel={() => setView('dashboard')} />;
    if (view === 'payBills') return <PayBills onCancel={() => setView('dashboard')} />;
    if (view === 'addCard') return <AddCreditCard onCancel={() => setView('dashboard')} />;


    return (
        <main className="p-4 md:p-6 space-y-8">
            {/* Header */}
            <div className="text-left pt-4">
                <h1 className="text-3xl font-bold text-white">Hello, Jane</h1>
                <p className="text-slate-400">Welcome to your India dashboard.</p>
            </div>
            
            {/* Actions Section */}
            <div className="space-y-3">
                 <h2 className="text-lg font-semibold text-slate-300 px-1">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-3">
                     <ActionButton 
                        label="Scan QR"
                        icon={<QRIcon className="w-6 h-6 text-green-400" />}
                        onClick={() => setView('scan')}
                    />
                    <ActionButton 
                        label="Send Money"
                        icon={<SendMoneyIcon className="w-6 h-6 text-blue-400" />}
                        onClick={() => setView('send')}
                    />
                    <ActionButton 
                        label="Pay Bills"
                        icon={<PayBillsIcon className="w-6 h-6 text-purple-400" />}
                        onClick={() => setView('payBills')}
                    />
                     <ActionButton 
                        label="Recharge"
                        icon={<RechargeIcon className="w-6 h-6 text-orange-400" />}
                    />
                </div>
            </div>

            {/* Linked Accounts Section */}
            <div>
                <h2 className="text-lg font-semibold text-slate-300 mb-3 px-1">Linked Accounts</h2>
                <div className="space-y-3">
                    {linkedAccounts.map((account, index) => (
                         <div key={index} className="bg-slate-800/50 border border-white/10 rounded-xl p-4 shadow-lg">
                            <div className="flex items-center space-x-4">
                                <div className="bg-slate-700 p-3 rounded-full">
                                    <BankIcon className="w-6 h-6 text-cyan-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white">{account.bankName}</p>
                                    <p className="text-sm text-slate-400">Account ending in {account.accountNumberMask}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                   
                    <div className="grid grid-cols-2 gap-3 pt-2">
                         <button className="w-full flex items-center justify-center space-x-2 bg-slate-800/50 hover:bg-slate-800 text-cyan-400 font-semibold py-3 px-2 rounded-xl shadow-lg transition-colors duration-300 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900">
                            <PlusIcon className="w-5 h-5" />
                            <span className="text-sm">Add Bank</span>
                        </button>
                         <button 
                            onClick={() => setView('addCard')}
                            className="w-full flex items-center justify-center space-x-2 bg-slate-800/50 hover:bg-slate-800 text-cyan-400 font-semibold py-3 px-2 rounded-xl shadow-lg transition-colors duration-300 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900">
                            <CreditCardIcon className="w-5 h-5" />
                            <span className="text-sm">Add Credit Card</span>
                        </button>
                    </div>
                </div>
            </div>

        </main>
    );
};

export default IndiaDashboard;