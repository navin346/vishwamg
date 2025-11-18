import React, { useState } from 'react';
import { useAppContext } from '@/src/context/AppContext';
import GlobalPayScreen from '@/src/pages/GlobalPayScreen';
import BillsScreen from '@/src/pages/BillsScreen';
import YieldScreen from '@/src/pages/YieldScreen';
import LoansScreen from '@/src/pages/LoansScreen';
import { Layers, Zap, Globe, Landmark } from 'lucide-react';

interface ServicesHubProps {
    onPayBiller: (billerName: string, amount: number) => void;
}

type ServiceView = 'menu' | 'yield' | 'bills_global' | 'loans';

const ServicesHub: React.FC<ServicesHubProps> = ({ onPayBiller }) => {
    const { userMode } = useAppContext();
    const [currentView, setCurrentView] = useState<ServiceView>('menu');
    const isInternational = userMode === 'INTERNATIONAL';

    const MenuCard: React.FC<{ 
        title: string, 
        subtitle: string, 
        icon: React.ReactNode, 
        color: string,
        onClick: () => void 
    }> = ({ title, subtitle, icon, color, onClick }) => (
        <button 
            onClick={onClick}
            className="w-full relative overflow-hidden bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-3xl p-6 text-left group hover:border-gray-300 dark:hover:border-neutral-700 transition-all"
        >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-10 blur-2xl rounded-full -mr-10 -mt-10 group-hover:opacity-20 transition-opacity`} />
            <div className="relative z-10">
                <div className={`w-12 h-12 rounded-2xl ${color} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center mb-4 text-gray-900 dark:text-white shadow-sm`}>
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">{subtitle}</p>
            </div>
        </button>
    );

    if (currentView === 'yield') {
        return <YieldScreen onBack={() => setCurrentView('menu')} />;
    }
    if (currentView === 'bills_global') {
        return isInternational 
            ? <GlobalPayScreen onBack={() => setCurrentView('menu')} />
            : <BillsScreen onPayBiller={onPayBiller} onBack={() => setCurrentView('menu')} />;
    }
    if (currentView === 'loans') {
        return <LoansScreen onBack={() => setCurrentView('menu')} />;
    }

    return (
        <div className="p-5 space-y-6 pb-24 min-h-full bg-gray-50 dark:bg-black">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Services</h1>
                <p className="text-gray-600 dark:text-neutral-400 text-base">Explore the financial hub.</p>
            </div>

            <div className="grid gap-4">
                <MenuCard 
                    title="Yield Vaults" 
                    subtitle="Earn up to 12% APY on stablecoins" 
                    icon={<Layers size={24} />}
                    color="from-emerald-500 to-teal-500"
                    onClick={() => setCurrentView('yield')}
                />
                <MenuCard 
                    title={isInternational ? "Global Lifestyle" : "Bills & Recharge"} 
                    subtitle={isInternational ? "eSIM, Travel & Forex" : "Pay Utilities, DTH & more"} 
                    icon={isInternational ? <Globe size={24} /> : <Zap size={24} />}
                    color="from-indigo-500 to-purple-500"
                    onClick={() => setCurrentView('bills_global')}
                />
                 <MenuCard 
                    title="Credit Line" 
                    subtitle="Instant loans against your assets" 
                    icon={<Landmark size={24} />}
                    color="from-orange-500 to-amber-500"
                    onClick={() => setCurrentView('loans')}
                />
            </div>
        </div>
    );
};

export default ServicesHub;