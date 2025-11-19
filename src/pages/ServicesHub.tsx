import React, { useState } from 'react';
import { useAppContext } from '@/src/context/AppContext';
import GlobalPayScreen from '@/src/pages/GlobalPayScreen';
import BillsScreen from '@/src/pages/BillsScreen';
import YieldScreen from '@/src/pages/YieldScreen';
import LoansScreen from '@/src/pages/LoansScreen';
import { Zap, Globe, Landmark, TrendingUp, ArrowRight } from 'lucide-react';
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
        colorClass: string,
        onClick: () => void 
    }> = ({ title, subtitle, icon, colorClass, onClick }) => (
        <button 
            onClick={onClick}
            className="w-full bg-white border border-gray-100 rounded-[2rem] p-6 text-left group hover:border-violet-100 hover:shadow-md transition-all shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] active:scale-[0.99]"
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`w-14 h-14 rounded-2xl ${colorClass} flex items-center justify-center text-gray-900 shadow-sm`}>
                    {icon}
                </div>
                <div className="p-2 rounded-full bg-gray-50 text-gray-300 group-hover:text-violet-500 transition-colors">
                     <ArrowRight size={18} />
                </div>
            </div>
            
            <div>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h3>
                <p className="text-sm text-gray-500 mt-1 font-medium">{subtitle}</p>
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
        <div className="p-6 space-y-8 pb-24 min-h-full">
            <div className="space-y-2 pt-2">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Services</h1>
                <p className="text-gray-500 text-lg font-medium">Explore the financial hub.</p>
            </div>

            <div className="grid gap-5">
                 <MenuCard 
                    title={isInternational ? "Earn $" : "Earn ₹"}
                    subtitle={isInternational ? "Stablecoin Vaults & DeFi" : "Mutual Funds, Gold & P2P"} 
                    icon={<TrendingUp size={28} className="text-emerald-600" />}
                    colorClass="bg-emerald-50"
                    onClick={() => handleNav('yield')}
                />
                <MenuCard 
                    title={isInternational ? "Global Lifestyle" : "Bills & Recharge"} 
                    subtitle={isInternational ? "eSIM, Travel & Forex" : "Pay Utilities, DTH & more"} 
                    icon={isInternational ? <Globe size={28} className="text-violet-600" /> : <Zap size={28} className="text-violet-600" />}
                    colorClass="bg-violet-50"
                    onClick={() => handleNav('bills_global')}
                />
                 <MenuCard 
                    title="Credit Line" 
                    subtitle="Instant loans against your assets" 
                    icon={<Landmark size={28} className="text-amber-600" />}
                    colorClass="bg-amber-50"
                    onClick={() => handleNav('loans')}
                />
            </div>
        </div>
    );
};

export default ServicesHub;