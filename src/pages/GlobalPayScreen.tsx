import React from 'react';
import ServiceIcon from '../components/ServiceIcon';

// Icons for the feature cards
const MobileTopUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 14l-3-3m0 0l-3 3m3-3v7" /></svg>;
const TravelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;
const SubscriptionsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const ForexIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;

const services = [
    {
        icon: <MobileTopUpIcon />,
        label: "Mobile Top-up",
        color: "bg-gradient-to-br from-sky-500 to-indigo-500"
    },
    {
        icon: <TravelIcon />,
        label: "Travel & Bookings",
        color: "bg-gradient-to-br from-amber-500 to-orange-500"
    },
    {
        icon: <SubscriptionsIcon />,
        label: "Subscriptions",
        color: "bg-gradient-to-br from-emerald-500 to-green-500"
    },
    {
        icon: <ForexIcon />,
        label: "Forex Card",
        color: "bg-gradient-to-br from-rose-500 to-pink-500"
    }
]

const GlobalPayScreen: React.FC = () => {
    return (
        <div className="p-4 space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Global Pay & Travel</h1>
             <p className="text-gray-600 dark:text-neutral-400">
                Manage your international spending and services.
            </p>
            <div className="grid grid-cols-4 gap-x-2 gap-y-6 pt-4">
               {services.map(service => (
                   <ServiceIcon 
                        key={service.label}
                        icon={service.icon}
                        label={service.label}
                        color={service.color}
                   />
               ))}
            </div>
        </div>
    );
};

export default GlobalPayScreen;
