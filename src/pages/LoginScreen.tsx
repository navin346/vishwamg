import React from 'react';

interface LoginScreenProps {
  onEmailSignIn: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onEmailSignIn }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">VISHWAM</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mb-12">The future of finance, simplified.</p>
        
        <div className="w-full">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 text-black dark:text-white"
            aria-label="Email address"
          />
          <button
            onClick={onEmailSignIn}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform active:scale-95"
          >
            Sign in with Email
          </button>
        </div>
        
        <div className="my-8 flex items-center">
          <div className="flex-grow border-t border-neutral-300 dark:border-neutral-700"></div>
          <span className="flex-shrink mx-4 text-xs uppercase text-neutral-400">OR</span>
          <div className="flex-grow border-t border-neutral-300 dark:border-neutral-700"></div>
        </div>

        <button className="w-full bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-black dark:text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
          <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.612-3.444-11.048-8.169l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,35.251,44,30.028,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;