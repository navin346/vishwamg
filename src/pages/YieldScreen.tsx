import React from 'react';
import { ArrowLeft, Info, Plus, TrendingUp, ShieldCheck } from 'lucide-react';
import { useAppContext } from '@/src/context/AppContext';

interface YieldScreenProps {
    onBack?: () => void;
}

const VaultItem: React.FC<{ name: string, apy: string, balance?: string, color: string }> = ({ name, apy, balance, color }) => (
    <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-5 flex items-center justify-between hover:border-gray-300 dark:hover:border-neutral-700 transition-all group">
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full ${color} bg-opacity-20 flex items-center justify-center text-lg font-bold shadow-sm`}>
                {name[0]}
            </div>
            <div>
                <h3 className="font-bold text-gray-900 dark:text-white">{name}</h3>
                <p className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                    <TrendingUp size={12} /> {apy} APY
                </p>
            </div>
        </div>
        <div className="text-right">
            {balance ? (
                <>
                    <p className="font-bold text-gray-900 dark:text-white">{balance}</p>
                    <p className="text-xs text-gray-500">Balance</p>
                </>
            ) : (
                <button className="bg-black dark:bg-white text-white dark:text-black text-xs font-bold px-4 py-2 rounded-full">
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
        <div className="p-5 space-y-8 pb-24 min-h-full">
            <div className="flex items-center gap-3">
                {onBack && (
                    <button onClick={onBack} className="p-2 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-white">
                        <ArrowLeft size={20} />
                    </button>
                )}
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h1>
                </div>
            </div>

            {/* Total Balance Card */}
            <div className="bg-black dark:bg-white rounded-[2rem] p-8 text-white dark:text-black shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-sm font-medium opacity-60 uppercase tracking-widest mb-2">Total Earnings</p>
                    <h2 className="text-5xl font-bold tracking-tighter">{currencySymbol}124.50</h2>
                    <div className="mt-6 flex items-center gap-2 text-sm font-medium opacity-80">
                        <ShieldCheck size={16} />
                        <span>Assets 100% Backed & Audited</span>
                    </div>
                </div>
                {/* Decorative circle */}
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full border-[20px] border-white/10 dark:border-black/10"></div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Available Vaults</h3>
                    <button className="text-black dark:text-white bg-gray-100 dark:bg-neutral-800 p-2 rounded-full">
                        <Plus size={18} />
                    </button>
                </div>
                
                {isInternational ? (
                    <>
                        <VaultItem name="USDC Core" apy="5.2%" color="bg-blue-500 text-blue-500" />
                        <VaultItem name="Ethereum" apy="3.8%" color="bg-purple-500 text-purple-500" balance="0.45 ETH" />
                        <VaultItem name="Bitcoin" apy="1.5%" color="bg-orange-500 text-orange-500" />
                    </>
                ) : (
                    <>
                        <VaultItem name="Nifty 50" apy="12.5%" color="bg-blue-500 text-blue-500" />
                        <VaultItem name="Digital Gold" apy="2.5%" color="bg-yellow-500 text-yellow-500" balance="1.2g" />
                        <VaultItem name="Liquid Pot" apy="6.8%" color="bg-teal-500 text-teal-500" />
                    </>
                )}
            </div>
        </div>
    );
};

export default YieldScreen;