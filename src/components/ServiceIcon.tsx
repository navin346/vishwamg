import React from 'react';

interface ServiceIconProps {
    icon: React.ReactNode;
    label: string;
    color: string;
    onClick?: () => void;
}

const ServiceIcon: React.FC<ServiceIconProps> = ({ icon, label, color, onClick }) => {
    return (
        <button 
            onClick={onClick} 
            className="flex flex-col items-center justify-center space-y-2 group"
            aria-label={label}
        >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all transform group-active:scale-90 ${color}`}>
                {icon}
            </div>
            <p className="text-xs font-medium text-center text-gray-700 dark:text-neutral-300">
                {label}
            </p>
        </button>
    );
};

export default ServiceIcon;
