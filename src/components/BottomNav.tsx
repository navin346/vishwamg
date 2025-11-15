import React from 'react';
import { useAppContext } from '../context/AppContext';

type ActivePage = 'spends' | 'bills' | 'profile';

interface BottomNavProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
}

const NavItem: React.FC<{
  label: string;
  page: ActivePage;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  children: React.ReactNode;
}> = ({ label, page, activePage, setActivePage, children }) => {
  const isActive = activePage === page;
  return (
    <button
      onClick={() => setActivePage(page)}
      className={`flex flex-col items-center justify-center w-full transition-colors duration-200 relative pt-1 ${isActive ? 'text-violet-600 dark:text-violet-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
      aria-label={`Go to ${label}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
      <span className="text-xs font-medium mt-0.5">{label}</span>
      {isActive && <div className="absolute -bottom-0.5 h-1 w-6 rounded-full bg-violet-600 dark:bg-violet-400" />}
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activePage, setActivePage }) => {
  const { userMode } = useAppContext();
  const isInternational = userMode === 'INTERNATIONAL';

  const billsLabel = isInternational ? 'Global Pay' : 'Bill Pay';
  const billsIcon = isInternational ? (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m-9 9h18" />
     </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-t border-gray-200 dark:border-neutral-800 flex justify-around h-16 z-10">
      <NavItem label="Spends" page="spends" activePage={activePage} setActivePage={setActivePage}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
      </NavItem>
       <NavItem label={billsLabel} page="bills" activePage={activePage} setActivePage={setActivePage}>
        {billsIcon}
      </NavItem>
      <NavItem label="Profile" page="profile" activePage={activePage} setActivePage={setActivePage}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
      </NavItem>
    </nav>
  );
};

export default BottomNav;