import React from 'react';
import { useAppContext } from '@/src/context/AppContext';

interface KycStartScreenProps {
  onSuccess: () => void;
}

const KycStartScreen: React.FC<KycStartScreenProps> = ({ onSuccess }) => {
  const { setAuthFlow } = useAppContext();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-between p-6">
        <div className="w-full max-w-sm text-left mt-24">
             {/* Add a close button to cancel KYC and go back to app */}
             <button 
                onClick={() => setAuthFlow('loggedIn')} 
                className="absolute top-4 right-4 text-neutral-500 hover:text-white p-2 rounded-full"
                aria-label="Close KYC"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>

             <h1 className="text-3xl font-bold mb-2">Verify your identity</h1>
             <p className="text-neutral-400 mb-12">It will only take 2 minutes</p>

             <div className="space-y-6">
                <div className="flex items-start">
                    <div className="w-10 h-10 flex-shrink-0 bg-neutral-800 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-6 0h6" /></svg>
                    </div>
                    <div>
                        <p className="font-semibold">Identity document</p>
                        <p className="text-sm text-neutral-400">Take a photo of your ID</p>
                    </div>
                </div>
                 <div className="flex items-start">
                    <div className="w-10 h-10 flex-shrink-0 bg-neutral-800 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <div>
                        <p className="font-semibold">Selfie</p>
                        <p className="text-sm text-neutral-400">Take a selfie</p>
                    </div>
                </div>
             </div>
        </div>

        <div className="w-full max-w-sm">
             <button
                onClick={onSuccess} // This will now setAuthFlow('kycForm')
                className="w-full bg-white text-black font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Continue
            </button>
      </div>
    </div>
  );
};

export default KycStartScreen;