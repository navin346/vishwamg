import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white/80 dark:bg-black/80 backdrop-blur-sm p-4 flex items-center justify-between sticky top-0 z-20 border-b border-gray-200 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white">
          J
        </div>
        <span className="font-bold text-lg text-gray-900 dark:text-white">Vishwam</span>
      </div>
      
      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} aria-label="Toggle theme" className="text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          )}
        </button>
        <button onClick={onLogout} aria-label="Logout">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;