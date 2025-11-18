import React from 'react';
import { Smartphone, Plane, CreditCard, Zap, Globe } from 'lucide-react';

const ServiceCard: React.FC<{ icon: React.ReactNode, label: string, desc: string, gradient: string }> = ({ icon, label, desc, gradient }) => (
    <button className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all group text-left">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${gradient} group-hover:scale-105 transition-transform`}>
            {icon}
        </div>
        <div>
            <p className="font-bold text-zinc-900 dark:text-white">{label}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{desc}</p>
        </div>
    </button>
)

const GlobalPayScreen: React.FC = () => {
    return (
        <div className="p-5 space-y-6 pb-24">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Global Pay</h1>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">Essential tools for your international lifestyle.</p>
            </div>

            <div className="grid gap-4">
                <ServiceCard 
                    icon={<Smartphone size={24} />}
                    label="Get Int'l eSIM"
                    desc="Instant data worldwide via Airalo"
                    gradient="bg-gradient-to-br from-sky-500 to-indigo-600"
                />
                <ServiceCard 
                    icon={<Plane size={24} />}
                    label="Travel Bookings"
                    desc="Flights & Hotels with 5% cashback"
                    gradient="bg-gradient-to-br from-amber-500 to-orange-600"
                />
                <ServiceCard 
                    icon={<Zap size={24} />}
                    label="Subscriptions"
                    desc="Manage Netflix, Spotify & more"
                    gradient="bg-gradient-to-br from-emerald-500 to-green-600"
                />
                <ServiceCard 
                    icon={<CreditCard size={24} />}
                    label="Forex Card"
                    desc="Order a physical card"
                    gradient="bg-gradient-to-br from-pink-500 to-rose-600"
                />
            </div>
        </div>
    );
};

export default GlobalPayScreen;