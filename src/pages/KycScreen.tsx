import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

interface ModalProps {
    onClose: () => void;
}


// Helper components for each step
const Step1 = () => (
    <div className="p-6 space-y-4">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Personal Details</h3>
        <p className="text-sm text-gray-500 dark:text-neutral-400">Please enter your information exactly as it appears on your official documents.</p>
        <div>
            <label htmlFor="fullName" className="text-xs font-medium text-gray-700 dark:text-neutral-300">Full Name</label>
            <input id="fullName" type="text" placeholder="J. Doe" className="w-full mt-1 px-3 py-2 bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500 text-gray-900 dark:text-white" />
        </div>
        <div>
            <label htmlFor="dob" className="text-xs font-medium text-gray-700 dark:text-neutral-300">Date of Birth</label>
            <input id="dob" type="date" className="w-full mt-1 px-3 py-2 bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500 text-gray-900 dark:text-white" />
        </div>
        <div>
            <label htmlFor="address" className="text-xs font-medium text-gray-700 dark:text-neutral-300">Residential Address</label>
            <input id="address" type="text" placeholder="123 Main St, Anytown, USA" className="w-full mt-1 px-3 py-2 bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500 text-gray-900 dark:text-white" />
        </div>
    </div>
);

const Step2 = () => (
     <div className="p-6">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Upload Government ID</h3>
        <p className="text-sm text-gray-500 dark:text-neutral-400 mb-6">Please upload a clear photo of your passport or driver's license.</p>
        <div className="w-full aspect-video bg-gray-100 dark:bg-slate-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600 flex flex-col items-center justify-center text-gray-500 dark:text-slate-400">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <p className="font-semibold">Tap to open camera</p>
            <p className="text-xs">or browse files</p>
        </div>
    </div>
);


const Step3 = () => (
    <div className="p-6 text-center">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Liveness Check</h3>
        <p className="text-sm text-gray-500 dark:text-neutral-400 mb-6">Please position your face within the frame and follow the on-screen instructions.</p>
        <div className="w-48 h-48 mx-auto bg-gray-200 dark:bg-slate-800 rounded-full border-4 border-gray-300 dark:border-slate-600 flex items-center justify-center mb-6">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        </div>
        <p className="font-semibold text-violet-500">Look straight ahead</p>
    </div>
);


const KycScreen: React.FC<ModalProps> = ({ onClose }) => {
    const { startKyc } = useAppContext();
    const [step, setStep] = useState(1);

    const totalSteps = 3;

    const handleNext = () => {
        if (step < totalSteps) {
            setStep(s => s + 1);
        } else {
            // Final step
            startKyc();
            onClose();
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(s => s - 1);
        }
    };
    
    const renderStepContent = () => {
        switch (step) {
            case 1: return <Step1 />;
            case 2: return <Step2 />;
            case 3: return <Step3 />;
            default: return null;
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center">
            <div className="w-full max-w-md h-[90vh] bg-white dark:bg-slate-900 rounded-t-2xl shadow-xl flex flex-col animate-slide-up">
                <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex items-center">
                    {step > 1 && (
                         <button onClick={handleBack} className="text-gray-500 dark:text-neutral-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                         </button>
                    )}
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mx-auto">Identity Verification</h2>
                     <button onClick={onClose} className="text-gray-500 dark:text-neutral-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                {/* Progress Bar */}
                <div className="p-4">
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5">
                        <div className="bg-violet-600 h-1.5 rounded-full" style={{ width: `${(step / totalSteps) * 100}%`, transition: 'width 0.3s ease-in-out' }}></div>
                    </div>
                </div>

                {/* Step Content */}
                <div className="flex-grow overflow-y-auto">
                    {renderStepContent()}
                </div>

                {/* Action Button */}
                <div className="p-4 border-t border-gray-200 dark:border-slate-800">
                    <button
                        onClick={handleNext}
                        className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform active:scale-95"
                    >
                        {step === totalSteps ? 'Finish Verification' : 'Continue'}
                    </button>
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

export default KycScreen;