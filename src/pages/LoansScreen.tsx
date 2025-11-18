import React from 'react';
import { ArrowLeft, Landmark } from 'lucide-react';

interface LoansScreenProps {
    onBack?: () => void;
}

const LoansScreen: React.FC<LoansScreenProps> = ({ onBack }) => {
    return (
        <div className="p-5 space-y-6 min-h-full bg-gray-50 dark:bg-black flex flex-col">
             <div className="flex items-center gap-3">
                {onBack && (
                    <button onClick={onBack} className="p-2 rounded-full bg-gray-200 dark:bg-neutral-800 text-gray-600 dark:text-white">
                        <ArrowLeft size={20} />
                    </button>
                )}
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Credit Line</h1>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-6 text-orange-600 dark:text-orange-500">
                    <Landmark size={40} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Instant Credit Coming Soon</h2>
                <p className="text-gray-500 dark:text-neutral-400 max-w-xs">
                    Get credit against your crypto assets or bank deposits instantly. No paperwork required.
                </p>
                <button onClick={onBack} className="mt-8 bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-bold text-sm">
                    Notify Me
                </button>
            </div>
        </div>
    );
};

export default LoansScreen;