import React from 'react';
import { useAppContext } from '@/src/context/AppContext';

interface KycFormScreenProps {
  onSuccess: () => void;
}

const InputField: React.FC<{ label: string; id: string; type?: string; placeholder: string }> = ({ label, id, type = "text", placeholder }) => (
    <div>
        <label htmlFor={id} className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{label}</label>
        <input id={id} type={type} placeholder={placeholder} className="w-full mt-1 p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-0 text-white" />
    </div>
);

const SelectField: React.FC<{ label: string; id: string; children: React.ReactNode }> = ({ label, id, children }) => (
    <div>
        <label htmlFor={id} className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{label}</label>
        <div className="relative">
            <select id={id} className="w-full mt-1 p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-0 text-white appearance-none">
                {children}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
        </div>
    </div>
);

const RadioGroup: React.FC<{ legend: string, options: string[] }> = ({ legend, options }) => (
    <fieldset>
        <legend className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">{legend}</legend>
        <div className="space-y-2">
            {options.map((option, index) => (
                <label key={option} className="flex items-center p-3 bg-neutral-800 border border-neutral-700 rounded-lg">
                    <input type="radio" name={legend.toLowerCase().replace(' ', '_')} className="h-4 w-4 text-violet-600 bg-neutral-700 border-neutral-600 focus:ring-violet-500 focus:ring-offset-neutral-800" defaultChecked={index === 1} />
                    <span className="ml-3 text-sm text-white">{option}</span>
                </label>
            ))}
        </div>
    </fieldset>
);

const CheckboxGroup: React.FC<{ legend: string, options: string[] }> = ({ legend, options }) => (
    <fieldset>
        <legend className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">{legend}</legend>
        <div className="space-y-2">
            {options.map((option, index) => (
                <label key={option} className="flex items-center p-3 bg-neutral-800 border border-neutral-700 rounded-lg">
                    <input type="checkbox" name={legend.toLowerCase().replace(' ', '_')} className="h-4 w-4 rounded text-violet-600 bg-neutral-700 border-neutral-600 focus:ring-violet-500 focus:ring-offset-neutral-800" defaultChecked={index < 2} />
                    <span className="ml-3 text-sm text-white">{option}</span>
                </label>
            ))}
        </div>
    </fieldset>
);


const KycFormScreen: React.FC<KycFormScreenProps> = ({ onSuccess }) => {
  // We get startKyc and setAuthStep from the context now
  const { startKyc, setAuthStep } = useAppContext();

  const handleContinue = () => {
    // This now correctly calls the context function,
    // which handles setting status and returning to the app.
    startKyc();
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
        <header className="p-4 flex items-center sticky top-0 bg-black/80 backdrop-blur-sm z-10">
            {/* Back button to return to KYC start */}
            <button onClick={() => setAuthStep('kycStart')} className="text-white p-2 rounded-full hover:bg-neutral-700" aria-label="Go back">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h1 className="text-lg font-bold mx-auto pr-8">Additional information</h1>
        </header>

        <main className="flex-grow overflow-y-auto p-4 space-y-6">
            <p className="text-sm text-neutral-400">Please answer the following questionnaire.</p>
            
            <SelectField label="Occupation" id="occupation">
                <option>Athlete / Coach / Trainer</option>
                <option>Software Engineer</option>
                <option>Designer</option>
                <option>Doctor</option>
            </SelectField>

            <RadioGroup legend="Annual Salary" options={["Below USD 1,000", "Between USD 1,001 and 10,000", "Between USD 10,001 and 100,000", "Above USD 100,001"]} />
            
            <CheckboxGroup legend="Account Purpose" options={["Payment Card", "Custody", "Investing", "Travel"]} />

            <p className="text-sm text-neutral-400 pt-4">Confirm your most recent residential address</p>
            
            <InputField label="Search address, city or zip code" id="address_search" placeholder="Start typing..." />
            
            <SelectField label="Country" id="country">
                <option>India</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Canada</option>
            </SelectField>

            <InputField label="Address Line 1" id="address1" placeholder="e.g. 123 Main Street" />
            <InputField label="Address Line 2" id="address2" placeholder="e.g. Apartment, Suite, Unit" />
            <InputField label="City" id="city" placeholder="e.g. San Francisco" />
            
            <SelectField label="State or Territory" id="state">
                <option>Select your state or territory</option>
                <option>California</option>
                <option>New York</option>
                <option>Texas</option>
            </SelectField>

            <InputField label="Postal Code" id="postal_code" placeholder="e.g. 94103" />

        </main>
        
        <footer className="p-4 sticky bottom-0 bg-black/80 backdrop-blur-sm">
             <button
                onClick={handleContinue}
                className="w-full bg-white text-black font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Continue
            </button>
        </footer>
    </div>
  );
};

export default KycFormScreen;