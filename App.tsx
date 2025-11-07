
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FeatureCard from './components/FeatureCard';

// Define the interface for the BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const App: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
    }
    
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
        setIsAppInstalled(true);
        setDeferredPrompt(null);
        console.log('PWA was installed');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again, clear it
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="text-center bg-slate-800 rounded-xl p-8 mb-8 shadow-2xl border border-slate-700">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-4">Welcome to Your PWA!</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            This is a fully functional Progressive Web App starter. It works offline, can be installed on your device, and is built with the latest web technologies.
          </p>
        </div>
        
        {deferredPrompt && !isAppInstalled && (
            <div className="text-center mb-8">
                <button
                    onClick={handleInstallClick}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out flex items-center justify-center mx-auto"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Install App
                </button>
            </div>
        )}

        {isAppInstalled && (
             <div className="text-center mb-8 bg-green-900/50 border border-green-700 text-green-300 font-semibold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center mx-auto max-w-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Application successfully installed!
            </div>
        )}


        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
                icon="⚡"
                title="Lightning Fast"
                description="Leverages modern web technologies for near-instant loading and a smooth user experience."
            />
            <FeatureCard
                icon="🔗"
                title="Works Offline"
                description="Thanks to the service worker, this app works even when you're not connected to the internet."
            />
            <FeatureCard
                icon="📲"
                title="Installable"
                description="Add this app to your home screen for easy access, just like a native application."
            />
             <FeatureCard
                icon="🛡️"
                title="Reliable"
                description="Content is served reliably from the cache, ensuring a consistent experience."
            />
             <FeatureCard
                icon="🤝"
                title="Engaging"
                description="Provides an app-like experience that keeps users coming back."
            />
             <FeatureCard
                icon="🚀"
                title="Modern Stack"
                description="Built with React, TypeScript, and Tailwind CSS for a great developer experience."
            />
        </div>
      </main>
    </div>
  );
};

export default App;
