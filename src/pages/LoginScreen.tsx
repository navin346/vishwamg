import React, { useState } from 'react';
import { useAppContext } from '@/src/context/AppContext';
import { FirebaseError } from 'firebase/app';
import { triggerHaptic } from '@/src/utils/haptics';
import { Smartphone, Mail, ArrowRight, Lock } from 'lucide-react';

const LoginScreen: React.FC = () => {
  const { signUp, signIn } = useAppContext();
  const [authMethod, setAuthMethod] = useState<'email' | 'mobile'>('mobile');
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = () => {
      if (mobile.length < 10) {
          setError("Please enter a valid mobile number");
          return;
      }
      setLoading(true);
      triggerHaptic('medium');
      // Simulate API call
      setTimeout(() => {
          setLoading(false);
          setShowOtpInput(true);
          setError(null);
      }, 1500);
  };

  const handleVerifyOtp = async () => {
      if (otp === '12345') {
          setLoading(true);
          triggerHaptic('success');
          const dummyEmail = `${mobile}@vishwam.demo`;
          const dummyPass = "password123"; 
          try {
            await signIn(dummyEmail, dummyPass);
          } catch (e) {
             await signUp(dummyEmail, dummyPass);
          }
      } else {
          triggerHaptic('error');
          setError("Invalid OTP. Use 12345");
      }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    triggerHaptic('medium');
    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      triggerHaptic('success');
    } catch (err) {
      triggerHaptic('error');
      if (err instanceof FirebaseError) {
        setError(err.message.replace('Firebase: ', ''));
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative bg-black">
      
      {/* Minimal decorative background element */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        <div className="mb-10 text-center">
             <div className="w-20 h-20 bg-white rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/20">
                <span className="text-4xl font-extrabold text-black tracking-tighter">V</span>
             </div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Welcome</h1>
            <p className="text-neutral-400 font-medium">Sign in to your financial hub.</p>
        </div>

        {/* Toggle Auth Method */}
        <div className="flex bg-neutral-900 p-1.5 rounded-xl mb-8 border border-neutral-800">
            <button 
                onClick={() => { setAuthMethod('mobile'); setError(null); setShowOtpInput(false); triggerHaptic('light'); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${authMethod === 'mobile' ? 'bg-white text-black shadow-lg' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
                <Smartphone size={18} /> Mobile
            </button>
            <button 
                onClick={() => { setAuthMethod('email'); setError(null); triggerHaptic('light'); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${authMethod === 'email' ? 'bg-white text-black shadow-lg' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
                <Mail size={18} /> Email
            </button>
        </div>
        
        {authMethod === 'mobile' ? (
            <div className="space-y-4">
                {!showOtpInput ? (
                    <div className="space-y-4">
                        <div className="relative group">
                            <span className="absolute left-4 top-4 text-neutral-400 border-r border-neutral-700 pr-3 pointer-events-none">+91</span>
                            <input
                                type="tel"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                placeholder="98765 43210"
                                className="w-full pl-16 pr-4 py-4 bg-neutral-900 border border-neutral-800 rounded-2xl focus:outline-none focus:border-white/50 text-white placeholder-neutral-600 font-mono text-lg transition-all"
                            />
                        </div>
                         <button
                            onClick={handleSendOtp}
                            disabled={loading}
                            className="w-full bg-white hover:bg-gray-200 text-black font-bold py-4 rounded-2xl transition-transform transform active:scale-95 flex items-center justify-center gap-2 text-lg"
                        >
                            {loading ? <span className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"/> : <>Get OTP <ArrowRight size={20}/></>}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-5 animate-in slide-in-from-right">
                        <div className="text-center">
                             <p className="text-neutral-400 text-sm">Code sent to <span className="text-white font-mono">+91 {mobile}</span></p>
                        </div>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="• • • • •"
                            maxLength={5}
                            className="w-full text-center py-4 bg-neutral-900 border border-neutral-800 rounded-2xl focus:outline-none focus:border-indigo-500 text-white tracking-[1.5em] font-mono text-2xl"
                        />
                        <button
                            onClick={handleVerifyOtp}
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-transform transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 text-lg"
                        >
                             {loading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"/> : "Verify & Login"}
                        </button>
                         <button onClick={() => setShowOtpInput(false)} className="w-full text-xs text-neutral-500 hover:text-white uppercase tracking-wider font-bold mt-2">Change Number</button>
                    </div>
                )}
            </div>
        ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full px-5 py-4 bg-neutral-900 border border-neutral-800 rounded-2xl focus:outline-none focus:border-white/50 text-white placeholder-neutral-600 transition-all"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-5 py-4 bg-neutral-900 border border-neutral-800 rounded-2xl focus:outline-none focus:border-white/50 text-white placeholder-neutral-600 transition-all"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white hover:bg-gray-200 text-black font-bold py-4 rounded-2xl transition-transform transform active:scale-95 flex items-center justify-center gap-2 text-lg"
                >
                     {loading ? "Processing..." : (isSignUp ? "Create Account" : "Sign In")}
                </button>
                <p className="text-center text-sm text-neutral-500 mt-6">
                    {isSignUp ? "Existing user?" : "New here?"}
                    <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-white font-bold ml-2 hover:underline">
                        {isSignUp ? "Sign In" : "Sign Up"}
                    </button>
                </p>
            </form>
        )}
        
        {error && <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center font-medium">{error}</div>}

      </div>
      
      <div className="absolute bottom-8 flex items-center gap-2 opacity-30">
        <Lock size={12} className="text-white" />
        <p className="text-[10px] text-white uppercase tracking-widest">End-to-End Encrypted</p>
      </div>
    </div>
  );
};

export default LoginScreen;