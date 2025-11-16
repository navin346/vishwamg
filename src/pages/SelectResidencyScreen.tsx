import React, { useState } from 'react';
import { UserMode } from '@/src/context/AppContext';

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
      className={`w-full text-left p-4 rounded-lg border-2 transition-colors flex items-center justify-between ${
        isSelected ? 'bg-violet-500/10 border-violet-500' : 'bg-neutral-800/50 border-neutral-700 hover:border-neutral-500'
      }`}
    >
      <div className="flex items-center">
        {icon}
        <span className="font-semibold ml-4">{label}</span>
      </div>
      {isSelected && (
        <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
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
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-between p-6">
      <div className="w-full max-w-sm text-center mt-16">
        <div className="w-20 h-20 mx-auto bg-neutral-800 rounded-full flex items-center justify-center border border-neutral-700 mb-6">
          <svg className="w-10 h-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h8a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.757 15.757a3 3 0 104.486 0M12 21a9 9 0 100-18 9 9 0 000 18z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">I'm a resident of or live in:</h1>
        
        <div className="space-y-4 mt-8">
          <RadioOption
            label="India"
            value="other"
            selectedValue={residency}
            onSelect={setResidency}
            icon={<div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-xl">🇮🇳</div>}
          />
           <RadioOption
            label="United States of America"
            value="us"
            selectedValue={residency}
            onSelect={setResidency}
            icon={<div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-xl">🇺🇸</div>}
          />
        </div>
      </div>
      
      <div className="w-full max-w-sm">
         <p className="text-xs text-neutral-500 text-center mb-4">
            By selecting agree and continue I agree that I have read the <a href="#" className="underline">Privacy Notice</a> and I agree to the processing of my personal data, as described in <a href="#" className="underline">Consent</a>.
         </p>
         <button
            onClick={handleContinue}
            disabled={!residency}
            className="w-full bg-white disabled:bg-neutral-700 text-black disabled:text-neutral-500 font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Continue
        </button>
      </div>
    </div>
  );
};

export default SelectResidencyScreen;