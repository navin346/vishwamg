import React from 'react';
import { useTheme } from '@/src/context/ThemeContext';
import { useAppContext } from '@/src/context/AppContext';

interface HeaderProps {
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const { userMode, setUserMode } = useAppContext();
  const isInternational = userMode === 'INTERNATIONAL';

  return (
    <header className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-4 flex items-center justify-between sticky top-0 z-30 border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
          V
        </div>
        <span className="font-bold text-lg text-zinc-900 dark:text-white tracking-tight">Vishwam</span>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Country Toggle Switch */}
        <div className="relative flex h-8 items-center rounded-full bg-zinc-100 dark:bg-zinc-800 p-1 border border-zinc-200 dark:border-zinc-700">
          <button
            onClick={() => setUserMode('INTERNATIONAL')}
            className={`relative z-10 flex items-center gap-1 px-3 text-[10px] font-bold transition-colors ${!isInternational ? 'text-zinc-500 dark:text-zinc-400' : 'text-white'}`}
          >
            <span>US</span> 🇺🇸
          </button>
          <button
            onClick={() => setUserMode('INDIA')}
            className={`relative z-10 flex items-center gap-1 px-3 text-[10px] font-bold transition-colors ${isInternational ? 'text-zinc-500 dark:text-zinc-400' : 'text-white'}`}
          >
            <span>IND</span> 🇮🇳
          </button>
          <div
            className={`absolute top-1 bottom-1 rounded-full bg-indigo-600 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] w-[58px] ${isInternational ? 'left-1' : 'left-[64px]'}`}
          />
        </div>

        <button onClick={toggleTheme} aria-label="Toggle theme" className="p-2 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          )}
        </button>
        <button onClick={onLogout} aria-label="Logout" className="p-2 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;