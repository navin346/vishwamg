import React from 'react';
import { useAppContext } from '@/src/context/AppContext';
import BackgroundMesh from '@/src/components/BackgroundMesh';

interface KycStartScreenProps {
  onSuccess: () => void;
}

const KycStartScreen: React.FC<KycStartScreenProps> = ({ onSuccess }) => {
  const { setAuthFlow } = useAppContext();

  return (
    <div className="h-full w-full flex flex-col p-6 relative overflow-hidden select-none text-gray-900">
      <BackgroundMesh />
      
      {/* Close Button */}
      <button 
         onClick={() => setAuthFlow('loggedIn')} 
         className="absolute top-6 right-6 z-20 text-gray-400 hover:text-gray-700 p-2.5 rounded-full bg-white/80 backdrop-blur-md border border-gray-100 shadow-sm transition-transform active:scale-90"
         aria-label="Close KYC"
      >
         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full relative z-10">
           <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center border border-violet-100 mb-6 shadow-sm">
             <svg className="w-8 h-8 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
             </svg>
           </div>
           
           <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Verify Identity</h1>
           <p className="text-gray-500 font-semibold text-sm mb-8">Secure your dynamic international payment vault in just 2 minutes.</p>

           <div className="space-y-4">
              <div className="flex items-center p-4 bg-white/80 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="w-12 h-12 flex-shrink-0 bg-violet-50 rounded-xl flex items-center justify-center mr-4 text-violet-600 border border-violet-100">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-6 0h6" /></svg>
                  </div>
                  <div>
                      <p className="font-bold text-gray-900 text-sm">Identity Document</p>
                      <p className="text-xs text-gray-500 font-medium">PAN Card, Aadhaar, or Passport</p>
                  </div>
              </div>
              
              <div className="flex items-center p-4 bg-white/80 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="w-12 h-12 flex-shrink-0 bg-pink-50 rounded-xl flex items-center justify-center mr-4 text-pink-600 border border-pink-100">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <div>
                      <p className="font-bold text-gray-900 text-sm">Aesthetic Selfie</p>
                      <p className="text-xs text-gray-500 font-medium">Instantly processed biometric matches</p>
                  </div>
              </div>
           </div>
      </div>

      <div className="w-full max-w-sm mx-auto pb-4 relative z-10 mt-6">
           <button
              onClick={onSuccess}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-4 px-4 rounded-2xl transition-all transform active:scale-98 text-md shadow-md cursor-pointer"
            >
              Start Verification
          </button>
          <p className="text-center text-[10px] text-gray-450 font-semibold mt-3 uppercase tracking-wider">Secure AES-256 data processing</p>
     </div>
    </div>
  );
};

export default KycStartScreen;
