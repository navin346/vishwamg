import React from 'react';
import { ArrowLeft, Plus, TrendingUp, ShieldCheck } from 'lucide-react';
import { useAppContext } from '@/src/context/AppContext';

interface YieldScreenProps {
    onBack?: () => void;
}

const VaultItem: React.FC<{ name: string, apy: string, balance?: string, colorClass: string }> = ({ name, apy, balance, colorClass }) => (
    <div className="bg-white border border-gray-100 rounded-[1.5rem] p-5 flex items-center justify-between hover:border-violet-100 hover:shadow-md transition-all group shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full ${colorClass} flex items-center justify-center text-lg font-bold shadow-sm`}>
                {name[0]}
            </div>
            <div>
                <h3 className="font-bold text-gray-900 text-lg">{name}</h3>
                <p className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-0.5 bg-emerald-50 px-2 py-0.5 rounded-md w-fit">
                    <TrendingUp size={12} /> {apy} APY
                </p>
            </div>
        </div>
        <div className="text-right">
            {balance ? (
                <>
                    <p className="font-bold text-gray-900 text-lg">{balance}</p>
                    <p className="text-xs text-gray-400 font-medium">Balance</p>
                </>
            ) : (
                <button className="bg-gray-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-gray-900/10 hover:bg-black transition-colors">
                    Start
                </button>
            )}
        </div>
    </div>
)

const YieldScreen: React.FC<YieldScreenProps> = ({ onBack }) => {
    const { userMode } = useAppContext();
    const isInternational = userMode === 'INTERNATIONAL';
    const currencySymbol = isInternational ? '$' : '₹';
    const title = isInternational ? 'Smart Vaults' : 'Growth Pots';

    return (
        <div className="p-6 space-y-8 pb-24 min-h-full bg-[#FDFDFD]">
            <div className="flex items-center gap-3 pt-2">
                {onBack && (
                    <button onClick={onBack} className="p-2 rounded-full bg-white border border-gray-100 text-gray-600 shadow-sm hover:bg-gray-50">
                        <ArrowLeft size={20} />
                    </button>
                )}
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
                </div>
            </div>

            {/* Total Balance Card - Premium Black or Deep Violet for Contrast */}
            <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-gray-900/20 relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-sm font-bold opacity-60 uppercase tracking-widest mb-2">Total Earnings</p>
                    <h2 className="text-[3.5rem] leading-none font-bold tracking-tighter">{currencySymbol}124.50</h2>
                    <div className="mt-8 flex items-center gap-2 text-sm font-medium text-gray-300 bg-white/10 px-3 py-1.5 rounded-lg w-fit backdrop-blur-md">
                        <ShieldCheck size={16} />
                        <span>Assets 100% Backed & Audited</span>
                    </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-violet-500 to-transparent rounded-full -mr-20 -mt-20 opacity-30 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500 rounded-full -ml-10 -mb-10 opacity-20 blur-3xl"></div>
            </div>

            <div className="space-y-5">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Available Vaults</h3>
                    <button className="text-gray-900 bg-white border border-gray-200 p-2 rounded-full shadow-sm hover:bg-gray-50">
                        <Plus size={18} />
                    </button>
                </div>
                
                {isInternational ? (
                    <>
                        <VaultItem name="USDC Core" apy="5.2%" colorClass="bg-blue-100 text-blue-600" />
                        <VaultItem name="Ethereum" apy="3.8%" colorClass="bg-purple-100 text-purple-600" balance="0.45 ETH" />
                        <VaultItem name="Bitcoin" apy="1.5%" colorClass="bg-orange-100 text-orange-600" />
                    </>
                ) : (
                    <>
                        <VaultItem name="Nifty 50" apy="12.5%" colorClass="bg-blue-100 text-blue-600" />
                        <VaultItem name="Digital Gold" apy="2.5%" colorClass="bg-yellow-100 text-yellow-600" balance="1.2g" />
                        <VaultItem name="Liquid Pot" apy="6.8%" colorClass="bg-teal-100 text-teal-600" />
                    </>
                )}
            </div>
        </div>
    );
};

export default YieldScreen;