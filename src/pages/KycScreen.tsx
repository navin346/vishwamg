import React, { useState } from 'react';
import { useAppContext } from '@/src/context/AppContext';
import { Upload, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';

// This is the type definition required by the provided component.
// Since this component is not actively wired, this is for type correctness.
export type ActiveScreen = 'Home' | 'Profile' | 'KYC';

// Props for the KYC Screen
interface KycScreenProps {
  onSuccess: () => void;
  onBack: () => void;
}

/**
 * KycScreen (Legacy)
 * A full component for handling user KYC verification (India-specific).
 * This file replaces the previously incomplete one to fix build errors.
 * NOTE: This component is not currently wired into the main app flow,
 * which uses the JIT KYC screens (KycStartScreen, KycFormScreen).
 */
const KycScreen: React.FC<KycScreenProps> = ({ onSuccess, onBack }) => {
  const [step, setStep] = useState(1); // 1: Form, 2: Upload, 3: Success
  const [fullName, setFullName] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [panFile, setPanFile] = useState<File | null>(null);
  const [addressFile, setAddressFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePanFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPanFile(e.target.files[0]);
    }
  };

  const handleAddressFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAddressFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      // Validate form
      if (fullName && panNumber) {
        setStep(2);
      }
    } else if (step === 2) {
      // Validate file uploads
      if (panFile && addressFile) {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
          // In a real app, call a context function like completeKyc(...)
          console.log("KYC Data Submitted:", { fullName, panNumber, panFile, addressFile });
          setIsLoading(false);
          setStep(3);
        }, 2000);
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name (as per PAN)</label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Jane Doe"
                required
              />
            </div>
            <div>
              <label htmlFor="panNumber" className="block text-sm font-medium text-gray-700">PAN Number</label>
              <input
                type="text"
                id="panNumber"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="ABCDE1234F"
                maxLength={10}
                minLength={10}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Next
            </button>
          </form>
        );
      case 2:
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Upload PAN Card</label>
              <div className="flex items-center space-x-4">
                <input type="file" id="panFile" onChange={handlePanFileChange} accept="image/*,.pdf" className="hidden" />
                <label htmlFor="panFile" className="cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Upload size={18} className="mr-2" />
                  Choose File
                </label>
                {panFile && <span className="text-sm text-gray-600 truncate max-w-xs">{panFile.name}</span>}
              </div>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Upload Address Proof (Aadhaar)</label>
              <div className="flex items-center space-x-4">
                <input type="file" id="addressFile" onChange={handleAddressFileChange} accept="image/*,.pdf" className="hidden" />
                <label htmlFor="addressFile" className="cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Upload size={18} className="mr-2" />
                  Choose File
                </label>
                {addressFile && <span className="text-sm text-gray-600 truncate max-w-xs">{addressFile.name}</span>}
              </div>
            </div>
            <button
              type="submit"
              disabled={!panFile || !addressFile || isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : 'Submit for Verification'}
            </button>
          </form>
        );
      case 3:
        return (
          <div className="text-center space-y-4">
            <CheckCircle size={64} className="mx-auto text-green-500" />
            <h2 className="text-2xl font-semibold">Verification Submitted!</h2>
            <p className="text-gray-600">
              Your documents have been submitted successfully. Verification usually takes 24-48 hours. We will notify you once it's complete.
            </p>
            <button
              onClick={onSuccess}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Home
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-gray-50 min-h-screen">
      <header className="relative flex items-center justify-center mb-6">
        {step < 3 && (
          <button
            onClick={() => step === 1 ? onBack() : setStep(step - 1)}
            className="absolute left-0 p-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={22} />
          </button>
        )}
        <h1 className="text-2xl font-bold text-gray-800">KYC Verification</h1>
      </header>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        {renderStep()}
      </div>
    </div>
  );
};

export default KycScreen;