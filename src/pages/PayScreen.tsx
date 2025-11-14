import React from 'react';
import mockBillers from '../data/mock-billers.json';

const PayScreen: React.FC = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Pay Bills</h1>
            <div className="space-y-2">
                {mockBillers.categories.map(category => (
                    <div key={category.name} className="bg-neutral-900 p-4 rounded-lg flex items-center justify-between hover:bg-neutral-800 cursor-pointer">
                        <div className="flex items-center">
                            <div className="text-2xl mr-4">{category.icon}</div>
                            <span className="font-semibold">{category.name}</span>
                        </div>
                        <svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PayScreen;
