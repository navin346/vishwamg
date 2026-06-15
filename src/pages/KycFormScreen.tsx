import React from 'react';
import { useAppContext } from '@/src/context/AppContext';
import BackgroundMesh from '@/src/components/BackgroundMesh';

interface KycFormScreenProps {
  onSuccess: () => void;
}

const InputField: React.FC<{ label: string; id: string; type?: string; placeholder: string }> = ({ label, id, type = "text", placeholder }) => (
    <div>
        <label htmlFor={id} className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{label}</label>
        <input 
          id={id} 
          type={type} 
          placeholder={placeholder} 
          className="w-full mt-1.5 p-3.5 bg-white/95 border border-gray-200 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-200 text-gray-900 placeholder-gray-400 font-medium transition-all shadow-sm" 
        />
    </div>
);

const SelectField: React.FC<{ label: string; id: string; children: React.ReactNode }> = ({ label, id, children }) => (
    <div>
        <label htmlFor={id} className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{label}</label>
        <div className="relative">
            <select 
              id={id} 
              className="w-full mt-1.5 p-3.5 bg-white/95 border border-gray-200 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-200 text-gray-900 font-medium appearance-none shadow-sm cursor-pointer"
            >
                {children}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 mt-1.5">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
        </div>
    </div>
);

const RadioGroup: React.FC<{ legend: string, options: string[] }> = ({ legend, options }) => (
    <fieldset>
        <legend className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2.5">{legend}</legend>
        <div className="space-y-2">
            {options.map((option, index) => (
                <label key={option} className="flex items-center p-3.5 bg-white/95 border border-gray-200 rounded-xl hover:border-gray-300 transition-all cursor-pointer shadow-sm">
                    <input 
                      type="radio" 
                      name={legend.toLowerCase().replace(' ', '_')} 
                      className="h-4 w-4 text-violet-600 bg-white border-gray-300 focus:ring-violet-400" 
                      defaultChecked={index === 1} 
                    />
                    <span className="ml-3 text-sm text-gray-800 font-semibold">{option}</span>
                </label>
            ))}
        </div>
    </fieldset>
);

const CheckboxGroup: React.FC<{ legend: string, options: string[] }> = ({ legend, options }) => (
    <fieldset>
        <legend className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2.5">{legend}</legend>
        <div className="space-y-2">
            {options.map((option, index) => (
                <label key={option} className="flex items-center p-3.5 bg-white/95 border border-gray-200 rounded-xl hover:border-gray-300 transition-all cursor-pointer shadow-sm">
                    <input 
                      type="checkbox" 
                      name={legend.toLowerCase().replace(' ', '_')} 
                      className="h-4 w-4 rounded text-violet-600 bg-white border-gray-300 focus:ring-violet-400" 
                      defaultChecked={index < 2} 
                    />
                    <span className="ml-3 text-sm text-gray-800 font-semibold">{option}</span>
                </label>
            ))}
        </div>
    </fieldset>
);

const KycFormScreen: React.FC<KycFormScreenProps> = ({ onSuccess }) => {
  const { setAuthFlow } = useAppContext();

  const handleContinue = () => {
    onSuccess();
  }

  return (
    <div className="h-full w-full flex flex-col overflow-hidden relative text-gray-900 select-none">
        <BackgroundMesh />
        
        {/* Header styling */}
        <header className="p-4 flex items-center sticky top-0 bg-white/90 backdrop-blur-md z-10 border-b border-gray-100 h-16">
            {/* Back button to return to KYC start */}
            <button 
              onClick={() => setAuthFlow('kycStart')} 
              className="text-gray-500 p-2 rounded-full hover:bg-gray-100 transition-all" 
              aria-label="Go back"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h1 className="text-md font-extrabold text-gray-950 mx-auto pr-8">Additional Information</h1>
        </header>

        <main className="flex-grow overflow-y-auto p-5 space-y-6 scrollbar-hide relative z-10">
            <p className="text-sm font-semibold text-gray-550">Please answer the following questionnaire to calibrate your bookkeeping ledgers.</p>
            
            <SelectField label="Occupation" id="occupation">
                <option className="text-gray-900 bg-white">Athlete / Coach / Trainer</option>
                <option className="text-gray-900 bg-white">Software Engineer</option>
                <option className="text-gray-900 bg-white">Designer</option>
                <option className="text-gray-900 bg-white">Doctor</option>
            </SelectField>

            <RadioGroup legend="Annual Salary" options={["Below USD 1,000", "Between USD 1,001 and 10,000", "Between USD 10,001 and 100,000", "Above USD 100,001"]} />
            
            <CheckboxGroup legend="Account Purpose" options={["Payment Card", "Custody", "Investing", "Travel"]} />

            <div className="border-t border-gray-200/50 pt-5 mt-6">
                <h3 className="font-extrabold text-gray-900 text-sm mb-1">Residential Address</h3>
                <p className="text-xs font-semibold text-gray-500 mb-4">Confirm your physical residency coordinates.</p>
            </div>
            
            <InputField label="Search address, city or zip code" id="address_search" placeholder="Start typing..." />
            
            <SelectField label="Country" id="country">
                <option className="text-gray-900 bg-white">India</option>
                <option className="text-gray-900 bg-white">United States</option>
                <option className="text-gray-900 bg-white">United Kingdom</option>
                <option className="text-gray-900 bg-white">Canada</option>
            </SelectField>

            <InputField label="Address Line 1" id="address1" placeholder="e.g. 123 Main Street" />
            <InputField label="Address Line 2" id="address2" placeholder="e.g. Apartment, Suite, Unit" />
            <InputField label="City" id="city" placeholder="e.g. San Francisco" />
            
            <SelectField label="State Or Territory" id="state">
                <option className="text-gray-900 bg-white">Select your state or territory</option>
                <option className="text-gray-900 bg-white">California</option>
                <option className="text-gray-900 bg-white">New York</option>
                <option className="text-gray-900 bg-white">Texas</option>
            </SelectField>

            <InputField label="Postal Code" id="postal_code" placeholder="e.g. 94103" />

        </main>
        
        {/* Sticky footer */}
        <footer className="p-4 sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-gray-100 relative z-10 shadow-lg">
             <button
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold py-4 rounded-2xl transition-all transform active:scale-98 shadow-md cursor-pointer"
              >
                Complete Identity Setup
            </button>
        </footer>
    </div>
  );
};

export default KycFormScreen;
