import React, { useState } from 'react';
import { useAppContext } from '@/src/context/AppContext';
import { FirebaseError } from 'firebase/app';

const LoginScreen: React.FC = () => {
  const { signUp, signIn } = useAppContext();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      // On success, the onAuthStateChanged listener in context will handle navigation
    } catch (err) {
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
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">VISHWAM</h1>
        <p className="text-gray-500 dark:text-neutral-400 mb-12">{isSignUp ? "Create your account" : "The future of finance, simplified."}</p>
        
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 bg-gray-100 dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
            aria-label="Email address"
            required
          />
           <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-3 bg-gray-100 dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
            aria-label="Password"
            required
            minLength={6}
          />
          {error && <p className="text-red-500 text-sm text-left">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform active:scale-95 disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : (isSignUp ? "Sign Up" : "Sign In")}
          </button>
        </form>
        
        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-6">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <button onClick={() => { setIsSignUp(!isSignUp); setError(null); }} className="font-semibold text-indigo-500 hover:underline ml-1">
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>

      </div>
    </div>
  );
};

export default LoginScreen;