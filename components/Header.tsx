
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-700">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
            <div className="bg-cyan-500 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            </div>
            <h1 className="text-xl font-bold text-white">React PWA Starter</h1>
        </div>
        <a 
            href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden sm:inline-block text-sm text-slate-400 hover:text-cyan-400 transition-colors"
        >
            Learn more about PWAs
        </a>
      </div>
    </header>
  );
};

export default Header;
