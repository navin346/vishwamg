import React from 'react';
import { useAppContext, UserMode } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const { userMode, setUserMode } = useAppContext();
  const { theme, toggleTheme } = useTheme();

  const handleToggle = (mode: UserMode) => {
    setUserMode(mode);
  };

  return (
    <header className="bg-white/80 dark:bg-black/80 backdrop-blur-sm p-4 flex items-center justify-between sticky top-0 z-20 border-b border-neutral-200 dark:border-neutral-800">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white">
        J
      </div>
      
      {/* Redesigned Toggle Switch */}
      <div className="relative flex items-center p-1 rounded-full bg-neutral-200 dark:bg-neutral-800 w-40 h-9">
        <div 
          className={`absolute top-1 left-1 w-[calc(50%-4px)] h-7 rounded-full transition-all duration-300 ease-in-out ${userMode === 'INTERNATIONAL' ? 'translate-x-0 bg-indigo-600' : 'translate-x-full bg-green-600'}`}
        />
        <button 
          onClick={() => handleToggle('INTERNATIONAL')} 
          className="relative z-10 w-1/2 text-center text-xs font-bold py-1 rounded-full text-white"
        >
          INT'L
        </button>
        <button 
          onClick={() => handleToggle('INDIA')} 
          className="relative z-10 w-1/2 text-center text-xs font-bold py-1 rounded-full text-white"
        >
          INDIA
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} aria-label="Toggle theme" className="text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          )}
        </button>
        <button onClick={onLogout} aria-label="Logout">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;