import React from 'react';
import { useAppContext } from '@/src/context/AppContext';
import { ActivePage } from '@/src/MainApp';
import { Home, BarChart3, Zap, Globe, User, Layers } from 'lucide-react';

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
  return (
    <button
      onClick={() => setActivePage(page)}
      className={`flex flex-col items-center justify-center w-full transition-all duration-200 relative pt-2 pb-1 group ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'}`}
      aria-label={`Go to ${label}`}
    >
      <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
        {icon}
      </div>
      <span className="text-[10px] font-medium mt-1">{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activePage, setActivePage }) => {
  const { userMode } = useAppContext();
  const isInternational = userMode === 'INTERNATIONAL';

  const billsLabel = isInternational ? 'Global' : 'Bills';
  const billsIcon = isInternational ? <Globe size={22} strokeWidth={2} /> : <Zap size={22} strokeWidth={2} />;

  return (
    <nav className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-lg border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center h-[84px] pb-5 px-2 z-40 shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
      <NavItem label="Home" page="home" activePage={activePage} setActivePage={setActivePage} icon={<Home size={22} strokeWidth={2} />} />
      <NavItem label="Yield" page="yield" activePage={activePage} setActivePage={setActivePage} icon={<Layers size={22} strokeWidth={2} />} />
      
      {/* Spacer for the central QR button */}
      <div className="w-16" aria-hidden="true" />
      
      <NavItem label="Analytics" page="analytics" activePage={activePage} setActivePage={setActivePage} icon={<BarChart3 size={22} strokeWidth={2} />} />
      <NavItem label={billsLabel} page="bills" activePage={activePage} setActivePage={setActivePage} icon={billsIcon} />
    </nav>
  );
};

export default BottomNav;