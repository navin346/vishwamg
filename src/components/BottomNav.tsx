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
      className={`flex flex-col items-center justify-center w-full transition-all duration-300 pt-4 pb-6 group ${isActive ? 'text-black dark:text-white' : 'text-gray-400 dark:text-neutral-600 hover:text-gray-600 dark:hover:text-neutral-400'}`}
    >
      <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
        {icon}
      </div>
      <span className={`text-[10px] font-bold mt-1 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activePage, setActivePage }) => {
  return (
    <nav className="bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 flex justify-around items-center px-6 fixed bottom-0 left-0 right-0 z-40">
      <NavItem label="Home" page="home" activePage={activePage} setActivePage={setActivePage} icon={<Home size={24} strokeWidth={activePage === 'home' ? 2.5 : 2} />} />
      <NavItem label="Analytics" page="analytics" activePage={activePage} setActivePage={setActivePage} icon={<BarChart3 size={24} strokeWidth={activePage === 'analytics' ? 2.5 : 2} />} />
      <NavItem label="Services" page="services" activePage={activePage} setActivePage={setActivePage} icon={<LayoutGrid size={24} strokeWidth={activePage === 'services' ? 2.5 : 2} />} />
      <NavItem label="Profile" page="profile" activePage={activePage} setActivePage={setActivePage} icon={<User size={24} strokeWidth={activePage === 'profile' ? 2.5 : 2} />} />
    </nav>
  );
};

export default BottomNav;