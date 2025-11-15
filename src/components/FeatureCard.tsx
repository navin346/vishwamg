import React from 'react';

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, color }) => {
    return (
        <button className={`w-full text-left rounded-xl p-6 text-white shadow-lg flex flex-col justify-between bg-gradient-to-br transition-transform transform active:scale-95 ${color}`}>
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-lg mb-1">{title}</h3>
                <p className="text-sm text-white/80">{description}</p>
            </div>
        </button>
    );
};

export default FeatureCard;
