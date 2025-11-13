import React from 'react';
import { useAppContext } from '../context/AppContext';

const ProfilePage: React.FC = () => {
  const { userMode, setUserMode } = useAppContext();

  const handleToggle = () => {
    setUserMode(userMode === 'INTERNATIONAL' ? 'INDIA' : 'INTERNATIONAL');
  };

  return (
    <main className="p-4 md:p-6 space-y-8">
       <div className="text-left pt-4">
            <h1 className="text-3xl font-bold text-white">Profile & Settings</h1>
        </div>

      <div className="bg-surface border border-white/10 rounded-xl shadow-lg">
        <div className="p-6">
           <h2 className="text-lg font-semibold text-white/90 mb-4">Account Mode</h2>
            <div className="flex items-center justify-between bg-near-black p-4 rounded-lg border border-white/10">
              <div>
                <h3 className="font-semibold text-white">User Mode</h3>
                <p className="text-sm text-subtle">Switch between International and India mode.</p>
              </div>
              <div className="flex items-center">
                <span className={`text-xs font-bold transition-colors ${userMode === 'INTERNATIONAL' ? 'text-white' : 'text-subtle'}`}>
                  INT
                </span>
                <button
                  onClick={handleToggle}
                  className={`relative inline-flex items-center h-8 rounded-full w-14 mx-3 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-purple-500 ${
                    userMode === 'INDIA' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-near-black border border-white/20'
                  }`}
                  role="switch"
                  aria-checked={userMode === 'INDIA'}
                  aria-label={`Switch to ${userMode === 'INTERNATIONAL' ? 'India' : 'International'} mode`}
                >
                  <span
                    className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform duration-300 ease-in-out ${
                      userMode === 'INDIA' ? 'translate-x-7' : 'translate-x-1'
                    }`}
                    aria-hidden="true"
                  />
                </button>
                <span className={`text-xs font-bold transition-colors ${userMode === 'INDIA' ? 'text-white' : 'text-subtle'}`}>
                  IND
                </span>
              </div>
            </div>
        </div>
      </div>

       <div className="bg-surface border border-white/10 rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-white/90 mb-4">More Options</h2>
            <ul className="divide-y divide-white/10">
                <li className="py-3 flex justify-between items-center text-white">
                    <span>Security</span>
                    <span className="text-subtle">&gt;</span>
                </li>
                 <li className="py-3 flex justify-between items-center text-red-400 cursor-pointer">
                    <span>Logout</span>
                </li>
            </ul>
        </div>
    </main>
  );
};

export default ProfilePage;