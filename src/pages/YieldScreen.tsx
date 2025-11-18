import React from 'react';
import { ArrowUpRight, Info } from 'lucide-react';

const VaultItem: React.FC<{ name: string, protocol: string, apy: string, tvl: string, risk: 'Low' | 'Med' | 'High' }> = ({ name, protocol, apy, tvl, risk }) => (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors cursor-pointer">
        <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                    {protocol.substring(0,2).toUpperCase()}
                </div>
                <div>
                    <h3 className="font-bold text-zinc-900 dark:text-white text-sm">{name}</h3>
                    <p className="text-xs text-zinc-500">{protocol}</p>
                </div>
            </div>
            <div className="text-right">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">{apy}</span>
                <p className="text-[10px] text-zinc-400 uppercase font-bold">APY</p>
            </div>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex gap-3 text-xs">
                <div className="text-zinc-500">TVL <span className="text-zinc-900 dark:text-zinc-300 font-medium">{tvl}</span></div>
                <div className="text-zinc-500">Risk <span className={`font-medium ${risk === 'Low' ? 'text-emerald-500' : risk === 'Med' ? 'text-amber-500' : 'text-red-500'}`}>{risk}</span></div>
            </div>
            <button className="bg-zinc-900 dark:bg-white text-white dark:text-black text-xs font-bold px-3 py-1.5 rounded-lg">
                Deposit
            </button>
        </div>
    </div>
)

const YieldScreen: React.FC = () => {
    return (
        <div className="p-5 space-y-6 pb-24 bg-zinc-50 dark:bg-zinc-950 min-h-full">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Yield</h1>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">Earn passive income on your USDC.</p>
                </div>
                <button className="text-indigo-600 dark:text-indigo-400">
                    <Info size={20} />
                </button>
            </div>

            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-5 text-white shadow-lg">
                <p className="text-indigo-100 text-xs font-medium uppercase tracking-wider">Total Earnings</p>
                <h2 className="text-3xl font-bold mt-1">$42.85</h2>
                <div className="mt-4 flex gap-2">
                    <span className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-md text-xs font-medium">+ $1.24 today</span>
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider px-1">Available Vaults</h3>
                <VaultItem name="Concentrated Liquidity" protocol="Sui DeFi" apy="30.00%" tvl="$1.19M" risk="High" />
                <VaultItem name="Gamma USDC Vault" protocol="Upshift" apy="20.00%" tvl="$6.35M" risk="Med" />
                <VaultItem name="Alpine Flagship" protocol="Alpine" apy="17.50%" tvl="$716K" risk="Low" />
                <VaultItem name="Edge USDC" protocol="Edge Ultra" apy="15.00%" tvl="$1.03M" risk="Low" />
            </div>
        </div>
    );
};

export default YieldScreen;