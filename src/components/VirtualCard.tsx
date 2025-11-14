import React from 'react';
import { InternationalCardDetails } from '../data';

interface VirtualCardProps {
  card: InternationalCardDetails;
}

const VirtualCard: React.FC<VirtualCardProps> = ({ card }) => {
  return (
    <div className="w-full aspect-[1.586] bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 flex flex-col justify-between text-white shadow-lg shadow-indigo-500/30">
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
  );
};

export default VirtualCard;