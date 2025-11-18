import React from 'react';
import { Smartphone, Plane, CreditCard, Zap, ArrowLeft } from 'lucide-react';

interface GlobalPayScreenProps {
    onBack?: () => void;
}

const ServiceCard: React.FC<{ icon: React.ReactNode, label: string, desc: string, gradient: string }> = ({ icon, label, desc, gradient }) => (
    <button className="w-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-3xl p-5 flex items-center gap-5 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all group text-left">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${gradient} group-hover:scale-105 transition-transform`}>
            {icon}
        </div>
        <div>
            <p className="font-bold text-gray-900 dark:text-white text-lg">{label}</p>
            <p className="text-sm text-gray-500 dark:text-neutral-400 mt-0.5">{desc}</p>
        </div>
    </button>
)

const GlobalPayScreen: React.FC<GlobalPayScreenProps> = ({ onBack }) => {
    return (
        <div className="p-5 space-y-6 min-h-full bg-gray-50 dark:bg-black">
             <div className="flex items-center gap-3">
                {onBack && (
                    <button onClick={onBack} className="p-2 rounded-full bg-gray-200 dark:bg-neutral-800 text-gray-600 dark:text-white">
                        <ArrowLeft size={20} />
                    </button>
                )}
                <div className="space-y-0.5">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Global Lifestyle</h1>
                    <p className="text-xs text-gray-500 dark:text-neutral-400">Tools for the international citizen</p>
                </div>
            </div>

            <div className="grid gap-4 mt-4">
                <ServiceCard 
                    icon={<Smartphone size={28} />}
                    label="Get Int'l eSIM"
                    desc="Data in 190+ countries via Airalo"
                    gradient="bg-gradient-to-br from-sky-500 to-indigo-600"
                />
                <ServiceCard 
                    icon={<Plane size={28} />}
                    label="Travel Bookings"
                    desc="Flights & Hotels with 5% cashback"
                    gradient="bg-gradient-to-br from-amber-500 to-orange-600"
                />
                <ServiceCard 
                    icon={<Zap size={28} />}
                    label="Subscriptions"
                    desc="Manage Netflix, Spotify & more"
                    gradient="bg-gradient-to-br from-emerald-500 to-green-600"
                />
                <ServiceCard 
                    icon={<CreditCard size={28} />}
                    label="Forex Card"
                    desc="Order a physical card"
                    gradient="bg-gradient-to-br from-pink-500 to-rose-600"
                />
            </div>
        </div>
    );
};

export default GlobalPayScreen;