import React from 'react';
import mockBillers from '../data/mock-billers.json';
import { useAppContext } from '../context/AppContext';

const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-neutral-800 mr-4 flex items-center justify-center text-slate-600 dark:text-slate-300">
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

const PayScreen: React.FC = () => {
    const { userMode } = useAppContext();
    const isIndiaMode = userMode === 'INDIA';

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-3xl font-bold text-black dark:text-white">Pay</h1>
            
            {isIndiaMode && (
                <div className="space-y-4">
                    <button className="w-full bg-slate-900 dark:bg-neutral-800 text-white p-6 rounded-xl flex flex-col items-center justify-center text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16" />
                             <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h1M4 10h1M4 14h1M4 18h1M19 6h1M19 10h1M19 14h1M19 18h1M6 4h1M10 4h1M14 4h1M18 4h1M6 19h1M10 19h1M14 19h1M18 19h1" />
                             <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m0 14v1m8-9h-1M5 12H4m14.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                        </svg>
                        <span className="font-bold">Scan any QR</span>
                    </button>
                    <div className="flex items-center">
                         <input
                            type="text"
                            placeholder="Enter UPI ID or phone number"
                            className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black dark:text-white"
                          />
                          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-r-lg">Pay</button>
                    </div>
                </div>
            )}

            <div>
                <h2 className="text-xl font-bold text-black dark:text-white mb-4">Pay Bills</h2>
                <div className="space-y-3">
                    {mockBillers.categories.map(category => (
                        <div key={category.name} className="bg-slate-50 dark:bg-neutral-900 p-3 rounded-lg flex items-center justify-between hover:bg-slate-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors">
                            <div className="flex items-center">
                                <CategoryIcon name={category.name} />
                                <span className="font-semibold text-black dark:text-white">{category.name}</span>
                            </div>
                            <svg className="w-5 h-5 text-neutral-400 dark:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PayScreen;