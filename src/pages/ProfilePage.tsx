
import React from 'react';
import InfoCard from '../components/InfoCard';
import { useAppContext } from '../context/AppContext';

const ProfilePage: React.FC = () => {
  const { userMode, setUserMode } = useAppContext();

  const handleToggle = () => {
    setUserMode(userMode === 'INTERNATIONAL' ? 'INDIA' : 'INTERNATIONAL');
  };

  return (
    <main className="container mx-auto p-4 md:p-8">
      <InfoCard header="Profile Settings">
        <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
          <div>
            <h3 className="font-semibold text-slate-200">User Mode</h3>
            <p className="text-sm text-slate-400">Switch between International and India mode.</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`font-medium transition-colors ${userMode === 'INTERNATIONAL' ? 'text-cyan-400' : 'text-slate-500'}`}>
              INTERNATIONAL
            </span>
            <button
              onClick={handleToggle}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 ${
                userMode === 'INDIA' ? 'bg-cyan-500' : 'bg-slate-600'
              }`}
              role="switch"
              aria-checked={userMode === 'INDIA'}
              aria-label={`Switch to ${userMode === 'INTERNATIONAL' ? 'India' : 'International'} mode`}
            >
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ease-in-out ${
                  userMode === 'INDIA' ? 'translate-x-6' : 'translate-x-1'
                }`}
                aria-hidden="true"
              />
            </button>
            <span className={`font-medium transition-colors ${userMode === 'INDIA' ? 'text-cyan-400' : 'text-slate-500'}`}>
              INDIA
            </span>
          </div>
        </div>
      </InfoCard>
    </main>
  );
};

export default ProfilePage;
