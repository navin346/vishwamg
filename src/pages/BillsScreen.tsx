import React, { useState } from 'react';
import mockBillers from '../data/mock-billers.json';

interface ModalProps {
    onClose: () => void;
    onPayBiller: (billerName: string, amount: number) => void;
}

const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-neutral-800 mr-4 flex items-center justify-center text-gray-600 dark:text-slate-300">
        {children}
    </div>
);

const CategoryIcon: React.FC<{ name: string }> = ({ name }) => {
    let icon;
     switch (name) {
        case 'Electricity': icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>; break;
        case 'Water': icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2.69l5.66 5.66a8 8 0 11-11.32 0L12 2.69z" /></svg>; break;
        case 'Mobile Recharge': icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>; break;
        case 'Gas': icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c2.236 1.118 4.674 1.118 6.91 0 2-1 2.657-2.657 2.657-2.657a8 8 0 012.09 11.314" /></svg>; break;
        case 'Broadband': icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a10 10 0 0114.142 0M1.393 9.393a15 15 0 0121.214 0" /></svg>; break;
        case 'DTH': icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728M18.364 5.636a9 9 0 010 12.728M9.879 9.879a3 3 0 014.242 0M12 12v.01" /></svg>; break;
        default: icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>; break;
    }
    return <IconWrapper>{icon}</IconWrapper>;
};

const BillsScreen: React.FC<ModalProps> = ({ onClose, onPayBiller }) => {
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    const handleCategoryClick = (categoryName: string) => {
        setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
    };

    const handleBillerClick = (billerName: string) => {
        // Hardcoded mock amount as requested for the demo
        onPayBiller(billerName, 500);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-2xl p-6 shadow-xl animate-slide-up h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pay Bills</h2>
                    <button onClick={onClose} className="text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto pr-2">
                    <div className="space-y-3">
                        {mockBillers.categories.map(category => (
                            <div key={category.name}>
                                <button
                                    onClick={() => handleCategoryClick(category.name)}
                                    className="w-full bg-gray-50 dark:bg-neutral-900 p-3 rounded-lg flex items-center justify-between hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
                                >
                                    <div className="flex items-center">
                                        <CategoryIcon name={category.name} />
                                        <span className="font-semibold text-gray-900 dark:text-white">{category.name}</span>
                                    </div>
                                    <svg className={`w-5 h-5 text-neutral-400 dark:text-neutral-600 transition-transform ${expandedCategory === category.name ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </button>
                                {expandedCategory === category.name && (
                                    <div className="pl-4 pr-2 py-2 space-y-2">
                                        {category.billers.map(biller => (
                                            <button
                                                key={biller.name}
                                                onClick={() => handleBillerClick(biller.name)}
                                                className="w-full flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-left"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center font-bold text-sm mr-3 text-gray-700 dark:text-gray-200 flex-shrink-0">
                                                    {biller.logo}
                                                </div>
                                                <span className="text-gray-800 dark:text-gray-200">{biller.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes slide-up {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default BillsScreen;