import React, { useState } from 'react';
import { useAppContext } from '@/src/context/AppContext';
import GlobalPayScreen from '@/src/pages/GlobalPayScreen';
import BillsScreen from '@/src/pages/BillsScreen';
import YieldScreen from '@/src/pages/YieldScreen';
import LoansScreen from '@/src/pages/LoansScreen';
import { Layers, Zap, Globe, Landmark, TrendingUp } from 'lucide-react';
import { triggerHaptic } from '@/src/utils/haptics';

interface ServicesHubProps {
    onPayBiller: (billerName: string, amount: number) => void;
}

type ServiceView = 'menu' | 'yield' | 'bills_global' | 'loans';

const ServicesHub: React.FC<ServicesHubProps> = ({ onPayBiller }) => {
    const { userMode } = useAppContext();
    const [currentView, setCurrentView] = useState<ServiceView>('menu');
    const isInternational = userMode === 'INTERNATIONAL';

    const handleNav = (view: ServiceView) => {
        triggerHaptic('light');
        setCurrentView(view);
    }

    const MenuCard: React.FC<{ 
        title: string, 
        subtitle: string, 
        icon: React.ReactNode, 
        color: string,
        onClick: () => void 
    }> = ({ title, subtitle, icon, color, onClick }) => (
        <button 
            onClick={onClick}
            className="w-full relative overflow-hidden bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-3xl p-6 text-left group hover:border-gray-300 dark:hover:border-white/20 transition-all shadow-sm active:scale-[0.98]"
        >
            {/* Enhanced Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-[0.08] dark:opacity-[0.15] group-hover:opacity-[0.12] dark:group-hover:opacity-[0.2] transition-opacity`} />
            
            {/* Glowing Orb */}
            <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${color} opacity-20 dark:opacity-30 blur-3xl rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-500`} />
            
            <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl ${color} bg-opacity-20 dark:bg-opacity-30 flex items-center justify-center mb-4 text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10`}>
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-1 font-medium">{subtitle}</p>
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
        <div className="p-5 space-y-6 pb-24 min-h-full">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Services</h1>
                <p className="text-gray-600 dark:text-gray-300 text-base font-medium">Explore the financial hub.</p>
            </div>

            <div className="grid gap-4">
                 <MenuCard 
                    title={isInternational ? "Earn $" : "Earn ₹"}
                    subtitle={isInternational ? "Stablecoin Vaults & DeFi" : "Mutual Funds, Gold & P2P"} 
                    icon={<TrendingUp size={28} />}
                    color="from-emerald-400 to-teal-500"
                    onClick={() => handleNav('yield')}
                />
                <MenuCard 
                    title={isInternational ? "Global Lifestyle" : "Bills & Recharge"} 
                    subtitle={isInternational ? "eSIM, Travel & Forex" : "Pay Utilities, DTH & more"} 
                    icon={isInternational ? <Globe size={28} /> : <Zap size={28} />}
                    color="from-indigo-400 to-purple-500"
                    onClick={() => handleNav('bills_global')}
                />
                 <MenuCard 
                    title="Credit Line" 
                    subtitle="Instant loans against your assets" 
                    icon={<Landmark size={28} />}
                    color="from-orange-400 to-amber-500"
                    onClick={() => handleNav('loans')}
                />
            </div>
        </div>
    );
};

export default ServicesHub;