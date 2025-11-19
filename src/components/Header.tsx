import React from 'react';
import { useAppContext } from '@/src/context/AppContext';
import { triggerHaptic } from '@/src/utils/haptics';

interface HeaderProps {
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const { userMode, setUserMode } = useAppContext();
  const isInternational = userMode === 'INTERNATIONAL';

  const handleToggleMode = (mode: 'INDIA' | 'INTERNATIONAL') => {
      triggerHaptic('light');
      setUserMode(mode);
  }

  return (
    <header className="bg-white/80 backdrop-blur-xl pt-safe-top pb-4 px-6 flex items-center justify-between sticky top-0 z-30 border-b border-gray-100 h-20 transition-all">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center text-white font-bold text-lg shadow-md">
          V
        </div>
      </div>

      {/* Side-by-Side Toggle */}
      <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
          <button 
            onClick={() => handleToggleMode('INDIA')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${!isInternational ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
              <span>🇮🇳</span> INR
          </button>
          <button 
            onClick={() => handleToggleMode('INTERNATIONAL')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${isInternational ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
              <span>🇺🇸</span> USD
          </button>
      </div>
      
      {/* Placeholder for balance/profile action if needed, currently empty to balance layout */}
      <div className="w-9"></div>
    </header>
  );
};

export default Header;