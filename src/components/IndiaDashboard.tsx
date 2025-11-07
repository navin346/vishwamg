import React, { useState } from 'react';
import mockData from '../data/mock-data.json' with { type: 'json' };
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

const SendMoneyIcon: React.FC<{ className?: string }> = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.826-1.106-2.256 0-3.082C10.544 7.26 11.27 7 12 7c.725 0 1.45.22 2.003.659" />
    </svg>
);

const PayBillsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const RechargeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
);

const BankIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V3m0 18H3.75M12 21h8.25M12 3H3.75M12 3h8.25M3.75 21V3m16.5 18V3M3.75 12h16.5m-16.5 3.75h16.5M3.75 6.75h16.5" />
    </svg>
);

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const CreditCardIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 21z" />
    </svg>
);


interface ActionButtonProps {
    label: string;
    icon: React.ReactNode;
    colorClasses: string;
    onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ label, icon, colorClasses, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className={`flex flex-col items-center justify-center aspect-square rounded-2xl shadow-lg p-4 text-white font-semibold transform hover:scale-105 transition-transform duration-300 ease-in-out ${colorClasses}`}>
            <div className="mb-2">{icon}</div>
            <span>{label}</span>
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

    if (view === 'scan') {
        return <ScanQR onTestPaymentClick={() => setView('confirm')} onCancel={() => setView('dashboard')} />;
    }

    if (view === 'confirm') {
        return <ConfirmPayment onConfirm={handlePaymentConfirm} onCancel={() => setView('dashboard')} />;
    }
    
    if (view === 'send') {
        return <SendMoney onCancel={() => setView('dashboard')} />;
    }
    
    if (view === 'payBills') {
        return <PayBills onCancel={() => setView('dashboard')} />;
    }

    if (view === 'addCard') {
        return <AddCreditCard onCancel={() => setView('dashboard')} />;
    }


    return (
        <main className="container mx-auto p-4 md:p-8">
            {/* Header */}
            <div className="text-left mb-8">
                <h1 className="text-3xl font-bold text-white">Welcome to Vishwam</h1>
            </div>
            
            {/* 2x2 Action Grid */}
            <div className="grid grid-cols-2 gap-4 md:gap-6 mb-10">
                <ActionButton 
                    label="Scan QR"
                    icon={<QRIcon className="w-10 h-10" />}
                    colorClasses="bg-gradient-to-br from-green-400 to-teal-500"
                    onClick={() => setView('scan')}
                />
                <ActionButton 
                    label="Send Money"
                    icon={<SendMoneyIcon className="w-10 h-10" />}
                    colorClasses="bg-gradient-to-br from-blue-400 to-indigo-500"
                    onClick={() => setView('send')}
                />
                <ActionButton 
                    label="Pay Bills"
                    icon={<PayBillsIcon className="w-10 h-10" />}
                    colorClasses="bg-gradient-to-br from-purple-400 to-violet-500"
                    onClick={() => setView('payBills')}
                />
                 <ActionButton 
                    label="Recharge"
                    icon={<RechargeIcon className="w-10 h-10" />}
                    colorClasses="bg-gradient-to-br from-orange-400 to-red-500"
                />
            </div>

            {/* Linked Accounts Section */}
            <div>
                <h2 className="text-xl font-bold text-slate-200 mb-4">Linked Accounts</h2>
                <div className="space-y-3">
                    {linkedAccounts.map((account, index) => (
                         <div key={index} className="bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-700">
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
                   
                    <div className="grid grid-cols-2 gap-3">
                         <button className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold py-3 px-2 rounded-xl shadow-lg transition-colors duration-300 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900">
                            <PlusIcon className="w-5 h-5" />
                            <span className="text-sm">Add Bank</span>
                        </button>
                         <button 
                            onClick={() => setView('addCard')}
                            className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold py-3 px-2 rounded-xl shadow-lg transition-colors duration-300 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900">
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