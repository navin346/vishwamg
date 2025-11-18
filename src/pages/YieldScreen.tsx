import React from 'react';
import { ArrowLeft, Info } from 'lucide-react';

interface YieldScreenProps {
    onBack?: () => void;
}

const VaultItem: React.FC<{ name: string, protocol: string, apy: string, tvl: string, risk: 'Low' | 'Med' | 'High' }> = ({ name, protocol, apy, tvl, risk }) => (
    <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-4 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors cursor-pointer group">
        <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                    {protocol.substring(0,2).toUpperCase()}
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-indigo-500 transition-colors">{name}</h3>
                    <p className="text-xs text-gray-500">{protocol}</p>
                </div>
            </div>
            <div className="text-right">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">{apy}</span>
                <p className="text-[10px] text-gray-400 uppercase font-bold">APY</p>
            </div>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-neutral-800">
            <div className="flex gap-3 text-xs">
                <div className="text-gray-500">TVL <span className="text-gray-900 dark:text-gray-300 font-medium">{tvl}</span></div>
                <div className="text-gray-500">Risk <span className={`font-medium ${risk === 'Low' ? 'text-emerald-500' : risk === 'Med' ? 'text-amber-500' : 'text-red-500'}`}>{risk}</span></div>
            </div>
            <button className="bg-gray-900 dark:bg-white text-white dark:text-black text-xs font-bold px-3 py-1.5 rounded-lg">
                Deposit
            </button>
        </div>
    </div>
)

const YieldScreen: React.FC<YieldScreenProps> = ({ onBack }) => {
    return (
        <div className="p-5 space-y-6 pb-24 min-h-full bg-gray-50 dark:bg-black">
            <div className="flex items-center gap-3">
                {onBack && (
                    <button onClick={onBack} className="p-2 rounded-full bg-gray-200 dark:bg-neutral-800 text-gray-600 dark:text-white">
                        <ArrowLeft size={20} />
                    </button>
                )}
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Yield</h1>
                </div>
                <button className="text-indigo-600 dark:text-indigo-400">
                    <Info size={20} />
                </button>
            </div>

            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <p className="text-emerald-100 text-xs font-medium uppercase tracking-wider">Total Earnings</p>
                <h2 className="text-4xl font-bold mt-1 tracking-tight">$42.85</h2>
                <div className="mt-4 flex gap-2">
                    <span className="bg-black/20 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-medium">+ $1.24 today</span>
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider px-1">Available Vaults</h3>
                <VaultItem name="Concentrated Liquidity" protocol="Sui DeFi" apy="30.00%" tvl="$1.19M" risk="High" />
                <VaultItem name="Gamma USDC Vault" protocol="Upshift" apy="20.00%" tvl="$6.35M" risk="Med" />
                <VaultItem name="Alpine Flagship" protocol="Alpine" apy="17.50%" tvl="$716K" risk="Low" />
                <VaultItem name="Edge USDC" protocol="Edge Ultra" apy="15.00%" tvl="$1.03M" risk="Low" />
            </div>
        </div>
    );
};

export default YieldScreen;