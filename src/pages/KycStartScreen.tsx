import React from 'react';
import { useAppContext } from '@/src/context/AppContext';

interface KycStartScreenProps {
  onSuccess: () => void;
}

const KycStartScreen: React.FC<KycStartScreenProps> = ({ onSuccess }) => {
  const { setAuthFlow } = useAppContext();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col p-6 relative overflow-hidden">
         {/* Close Button */}
         <button 
            onClick={() => setAuthFlow('loggedIn')} 
            className="absolute top-6 right-6 z-20 text-neutral-500 hover:text-white p-2 rounded-full bg-neutral-900/50 backdrop-blur-md"
            aria-label="Close KYC"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
         </button>

        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
             <h1 className="text-3xl font-bold mb-2">Verify your identity</h1>
             <p className="text-neutral-400 mb-12">It will only take 2 minutes to setup your account securely.</p>

             <div className="space-y-6">
                <div className="flex items-center p-4 bg-neutral-900 rounded-2xl border border-neutral-800">
                    <div className="w-12 h-12 flex-shrink-0 bg-neutral-800 rounded-xl flex items-center justify-center mr-4 text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-6 0h6" /></svg>
                    </div>
                    <div>
                        <p className="font-bold">Identity document</p>
                        <p className="text-sm text-neutral-400">PAN Card, Aadhaar or Passport</p>
                    </div>
                </div>
                 <div className="flex items-center p-4 bg-neutral-900 rounded-2xl border border-neutral-800">
                    <div className="w-12 h-12 flex-shrink-0 bg-neutral-800 rounded-xl flex items-center justify-center mr-4 text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <div>
                        <p className="font-bold">Selfie</p>
                        <p className="text-sm text-neutral-400">To match with your ID</p>
                    </div>
                </div>
             </div>
        </div>

        <div className="w-full max-w-sm mx-auto pb-6">
             <button
                onClick={onSuccess}
                className="w-full bg-white text-black font-bold py-4 px-4 rounded-2xl transition-transform active:scale-95 text-lg shadow-lg shadow-white/10"
              >
                Continue
            </button>
            <p className="text-center text-xs text-neutral-500 mt-4">By continuing, you agree to our Terms & Privacy Policy.</p>
      </div>
    </div>
  );
};

export default KycStartScreen;