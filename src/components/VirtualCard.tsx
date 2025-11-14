import React from 'react';
import { InternationalCardDetails } from '../data';

interface VirtualCardProps {
  card: InternationalCardDetails;
}

const VirtualCard: React.FC<VirtualCardProps> = ({ card }) => {
  return (
    <div className="w-full aspect-[1.586] bg-gradient-to-br from-indigo-700 to-purple-800 rounded-xl p-6 flex flex-col justify-between text-white shadow-lg">
      <div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">VISHWAM</span>
          <svg className="w-12 h-12" viewBox="0 0 50 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.4639 2.26074H9.53613C6.39844 2.26074 3.81934 4.83984 3.81934 7.97754V22.8604C3.81934 26.002 6.39844 28.5771 9.53613 28.5771H19.4639C22.6016 28.5771 25.1807 26.002 25.1807 22.8604V7.97754C25.1807 4.83984 22.6016 2.26074 19.4639 2.26074Z" stroke="white" strokeWidth="4.52148"/>
            <circle cx="34.8623" cy="15.4229" r="10.1709" stroke="white" strokeWidth="4.52148"/>
          </svg>
        </div>
      </div>
      <div>
        <p className="text-xl font-mono tracking-widest mb-2">{card.number.replace(/(\d{4})/g, '$1 ').trim()}</p>
        <div className="flex justify-between text-sm">
          <p className="font-medium uppercase">{card.name}</p>
          <div>
            <span className="text-neutral-300">VALID THRU</span>
            <p className="font-medium">{card.expiry}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualCard;
