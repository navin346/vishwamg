import React from 'react';
import { useAppContext } from '../context/AppContext';
import { ActiveModal } from '../MainApp';

interface ProfileScreenProps {
    setActiveModal: (modal: ActiveModal) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ setActiveModal }) => {
    const { userMode, kycStatus } = useAppContext();
    const isInternational = userMode === 'INTERNATIONAL';

    const getKycStatusPill = () => {
        switch (kycStatus) {
            case 'verified':
                return <span className="text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2.5 py-0.5 rounded-full">Verified</span>;
            case 'pending':
                return <span className="text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 px-2.5 py-0.5 rounded-full">Pending</span>;
            default:
                return <span className="text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-2.5 py-0.5 rounded-full">Unverified</span>;
        }
    };

    return (
        <div className="p-4 text-black dark:text-white">
            <h1 className="text-3xl font-bold mb-6">Profile & Settings</h1>

            {/* User Info Card */}
            <div className="bg-slate-50 dark:bg-neutral-900 rounded-xl p-4 flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white text-2xl">
                    J
                </div>
                <div>
                    <p className="font-bold text-lg">J. Doe</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">+1 (555) 123-4567</p>
                </div>
            </div>

            {/* KYC Status */}
            <div className="bg-slate-50 dark:bg-neutral-900 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold">Identity Verification</h3>
                    {getKycStatusPill()}
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                    {kycStatus === 'unverified' && "Complete verification to unlock all features, including the international virtual card."}
                    {kycStatus === 'pending' && "Your documents are under review. This usually takes a few minutes."}
                    {kycStatus === 'verified' && "Your account is fully verified. You have access to all features."}
                </p>
                {kycStatus === 'unverified' && (
                    <button onClick={() => setActiveModal('kyc')} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">
                        Start KYC
                    </button>
                )}
            </div>
            
            {/* International-specific Info */}
            {isInternational && (
                <div className="bg-slate-50 dark:bg-neutral-900 rounded-xl p-4 mb-6">
                    <h3 className="font-bold mb-2">Your IBAN Account</h3>
                    <div className="bg-slate-200 dark:bg-neutral-800 rounded-lg p-3 font-mono text-sm">
                        <p className="text-neutral-500 text-xs">IBAN</p>
                        <p>DE89 3704 0044 0532 0130 00</p>
                        <p className="text-neutral-500 text-xs mt-2">BIC</p>
                        <p>COBADEFFXXX</p>
                    </div>
                     <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">Use these details to receive funds into your Vishwam wallet.</p>
                </div>
            )}
        </div>
    );
};

export default ProfileScreen;
