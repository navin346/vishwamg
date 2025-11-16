import React from 'react';
import { InternationalCardDetails } from '@/src/data';

interface VirtualCardProps {
  card: InternationalCardDetails;
  disabled?: boolean;
}

const VirtualCard: React.FC<VirtualCardProps> = ({ card, disabled = false }) => {
  return (
    <div className="relative w-full aspect-[1.586]">
      <div className={`w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 flex flex-col justify-between text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 ${disabled ? 'filter grayscale blur-sm' : ''}`}>
        <div>
          <div className="flex justify-between items-start">
            {/* Chip */}
            <div className="w-12 h-9 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-md flex items-center justify-center">
              <div className="w-10 h-7 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-sm border-2 border-yellow-600/50"></div>
            </div>
            <svg className="w-12 h-12" viewBox="0 0 50 31" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="34.8623" cy="15.4229" r="10.1709" stroke="white" strokeOpacity="0.8" strokeWidth="4"/>
              <circle cx="15.4229" cy="15.4229" r="13.4229" stroke="white" strokeOpacity="0.8" strokeWidth="4"/>
            </svg>
          </div>
        </div>
        <div>
          <p className="text-xl sm:text-2xl font-mono tracking-widest mb-4">{card.number.replace(/(\d{4})/g, '$1 ').trim()}</p>
          <div className="flex justify-between text-sm">
            <p className="font-medium uppercase tracking-wider">{card.name}</p>
            <div>
              <span className="text-neutral-300 text-xs">VALID THRU</span>
              <p className="font-medium">{card.expiry}</p>
            </div>
          </div>
        </div>
      </div>
      {disabled && (
        <div className="absolute inset-0 bg-black/50 rounded-xl flex flex-col items-center justify-center text-center text-white p-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          <p className="font-bold">Card Locked</p>
          <p className="text-xs">Complete KYC to activate</p>
        </div>
      )}
    </div>
  );
};

export default VirtualCard;