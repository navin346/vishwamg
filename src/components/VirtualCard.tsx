import React from 'react';

interface CardData {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

interface VirtualCardProps {
  cardData: CardData;
  isFlipped: boolean;
}

const VirtualCard: React.FC<VirtualCardProps> = ({ cardData, isFlipped }) => {
  return (
    <div className="card-flip-container w-full h-56">
        <div className={`card-flipper w-full h-full ${isFlipped ? 'flipped' : ''}`}>
            <div className="card w-full h-full relative">
                {/* Card Front */}
                <div className="card-front absolute w-full h-full bg-[#1e1b3a] rounded-2xl shadow-2xl p-6 flex flex-col justify-between text-white overflow-hidden border border-white/10">
                    <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-purple-600 via-cyan-400 to-green-400 opacity-20 animate-[spin_10s_linear_infinite]"></div>
                    <div className="relative z-10 flex justify-between items-start">
                        <span className="font-semibold text-lg">Stablecoin</span>
                         <svg xmlns="http://www.w3.org/2000/svg" width="60" height="40" viewBox="0 0 128 40" fill="none" className="h-8 opacity-80">
                            <g clipPath="url(#clip0)"><path d="M38.86 3.003L24.83 29.585h6.152l3.418-7.05h13.204l2.067 7.05h5.89L41.675 3.003h-2.815zm-1.805 17.067l5.318-11.08 5.24 11.08H37.055zM67.094 13.111c0-3.6 2.18-5.467 5.58-5.467 2.143 0 3.73.743 4.88 1.34l.89-4.398c-1.393-.63-3.237-1.01-5.692-1.01-6.15 0-9.92 3.6-9.92 8.802 0 6.57 5.06 8.57 8.35 9.873 3.328 1.304 4.414 2.067 4.414 3.238 0 1.623-1.66 2.366-4.02 2.366-2.926 0-4.526-.78-5.73-1.378l-.927 4.545c1.43.704 3.842 1.157 6.648 1.157 6.83 0 10.28-3.417 10.28-8.985 0-5.138-3.565-7.6-7.85-9.33-3.036-1.196-4.805-1.956-4.805-3.238zM92.93 3.003l-6.26 26.582h5.93l1.43-6.57h9.098l.85 6.57h5.93L103.545 3.003h-10.615zm-1.353 14.89l3.908-11.434 3.642 11.434h-7.55zM113.88 15.31c.63-2.367 3.327-4.02 5.93-4.02 1.624 0 2.29.553 2.29 1.585 0 .818-.63 1.268-1.66 1.66l-3.326 1.304-4.234-1.529zm7.31 14.275h6.26V8.18h-5.93L113.88 29.585zM19.16 3.003L12.9 19.16.63 3.002H0l11.08 29.35H11.7L25.1 5.37l-.63-2.366H19.16z" fill="#fff"></path></g>
                            <defs><clipPath id="clip0"><path fill="#fff" transform="translate(0 2.5)" d="M0 0h128v35H0z"></path></clipPath></defs>
                        </svg>
                    </div>
                    <div className="relative z-10 text-center">
                        <p className="font-mono text-2xl md:text-3xl tracking-wider">{cardData.number}</p>
                    </div>
                    <div className="relative z-10 flex justify-between items-end font-mono text-sm">
                        <div>
                            <p className="text-xs uppercase text-slate-400">Card Holder</p>
                            <p className="font-medium tracking-wider">{cardData.name}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase text-slate-400">Expires</p>
                            <p className="font-medium tracking-wider">{cardData.expiry}</p>
                        </div>
                    </div>
                </div>
                
                {/* Card Back */}
                <div className="card-back absolute w-full h-full bg-[#1e1b3a] rounded-2xl shadow-2xl p-6 flex flex-col justify-between text-white border border-white/10">
                    <div className="w-full h-12 bg-black mt-4"></div>
                    <div className="bg-slate-200 text-right p-2 rounded-md">
                        <span className="text-black italic font-mono pr-4">CVV</span>
                        <span className="bg-white text-black font-mono px-2 py-1 rounded">{cardData.cvv}</span>
                    </div>
                    <p className="text-xs text-slate-400 text-center">
                        For customer service, please visit our website. If this card is found, please cut it up and throw it away.
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default VirtualCard;