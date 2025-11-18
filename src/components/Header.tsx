import React from 'react';
import { useTheme } from '@/src/context/ThemeContext';
import { useAppContext } from '@/src/context/AppContext';
import { Bell, ScanLine } from 'lucide-react';
import { triggerHaptic } from '@/src/utils/haptics';

interface HeaderProps {
    onLogout: () => void;
    onScanClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout, onScanClick }) => {
  const { theme, toggleTheme } = useTheme();
  const { userMode, setUserMode } = useAppContext();
  const isInternational = userMode === 'INTERNATIONAL';

  const handleScan = () => {
      triggerHaptic('light');
      if (onScanClick) onScanClick();
  }

  return (
    <header className="bg-white/50 dark:bg-black/50 backdrop-blur-xl pt-12 pb-4 px-6 flex items-center justify-between sticky top-0 z-30 transition-colors duration-300 border-b border-transparent dark:border-white/5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold text-xl shadow-lg">
          V
        </div>
        {/* Country Toggle - Minimal Pill */}
        <button
            onClick={() => setUserMode(isInternational ? 'INDIA' : 'INTERNATIONAL')}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-200/50 dark:bg-neutral-800/50 rounded-full border border-gray-200 dark:border-neutral-700 transition-all active:scale-95"
        >
            <span className="text-sm">{isInternational ? '🇺🇸' : '🇮🇳'}</span>
            <span className="text-xs font-bold text-gray-600 dark:text-neutral-300">{isInternational ? 'USD' : 'INR'}</span>
        </button>
      </div>
      
      <div className="flex items-center gap-3">
        <button 
            onClick={handleScan}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors border border-transparent dark:border-white/10"
            aria-label="Scan"
        >
            <ScanLine size={20} strokeWidth={2} />
        </button>

        <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors border border-transparent dark:border-white/10">
             {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            )}
        </button>
      </div>
    </header>
  );
};

export default Header;