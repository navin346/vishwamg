import React, { useState } from 'react';
import { useAppContext } from '@/src/context/AppContext';
import { FirebaseError } from 'firebase/app';
import { triggerHaptic } from '@/src/utils/haptics';
import { ArrowRight, Lock, Sparkles, Shield, Compass, Landmark } from 'lucide-react';

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
      } catch (signUpErr) {
        triggerHaptic('error');
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
    <div className="min-h-screen flex flex-col items-center justify-between p-6 relative bg-black select-none">
      
      {/* Aesthetic glowing background orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top spacing */}
      <div className="h-4" />

      {/* Main Content Container */}
      <div className="w-full max-w-sm relative z-10 flex flex-col items-center">
        
        {/* Animated App Icon Module */}
        <div className="relative mb-8 group">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-500 to-pink-500 opacity-30 blur group-hover:opacity-55 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          <div className="relative w-24 h-24 bg-neutral-900 rounded-3xl flex items-center justify-center border border-neutral-800">
             <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-white to-neutral-400 tracking-tighter">V</span>
          </div>
        </div>

        {/* Title and App Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Vishwam</h1>
          <p className="text-neutral-400 font-medium text-sm px-6">
            A secure financial super-app for global ledger bookkeeping and instant payments.
          </p>
          
          {/* Active Demo Mode Pill */}
          <div className="inline-flex items-center gap-1.5 mt-4 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 uppercase tracking-widest">
             <Sparkles size={10} className="text-emerald-400 animate-pulse" /> Sandbox Mode Active
          </div>
        </div>

        {/* Info Card / Feature Highlights */}
        <div className="w-full bg-neutral-900/60 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-5 mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/10 text-indigo-400">
              <Compass size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Multi-Currency Rails</h4>
              <p className="text-[11px] text-neutral-400">Supports virtual cards and international settlements.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-neutral-800/50 pt-4">
            <div className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/10 text-pink-400">
              <Shield size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Biometric & Haptic Vault</h4>
              <p className="text-[11px] text-neutral-400">Pristine client experience with rich feedback.</p>
            </div>
          </div>
        </div>

        {/* Instant Access Button */}
        <div className="w-full space-y-4">
          <button
              onClick={handleInstantSignIn}
              disabled={loading}
              className="relative w-full overflow-hidden group bg-white hover:bg-neutral-100 disabled:bg-neutral-800 disabled:text-neutral-500 text-black font-extrabold py-4.5 rounded-2xl transition-transform transform active:scale-98 flex items-center justify-center gap-2 text-lg shadow-xl shadow-white/5 cursor-pointer"
          >
              {loading ? (
                  <span className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full" />
              ) : (
                  <>
                    <span>Launch Super-App Applet</span>
                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                  </>
              )}
          </button>
          
          <p className="text-center text-[10px] text-neutral-500 font-semibold tracking-wider uppercase">
            No registration, phone, or OTP required to explore.
          </p>
        </div>

        {error && (
          <div className="w-full mt-4 p-3.5 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-xs text-center font-semibold">
            {error}
          </div>
        )}

      </div>

      {/* Premium footer stamp */}
      <div className="flex items-center gap-2 opacity-30 mt-8">
        <Lock size={12} className="text-white" />
        <p className="text-[9px] text-white uppercase tracking-widest font-semibold">Secure Demo Environment</p>
      </div>
    </div>
  );
};

export default LoginScreen;