import React, { ReactNode } from 'react';

interface InfoCardProps {
  header: string;
  children: ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ header, children }) => {
  return (
    <div className="bg-slate-800 rounded-xl p-6 md:p-8 shadow-2xl border border-slate-700">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4 border-b border-slate-700 pb-2">{header}</h2>
      <div className="text-slate-300 space-y-4">
        {children}
      </div>
    </div>
  );
};

export default InfoCard;
