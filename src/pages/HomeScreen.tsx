import React from 'react';
import { useAppContext } from '../context/AppContext';
import mockData from '../data/mock-data.json';
import VirtualCard from '../components/VirtualCard';
import { ActiveModal, ActivePage } from '../MainApp';

interface HomeScreenProps {
    setActivePage: (page: ActivePage) => void;
    setActiveModal: (modal: ActiveModal) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ setActivePage, setActiveModal }) => {
    const { userMode, balance, kycStatus } = useAppContext();
    const isInternational = userMode === 'INTERNATIONAL';
    const currency = isInternational ? mockData.international.currency : 'INR';
    const isCardActive = isInternational && kycStatus === 'verified';

    return (
        <div className="p-4 space-y-6">
            {/* Balance Card */}
            <div className="relative rounded-xl p-6 text-center text-white shadow-xl overflow-hidden dark:bg-slate-900">
                 <div className="absolute inset-0 dark:aurora-gradient bg-gradient-to-br from-violet-600 to-indigo-600"></div>
                 <div className="relative">
                    <p className="text-sm text-indigo-200 dark:text-slate-400">Your Balance</p>
                    <p className="text-4xl font-bold tracking-tight mt-1">
                        {isInternational ? '$' : '₹'}{balance} <span className="text-lg font-normal text-indigo-300 dark:text-slate-500">{currency}</span>
                    </p>
                </div>
            </div>

            {/* Mode-specific display */}
            {isInternational ? (
                <VirtualCard card={mockData.international.card} disabled={!isCardActive} />
            ) : (
                <div className="bg-slate-50 dark:bg-neutral-900 rounded-xl p-4 space-y-2">
                    <h3 className="font-bold mb-2 px-2 text-black dark:text-white">Accounts & Cards</h3>
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
                     <button className="w-full text-left p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-neutral-800 transition-colors flex items-center text-sm font-semibold text-violet-600 dark:text-violet-400">
                         <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-400 dark:border-gray-600 mr-3 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                         </div>
                        Add Credit Card to UPI
                    </button>
                </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-2 text-center">
                <QuickAction icon={<AddMoneyIcon />} label="Add Money" onClick={() => setActiveModal('add_money')} />
                <QuickAction icon={<SendIcon />} label="Send" onClick={() => setActiveModal('send')} />
                <QuickAction icon={<WithdrawIcon />} label="Withdraw" onClick={() => setActiveModal('withdraw')} />
                <QuickAction icon={<BillsIcon />} label="Bills" onClick={() => setActivePage('pay')} />
            </div>

        </div>
    );
};

const QuickAction: React.FC<{ icon: React.ReactNode; label: string, onClick?: () => void }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center group p-2">
        <div className="w-14 h-14 bg-slate-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center text-2xl mb-2 group-hover:bg-slate-200 dark:group-hover:bg-neutral-700 transition-all transform group-active:scale-90">
            {icon}
        </div>
        <span className="text-xs font-medium text-slate-600 dark:text-neutral-300">{label}</span>
    </button>
);

// SVG Icons
const AddMoneyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>;
const WithdrawIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>;
const BillsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;


export default HomeScreen;