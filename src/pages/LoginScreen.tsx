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
          // In a real app, verify OTP then sign in with custom token
          // For this demo, we'll create a dummy email based on phone to use firebase auth
          const dummyEmail = `${mobile}@vishwam.demo`;
          const dummyPass = "password123"; 
          try {
            await signIn(dummyEmail, dummyPass);
          } catch (e) {
             // If sign in fails, try sign up (first time user)
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      <div className="w-full max-w-sm relative z-10 bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 p-8 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
             <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
                <span className="text-3xl font-bold text-white">V</span>
             </div>
            <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">Vishwam</h1>
            <p className="text-gray-300 text-sm">Financial operating system for the future.</p>
        </div>

        {/* Toggle Auth Method */}
        <div className="flex bg-black/20 p-1 rounded-xl mb-6">
            <button 
                onClick={() => { setAuthMethod('mobile'); setError(null); setShowOtpInput(false); triggerHaptic('light'); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${authMethod === 'mobile' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
                <Smartphone size={16} /> Mobile
            </button>
            <button 
                onClick={() => { setAuthMethod('email'); setError(null); triggerHaptic('light'); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${authMethod === 'email' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
                <Mail size={16} /> Email
            </button>
        </div>
        
        {authMethod === 'mobile' ? (
            <div className="space-y-4">
                {!showOtpInput ? (
                    <div className="space-y-4">
                        <div className="relative">
                            <span className="absolute left-4 top-3.5 text-gray-400 border-r border-gray-600 pr-3">+91</span>
                            <input
                                type="tel"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                placeholder="98765 43210"
                                className="w-full pl-16 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 text-white placeholder-gray-500 font-mono text-lg"
                            />
                        </div>
                         <button
                            onClick={handleSendOtp}
                            disabled={loading}
                            className="w-full bg-white hover:bg-gray-100 text-black font-bold py-3 px-4 rounded-xl transition-transform transform active:scale-95 flex items-center justify-center gap-2"
                        >
                            {loading ? <span className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"/> : <>Get OTP <ArrowRight size={18}/></>}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in slide-in-from-right">
                        <div className="text-center mb-2">
                             <p className="text-gray-400 text-sm">Enter OTP sent to +91 {mobile}</p>
                        </div>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="• • • • •"
                            maxLength={5}
                            className="w-full text-center py-3 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 text-white tracking-[1em] font-mono text-xl"
                        />
                        <button
                            onClick={handleVerifyOtp}
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl transition-transform transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30"
                        >
                             {loading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"/> : "Verify & Login"}
                        </button>
                         <button onClick={() => setShowOtpInput(false)} className="w-full text-xs text-gray-400 hover:text-white">Change Number</button>
                    </div>
                )}
            </div>
        ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 text-white placeholder-gray-500"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 text-white placeholder-gray-500"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white hover:bg-gray-100 text-black font-bold py-3 px-4 rounded-xl transition-transform transform active:scale-95 flex items-center justify-center gap-2"
                >
                     {loading ? "Processing..." : (isSignUp ? "Create Account" : "Sign In")}
                </button>
                <p className="text-center text-sm text-gray-400 mt-4">
                    {isSignUp ? "Existing user?" : "New here?"}
                    <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-indigo-400 font-bold ml-1 hover:text-indigo-300">
                        {isSignUp ? "Sign In" : "Sign Up"}
                    </button>
                </p>
            </form>
        )}
        
        {error && <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">{error}</div>}

      </div>
      
      <p className="absolute bottom-6 text-xs text-gray-500/50">Secured by Vishwam Identity™</p>
    </div>
  );
};

export default LoginScreen;