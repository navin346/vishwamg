import React, { useState } from 'react';
import { useAppContext } from '@/src/context/AppContext';
import { FirebaseError } from 'firebase/app';
import { triggerHaptic } from '@/src/utils/haptics';
import { ArrowRight, Lock, Sparkles, Shield, Compass } from 'lucide-react';
import BackgroundMesh from '@/src/components/BackgroundMesh';

const LoginScreen: React.FC = () => {
  const { signUp, signIn } = useAppContext();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // High-fidelity prefilled demo credentials for instantaneous entry
  const dummyEmail = 'demo@vishwam.io';
  const dummyPass = 'password123';

  const handleInstantSignIn = async () => {
    setError(null);
    setLoading(true);
    triggerHaptic('medium');

    try {
      // 1. Try logging in first
      await signIn(dummyEmail, dummyPass);
      triggerHaptic('success');
    } catch (err: any) {
      // 2. If dummy user doesn't exist yet, automatically register them!
      try {
        await signUp(dummyEmail, dummyPass);
        triggerHaptic('success');
      } catch (signUpErr: any) {
        if (signUpErr instanceof FirebaseError) {
          setError(signUpErr.message.replace('Firebase: ', ''));
        } else {
          setError("An unexpected error occurred during demo initialization.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-between p-6 relative select-none overflow-y-auto scrollbar-hide">
      <BackgroundMesh />
      
      {/* Top spacing */}
      <div className="h-4" />

      {/* Main Content Container */}
      <div className="w-full max-w-sm relative z-10 flex flex-col items-center">
        
        {/* Animated App Icon Module */}
        <div className="relative mb-6 group">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500 opacity-40 blur group-hover:opacity-70 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          <div className="relative w-20 h-20 bg-white rounded-3xl flex items-center justify-center border border-gray-100 shadow-md">
             <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-violet-600 to-indigo-600 tracking-tighter">V</span>
          </div>
        </div>

        {/* Title and App Brand */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight bg-clip-text bg-gradient-to-tr from-gray-950 via-indigo-950 to-gray-950">Vishwam</h1>
          <p className="text-gray-500 font-medium text-sm px-6">
            A secure financial super-app for global ledger bookkeeping and instant payments.
          </p>
          
          {/* Active Demo Mode Pill */}
          <div className="inline-flex items-center gap-1.5 mt-3.5 px-3 py-1 rounded-full text-[10px] font-bold bg-violet-100 text-violet-700 border border-violet-200 uppercase tracking-widest">
             <Sparkles size={10} className="text-violet-600 animate-pulse" /> Sandbox Mode Active
          </div>
        </div>

        {/* Info Card / Feature Highlights */}
        <div className="w-full bg-white/70 backdrop-blur-md border border-gray-100/80 rounded-2xl p-5 mb-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Compass size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-850 uppercase tracking-wider">Multi-Currency Rails</h4>
              <p className="text-[11px] text-gray-500 font-medium">Supports virtual cards and international settlements.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
            <div className="p-2 rounded-xl bg-pink-50 text-pink-600 border border-pink-100">
              <Shield size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-850 uppercase tracking-wider">Biometric & Haptic Vault</h4>
              <p className="text-[11px] text-gray-500 font-medium">Pristine client experience with rich feedback.</p>
            </div>
          </div>
        </div>

        {/* Instant Access Button */}
        <div className="w-full space-y-4">
          <button
              onClick={handleInstantSignIn}
              disabled={loading}
              className="relative w-full overflow-hidden group bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-gray-300 disabled:to-gray-400 text-white font-extrabold py-4 rounded-2xl transition-all transform active:scale-98 flex items-center justify-center gap-2 text-md shadow-lg shadow-violet-600/10 cursor-pointer"
          >
              {loading ? (
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                  <>
                    <span>Launch Super-App Applet</span>
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </>
              )}
          </button>
          
          <p className="text-center text-[10px] text-gray-400 font-bold tracking-wider uppercase">
            No registration, phone, or OTP required to explore.
          </p>
        </div>

        {error && (
          <div className="w-full mt-4 p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-650 text-xs text-center font-bold">
            {error}
          </div>
        )}

      </div>

      {/* Premium footer stamp */}
      <div className="flex items-center gap-2 opacity-50 mt-6">
        <Lock size={12} className="text-gray-400" />
        <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Secure Demo Environment</p>
      </div>
    </div>
  );
};

export default LoginScreen;
