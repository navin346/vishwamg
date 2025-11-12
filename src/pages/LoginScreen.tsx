import React from 'react';

interface LoginScreenProps {
  onEmailSignIn: () => void;
}

// Inline SVG Icon Components
const GoogleIcon: React.FC = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.804 12.12C34.553 8.246 29.623 6 24 6C13.434 6 5 14.434 5 25s8.434 19 19 19s19-8.434 19-19c0-1.041-.122-2.052-.359-3.017l-.252.934z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039L38.804 12.12C34.553 8.246 29.623 6 24 6C16.318 6 9.656 9.736 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.549-3.455-11.01-8.168l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C39.999 36.657 44 31.134 44 25c0-1.041-.122-2.052-.359-3.017l-.252.934z" />
  </svg>
);

const XIcon: React.FC = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const EmailIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const GlobeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.255 15.245L4 12m16.745 3.245L20 12h-2m-4-8v2m0 4h.01M12 21v-2m4-4h2M4 12H2m18 0h2M12 4V2m0 18v2" />
    </svg>
);

const LoginScreen: React.FC<LoginScreenProps> = ({ onEmailSignIn }) => {
  const handleSocialSignIn = () => alert('Coming Soon!');

  return (
    <div className="min-h-screen bg-[#0D0C22] text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] bg-gradient-to-br from-purple-900/50 via-cyan-600/30 to-green-600/20 opacity-30 animate-[spin_20s_linear_infinite]"></div>
      <div className="w-full max-w-sm z-10">
        <div className="text-center mb-12">
           <div className="bg-black/20 backdrop-blur-md border border-white/10 p-4 rounded-2xl inline-block mb-4">
              <GlobeIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Welcome to Vishwam</h1>
          <p className="text-lg text-slate-400">The future of finance, simplified.</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleSocialSignIn}
            className="w-full flex items-center justify-center gap-3 bg-slate-800/50 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-colors duration-300 border border-white/10"
          >
            <GoogleIcon />
            Sign in with Google
          </button>
          
          <button 
            onClick={handleSocialSignIn}
            className="w-full flex items-center justify-center gap-3 bg-slate-800/50 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-colors duration-300 border border-white/10"
          >
            <XIcon />
            Sign in with X
          </button>
          
          <div className="relative flex py-3 items-center">
            <div className="flex-grow border-t border-slate-700"></div>
            <span className="flex-shrink mx-4 text-slate-500 text-sm">OR</span>
            <div className="flex-grow border-t border-slate-700"></div>
          </div>
          
          <button 
            onClick={onEmailSignIn}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-opacity duration-300"
          >
            <EmailIcon />
            Sign in with Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;