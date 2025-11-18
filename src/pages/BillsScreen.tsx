import React from 'react';
import mockBillers from '@/src/data/mock-billers.json';
import ServiceIcon from '@/src/components/ServiceIcon';
import { ArrowLeft } from 'lucide-react';

interface BillsScreenProps {
    onPayBiller: (billerName: string, amount: number) => void;
    onBack?: () => void;
}

const CategoryIcon: React.FC<{ name: string }> = ({ name }) => {
    let icon;
     switch (name) {
        case 'Electricity': icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>; break;
        case 'Water': icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2.69l5.66 5.66a8 8 0 11-11.32 0L12 2.69z" /></svg>; break;
        case 'Mobile Recharge': icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>; break;
        case 'Gas': icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c2.236 1.118 4.674 1.118 6.91 0 2-1 2.657-2.657 2.657-2.657a8 8 0 012.09 11.314" /></svg>; break;
        case 'Broadband': icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a10 10 0 0114.142 0M1.393 9.393a15 15 0 0121.214 0" /></svg>; break;
        case 'DTH': icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728M18.364 5.636a9 9 0 010 12.728M9.879 9.879a3 3 0 014.242 0M12 12v.01" /></svg>; break;
        default: icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>; break;
    }
    return icon;
};

const COLORS = [
    "bg-gradient-to-br from-cyan-500 to-blue-500",
    "bg-gradient-to-br from-green-500 to-emerald-500",
    "bg-gradient-to-br from-amber-500 to-orange-500",
    "bg-gradient-to-br from-rose-500 to-pink-500",
    "bg-gradient-to-br from-fuchsia-500 to-purple-500",
    "bg-gradient-to-br from-teal-500 to-cyan-500",
];

const BillsScreen: React.FC<BillsScreenProps> = ({ onPayBiller, onBack }) => {
    
    const handleBillerClick = (billerName: string) => {
        onPayBiller(billerName, 500);
    };

    return (
        <div className="p-5 space-y-6 min-h-full bg-gray-50 dark:bg-black">
            <div className="flex items-center gap-3">
                {onBack && (
                    <button onClick={onBack} className="p-2 rounded-full bg-gray-200 dark:bg-neutral-800 text-gray-600 dark:text-white">
                        <ArrowLeft size={20} />
                    </button>
                )}
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bill Payments</h1>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-lg">
                <h2 className="text-xl font-bold">Bharat BillPay</h2>
                <p className="text-blue-100 text-sm mt-1 opacity-90">Safe, secure and instant payments for all your utilities.</p>
            </div>
            
            <div className="grid grid-cols-4 gap-x-2 gap-y-6 pt-2">
                {mockBillers.categories.map((category, index) => (
                    <ServiceIcon
                        key={category.name}
                        label={category.name}
                        icon={<CategoryIcon name={category.name} />}
                        color={COLORS[index % COLORS.length]}
                        onClick={() => handleBillerClick(category.billers[0].name)}
                    />
                ))}
            </div>
        </div>
    );
};

export default BillsScreen;