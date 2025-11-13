import React from 'react';

// Inline SVG Icon Components
const GoogleIcon: React.FC = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.804 12.12C34.553 8.246 29.623 6 24 6C13.434 6 5 14.434 5 25s8.434 19 19 19s19-8.434 19-19c0-1.041-.122-2.052-.359-3.017l-.252.934z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039L38.804 12.12C34.553 8.246 29.623 6 24 6C16.318 6 9.656 9.736 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.549-3.455-11.01-8.168l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C39.999 36.657 44 31.134 44 25c0-1.041-.122-2.052-.359-3.017l-.252.934z" />
  </svg>
);

const GlobeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.255 15.245L4 12m16.745 3.245L20 12h-2m-4-8v2m0 4h.01M12 21v-2m4-4h2M4 12H2m18 0h2M12 4V2m0 18v2" />
    </svg>
);


interface LoginScreenProps {
  onEmailSignIn: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onEmailSignIn }) => {
  const handleSocialSignIn = () => alert('Coming Soon!');

  return (
    <div className="min-h-screen bg-near-black text-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm text-center">
        <div className="mb-12">
           <div className="bg-surface border border-white/10 p-4 rounded-2xl inline-block mb-4">
              <GlobeIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white">Vishwam</h1>
          <p className="text-lg text-subtle">The future of finance, simplified.</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={onEmailSignIn}
            className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-opacity duration-300 animate-gradient-pan"
            style={{ backgroundSize: '200% auto' }}
          >
            Continue with Email
          </button>
           <div className="relative flex py-3 items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-4 text-subtle text-sm">OR</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>
          <button 
            onClick={handleSocialSignIn}
            className="w-full flex items-center justify-center gap-3 bg-surface hover:bg-white/10 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 border border-white/10"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;