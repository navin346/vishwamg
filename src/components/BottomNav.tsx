import React from 'react';

type ActivePage = 'home' | 'pay' | 'history';

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
      className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${isActive ? 'text-indigo-400' : 'text-neutral-500 hover:text-white'}`}
      aria-label={`Go to ${label}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activePage, setActivePage }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-neutral-900/80 backdrop-blur-sm border-t border-neutral-800 flex justify-around h-16 z-10">
      <NavItem label="Home" page="home" activePage={activePage} setActivePage={setActivePage}>
        <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
      </NavItem>
      <NavItem label="Pay" page="pay" activePage={activePage} setActivePage={setActivePage}>
        <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
      </NavItem>
      <NavItem label="History" page="history" activePage={activePage} setActivePage={setActivePage}>
        <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </NavItem>
    </nav>
  );
};

export default BottomNav;