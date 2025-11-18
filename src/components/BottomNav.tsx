import React from 'react';
import { ActivePage } from '@/src/MainApp';
import { Home, BarChart3, LayoutGrid, User, ScanLine } from 'lucide-react';
import { triggerHaptic } from '@/src/utils/haptics';

interface BottomNavProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  onScanClick: () => void;
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
      className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-200 group ${isActive ? 'text-black dark:text-white' : 'text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300'}`}
    >
      <div className={`transition-transform duration-200 ${isActive ? '-translate-y-1' : ''}`}>
        {icon}
      </div>
      <span className={`text-[10px] font-bold absolute bottom-2 transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activePage, setActivePage, onScanClick }) => {
  const handleScan = () => {
      triggerHaptic('medium');
      onScanClick();
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 z-50 pb-safe">
      <div className="relative flex justify-between items-center h-full px-2 max-w-md mx-auto">
        
        <NavItem label="Home" page="home" activePage={activePage} setActivePage={setActivePage} icon={<Home size={24} strokeWidth={activePage === 'home' ? 2.5 : 2} />} />
        <NavItem label="Analytics" page="analytics" activePage={activePage} setActivePage={setActivePage} icon={<BarChart3 size={24} strokeWidth={activePage === 'analytics' ? 2.5 : 2} />} />
        
        {/* Floating Scan Button */}
        <div className="relative -top-6">
            <button 
                onClick={handleScan}
                className="w-16 h-16 rounded-full bg-black dark:bg-white text-white dark:text-black shadow-2xl shadow-indigo-500/30 flex items-center justify-center transform transition-transform active:scale-90 border-4 border-white dark:border-[#0A0A0A]"
            >
                <ScanLine size={28} strokeWidth={2.5} />
            </button>
        </div>

        <NavItem label="Services" page="services" activePage={activePage} setActivePage={setActivePage} icon={<LayoutGrid size={24} strokeWidth={activePage === 'services' ? 2.5 : 2} />} />
        <NavItem label="Profile" page="profile" activePage={activePage} setActivePage={setActivePage} icon={<User size={24} strokeWidth={activePage === 'profile' ? 2.5 : 2} />} />
      </div>
    </div>
  );
};

export default BottomNav;