import React from 'react';
import { useTheme } from '@/src/context/ThemeContext';
import { useAppContext } from '@/src/context/AppContext';
import { triggerHaptic } from '@/src/utils/haptics';
import { Sun, Moon } from 'lucide-react';

interface HeaderProps {
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const { userMode, setUserMode } = useAppContext();
  const isInternational = userMode === 'INTERNATIONAL';

  const handleToggleMode = (mode: 'INDIA' | 'INTERNATIONAL') => {
      triggerHaptic('light');
      setUserMode(mode);
  }

  return (
    <header className="bg-white/80 dark:bg-black/80 backdrop-blur-xl pt-safe-top pb-4 px-6 flex items-center justify-between sticky top-0 z-30 border-b border-transparent dark:border-white/5 h-20">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold text-lg shadow-sm">
          V
        </div>
      </div>

      {/* Side-by-Side Toggle */}
      <div className="flex bg-gray-100 dark:bg-neutral-900 p-1 rounded-lg">
          <button 
            onClick={() => handleToggleMode('INDIA')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${!isInternational ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm' : 'text-gray-500 dark:text-neutral-500'}`}
          >
              <span>🇮🇳</span> INR
          </button>
          <button 
            onClick={() => handleToggleMode('INTERNATIONAL')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${isInternational ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm' : 'text-gray-500 dark:text-neutral-500'}`}
          >
              <span>🇺🇸</span> USD
          </button>
      </div>
      
      <div className="flex items-center gap-3">
        <button onClick={toggleTheme} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-900 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors">
             {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
};

export default Header;