import React from 'react';
import { ActivePage } from '@/src/MainApp';
import { Home, BarChart3, LayoutGrid, User } from 'lucide-react';
import { triggerHaptic } from '@/src/utils/haptics';

interface BottomNavProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
}

const NavItem: React.FC<{
  label: string;
  page: ActivePage;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  icon: React.ReactNode;
}> = ({ label, page, activePage, setActivePage, icon }) => {
  const isActive = activePage === page;
  const handleClick = () => {
      triggerHaptic('light');
      setActivePage(page);
  }
  return (
    <button
      onClick={handleClick}
      className={`flex flex-col items-center justify-center w-full transition-all duration-300 relative pt-2 pb-1 group ${isActive ? 'text-indigo-500 dark:text-white' : 'text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300'}`}
    >
      <div className={`transition-all duration-300 ${isActive ? '-translate-y-1' : 'group-hover:-translate-y-0.5'}`}>
        {icon}
      </div>
      <span className={`text-[10px] font-medium mt-1 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 absolute -bottom-3'}`}>{label}</span>
      {isActive && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-indigo-500 dark:bg-white" />}
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activePage, setActivePage }) => {
  return (
    <nav className="bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-white/10 flex justify-between items-center h-[85px] pb-6 px-2 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      <NavItem label="Home" page="home" activePage={activePage} setActivePage={setActivePage} icon={<Home size={24} strokeWidth={isActive => isActive ? 2.5 : 2} />} />
      <NavItem label="Analytics" page="analytics" activePage={activePage} setActivePage={setActivePage} icon={<BarChart3 size={24} strokeWidth={isActive => isActive ? 2.5 : 2} />} />
      
      {/* Spacer for QR Button */}
      <div className="w-24" />
      
      <NavItem label="Services" page="services" activePage={activePage} setActivePage={setActivePage} icon={<LayoutGrid size={24} strokeWidth={isActive => isActive ? 2.5 : 2} />} />
      <NavItem label="Profile" page="profile" activePage={activePage} setActivePage={setActivePage} icon={<User size={24} strokeWidth={isActive => isActive ? 2.5 : 2} />} />
    </nav>
  );
};

export default BottomNav;