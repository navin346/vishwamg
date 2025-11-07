import React from 'react';

// A simple globe icon for "Vishwam" which means "universe" or "world"
const GlobeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.255 15.245L4 12m16.745 3.245L20 12h-2m-4-8v2m0 4h.01M12 21v-2m4-4h2M4 12H2m18 0h2M12 4V2m0 18v2" />
    </svg>
);


const Header: React.FC = () => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-700">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-cyan-500 to-blue-500 p-2 rounded-lg">
                <GlobeIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Vishwam</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;