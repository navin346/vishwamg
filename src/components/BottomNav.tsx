import React from 'react';

type ActivePage = 'home' | 'pay' | 'spends' | 'profile';

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
      className={`flex flex-col items-center justify-center w-full transition-colors duration-200 relative pt-1 ${isActive ? 'text-violet-600 dark:text-violet-400' : 'text-neutral-500 hover:text-black dark:hover:text-white'}`}
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
  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-t border-neutral-200 dark:border-neutral-800 flex justify-around h-16 z-10">
      <NavItem label="Home" page="home" activePage={activePage} setActivePage={setActivePage}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
      </NavItem>
      <NavItem label="Pay" page="pay" activePage={activePage} setActivePage={setActivePage}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
      </NavItem>
       <NavItem label="Spends" page="spends" activePage={activePage} setActivePage={setActivePage}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
      </NavItem>
      <NavItem label="Profile" page="profile" activePage={activePage} setActivePage={setActivePage}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
      </NavItem>
    </nav>
  );
};

export default BottomNav;