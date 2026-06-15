import React, { useState } from 'react';
import { UserMode } from '@/src/context/AppContext';
import BackgroundMesh from '@/src/components/BackgroundMesh';

interface SelectResidencyScreenProps {
  onSuccess: (mode: UserMode) => void;
}

const RadioOption: React.FC<{
  label: string;
  value: string;
  selectedValue: string | null;
  onSelect: (value: string) => void;
  icon: React.ReactNode;
}> = ({ label, value, selectedValue, onSelect, icon }) => {
  const isSelected = selectedValue === value;
  return (
    <button
      onClick={() => onSelect(value)}
      className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between shadow-sm ${
        isSelected 
          ? 'bg-violet-50/70 border-violet-500 text-violet-950 font-bold scale-[1.01]' 
          : 'bg-white/80 border-gray-105 hover:border-gray-300 text-gray-800'
      }`}
    >
      <div className="flex items-center">
        {icon}
        <span className="font-bold ml-4 text-sm">{label}</span>
      </div>
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
        isSelected ? 'border-violet-600 bg-violet-650' : 'border-gray-300 bg-white'
      }`}>
        {isSelected && (
          <div className="w-2.5 h-2.5 rounded-full bg-violet-600" />
        )}
      </div>
    </button>
  );
};

const SelectResidencyScreen: React.FC<SelectResidencyScreenProps> = ({ onSuccess }) => {
  const [residency, setResidency] = useState<string | null>(null);

  const handleContinue = () => {
    if (residency) {
      // Map the selection to the UserMode type
      const userMode: UserMode = residency === 'us' ? 'INTERNATIONAL' : 'INDIA';
      onSuccess(userMode);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-between p-6 relative overflow-y-auto scrollbar-hide text-gray-900 select-none">
      <BackgroundMesh />
      
      <div className="w-full max-w-sm text-center mt-12 relative z-10">
        <div className="w-16 h-16 mx-auto bg-violet-50 rounded-2xl flex items-center justify-center border border-violet-100 mb-6 shadow-sm">
          <svg className="w-8 h-8 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h8a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.757 15.757a3 3 0 104.486 0M12 21a9 9 0 100-18 9 9 0 000 18z" />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Select Residency</h1>
        <p className="text-gray-500 font-semibold text-sm">Please identify your tax residency to prepare dynamic ledger routing.</p>
        
        <div className="space-y-4 mt-8">
          <RadioOption
            label="India / Domestic Rails"
            value="other"
            selectedValue={residency}
            onSelect={setResidency}
            icon={<div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-xl shadow-sm">🇮🇳</div>}
          />
           <RadioOption
            label="United States of America"
            value="us"
            selectedValue={residency}
            onSelect={setResidency}
            icon={<div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-xl shadow-sm">🇺🇸</div>}
          />
        </div>
      </div>
      
      <div className="w-full max-w-sm relative z-10 mt-8">
         <p className="text-[10px] text-gray-400 font-bold tracking-wider text-center mb-4 uppercase">
            By agreeing and continuing, you confirm accurate tax residence declarations.
         </p>
         <button
            onClick={handleContinue}
            disabled={!residency}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-gray-100 disabled:to-gray-200 text-white disabled:text-gray-400 font-bold py-4 px-4 rounded-2xl transition-all transform active:scale-98 shadow-md cursor-pointer"
          >
            Agree and Continue
         </button>
      </div>
    </div>
  );
};

export default SelectResidencyScreen;
