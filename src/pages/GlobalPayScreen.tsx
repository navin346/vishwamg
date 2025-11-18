import React from 'react';
import { Smartphone, Plane, CreditCard, Zap, ArrowLeft } from 'lucide-react';

interface GlobalPayScreenProps {
    onBack?: () => void;
}

const ServiceCard: React.FC<{ icon: React.ReactNode, label: string, desc: string, gradient: string }> = ({ icon, label, desc, gradient }) => (
    <button className="w-full bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-3xl p-5 flex items-center gap-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all group text-left shadow-sm active:scale-[0.98]">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${gradient} group-hover:scale-105 transition-transform duration-300`}>
            {icon}
        </div>
        <div>
            <p className="font-bold text-gray-900 dark:text-white text-lg tracking-tight">{label}</p>
            <p className="text-sm text-gray-500 dark:text-neutral-400 mt-0.5">{desc}</p>
        </div>
    </button>
)

const GlobalPayScreen: React.FC<GlobalPayScreenProps> = ({ onBack }) => {
    return (
        <div className="p-5 space-y-6 min-h-full bg-gray-50 dark:bg-black transition-colors duration-300">
             <div className="flex items-center gap-3 pt-2">
                {onBack && (
                    <button onClick={onBack} className="p-2 rounded-full bg-gray-200 dark:bg-neutral-800 text-gray-600 dark:text-white hover:bg-gray-300 dark:hover:bg-neutral-700 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                )}
                <div className="space-y-0.5">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Global Lifestyle</h1>
                    <p className="text-xs text-gray-500 dark:text-neutral-400 font-medium uppercase tracking-wider">Tools for the international citizen</p>
                </div>
            </div>

            <div className="grid gap-4 mt-4">
                <ServiceCard 
                    icon={<Smartphone size={26} />}
                    label="Get Int'l eSIM"
                    desc="Data in 190+ countries via Airalo"
                    gradient="bg-gradient-to-br from-sky-500 to-indigo-600"
                />
                <ServiceCard 
                    icon={<Plane size={26} />}
                    label="Travel Bookings"
                    desc="Flights & Hotels with 5% cashback"
                    gradient="bg-gradient-to-br from-amber-500 to-orange-600"
                />
                <ServiceCard 
                    icon={<Zap size={26} />}
                    label="Subscriptions"
                    desc="Manage Netflix, Spotify & more"
                    gradient="bg-gradient-to-br from-emerald-500 to-green-600"
                />
                <ServiceCard 
                    icon={<CreditCard size={26} />}
                    label="Forex Card"
                    desc="Order a physical card"
                    gradient="bg-gradient-to-br from-pink-500 to-rose-600"
                />
            </div>
            
            {/* Promo Banner */}
            <div className="mt-8 relative overflow-hidden rounded-3xl p-6 bg-indigo-600 dark:bg-neutral-900 border border-indigo-500/20 dark:border-white/10">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                <p className="text-indigo-100 dark:text-neutral-400 text-xs font-bold uppercase tracking-wider mb-2">Coming Soon</p>
                <h3 className="text-white text-xl font-bold mb-1">Concierge Service</h3>
                <p className="text-indigo-100 dark:text-neutral-400 text-sm opacity-80">24/7 travel and lifestyle assistance for premium members.</p>
            </div>
        </div>
    );
};

export default GlobalPayScreen;