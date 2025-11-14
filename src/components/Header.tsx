import React from 'react';
import { useAppContext, UserMode } from '../context/AppContext';

interface HeaderProps {
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const { userMode, setUserMode } = useAppContext();

  const handleToggle = () => {
    const newMode: UserMode = userMode === 'INTERNATIONAL' ? 'INDIA' : 'INTERNATIONAL';
    setUserMode(newMode);
  };

  return (
    <header className="bg-black/80 backdrop-blur-sm p-4 flex items-center justify-between sticky top-0 z-10 border-b border-neutral-800">
      <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white">
        J
      </div>
      
      {/* Custom Toggle Switch */}
      <div onClick={handleToggle} className="cursor-pointer flex items-center p-1 rounded-full bg-neutral-800 w-36">
        <div className={`transition-all duration-300 ease-in-out w-1/2 text-center text-xs font-bold py-1 rounded-full ${userMode === 'INTERNATIONAL' ? 'bg-indigo-600 text-white' : 'text-neutral-400'}`}>
          INT'L
        </div>
        <div className={`transition-all duration-300 ease-in-out w-1/2 text-center text-xs font-bold py-1 rounded-full ${userMode === 'INDIA' ? 'bg-green-600 text-white' : 'text-neutral-400'}`}>
          INDIA
        </div>
      </div>

      <button onClick={onLogout} aria-label="Logout">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-400 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </header>
  );
};

export default Header;
