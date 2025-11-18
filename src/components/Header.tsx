import React from 'react';
import { useTheme } from '@/src/context/ThemeContext';
import { useAppContext } from '@/src/context/AppContext';
import { Bell } from 'lucide-react';

interface HeaderProps {
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const { userMode, setUserMode } = useAppContext();
  const isInternational = userMode === 'INTERNATIONAL';

  return (
    <header className="bg-white/80 dark:bg-black/80 backdrop-blur-xl p-4 flex items-center justify-between sticky top-0 z-30 border-b border-gray-100 dark:border-neutral-900 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/20">
          V
        </div>
        {/* Country Toggle - Compact & Premium */}
        <div className="relative flex h-8 bg-gray-100 dark:bg-neutral-900 rounded-full p-1 border border-gray-200 dark:border-neutral-800">
            <button
                onClick={() => setUserMode('INTERNATIONAL')}
                className={`relative z-10 flex items-center justify-center w-10 h-full rounded-full transition-all duration-300 ${!isInternational ? 'text-gray-400' : 'text-white'}`}
            >
                <span className="text-sm">🇺🇸</span>
            </button>
            <button
                onClick={() => setUserMode('INDIA')}
                className={`relative z-10 flex items-center justify-center w-10 h-full rounded-full transition-all duration-300 ${isInternational ? 'text-gray-400' : 'text-white'}`}
            >
                <span className="text-sm">🇮🇳</span>
            </button>
            <div
                className={`absolute top-1 bottom-1 w-10 bg-neutral-800 dark:bg-neutral-700 rounded-full shadow-sm transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${isInternational ? 'left-1' : 'left-[48px]'}`}
            />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="text-gray-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
             {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            )}
        </button>
        <button className="relative text-gray-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-black"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;