
import React from 'react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700 hover:border-cyan-500 hover:scale-105 transition-all duration-300">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  );
};

export default FeatureCard;
