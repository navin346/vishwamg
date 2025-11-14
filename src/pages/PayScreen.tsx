import React from 'react';
import mockBillers from '../data/mock-billers.json';

const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-neutral-800 mr-4 flex items-center justify-center">
        {children}
    </div>
);

const CategoryIcon: React.FC<{ name: string }> = ({ name }) => {
    switch (name) {
        case 'Electricity': return <IconWrapper>💡</IconWrapper>; // Emojis are fine here as they are universally understood
        case 'Water': return <IconWrapper>💧</IconWrapper>;
        case 'Mobile Recharge': return <IconWrapper>📱</IconWrapper>;
        case 'Gas': return <IconWrapper>🔥</IconWrapper>;
        case 'Broadband': return <IconWrapper>🌐</IconWrapper>;
        case 'DTH': return <IconWrapper>📺</IconWrapper>;
        default: return <IconWrapper>🧾</IconWrapper>;
    }
};

const PayScreen: React.FC = () => {
    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6 text-black dark:text-white">Pay Bills</h1>
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
    );
};

export default PayScreen;