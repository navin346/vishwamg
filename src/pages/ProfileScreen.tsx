import React, { useState } from 'react';
import { useAppContext } from '@/src/context/AppContext';
import { ActiveModal, BankAccountType } from '@/src/MainApp';

interface ProfileScreenProps {
    setActiveModal: (modal: ActiveModal) => void;
    openLinkBankModal: (type: BankAccountType) => void;
    installPrompt: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ setActiveModal, openLinkBankModal, installPrompt }) => {
    const { userMode, kycStatus, ibanDetails, createIbanAccount, linkedAccounts, setAuthFlow } = useAppContext();
    const isInternational = userMode === 'INTERNATIONAL';
    const [isCreatingIban, setIsCreatingIban] = useState(false);

    const handleCreateIban = async () => {
        setIsCreatingIban(true);
        await createIbanAccount();
        setIsCreatingIban(false);
    }

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
        <div className="p-4 text-gray-900 dark:text-white space-y-6">
            <h1 className="text-3xl font-bold">Profile & Settings</h1>

            {/* User Info Card */}
            <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm rounded-xl p-4 flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white text-2xl">
                    J
                </div>
                <div>
                    <p className="font-bold text-lg">J. Doe</p>
                    <p className="text-sm text-gray-500 dark:text-neutral-400">+1 (555) 123-4567</p>
                </div>
            </div>

            {/* KYC Status */}
            <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold">Identity Verification</h3>
                    {getKycStatusPill()}
                </div>
                <p className="text-sm text-gray-500 dark:text-neutral-400 mb-4">
                    {kycStatus === 'unverified' && "Complete verification to unlock all features, including the international virtual card."}
                    {kycStatus === 'pending' && "Your documents are under review. This usually takes a few minutes."}
                    {kycStatus === 'verified' && "Your account is fully verified. You have access to all features."}
                </p>
                {kycStatus === 'unverified' && (
                    <button onClick={() => setAuthFlow('kycStart')} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">
                        Start KYC
                    </button>
                )}
            </div>
            
            {/* International-specific Info */}
            {isInternational && (
                <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm rounded-xl p-4">
                    <h3 className="font-bold mb-2">Your IBAN Account</h3>
                    {ibanDetails ? (
                         <div className="bg-gray-100 dark:bg-neutral-800 rounded-lg p-3 font-mono text-sm">
                            <p className="text-gray-500 text-xs">IBAN</p>
                            <p>{ibanDetails.iban}</p>
                            <p className="text-gray-500 text-xs mt-2">BIC</p>
                            <p>{ibanDetails.bic}</p>
                        </div>
                    ) : (
                        <>
                         <p className="text-sm text-gray-500 dark:text-neutral-400 mb-4">Activate your personal IBAN to receive bank transfers from around the world.</p>
                         <button onClick={handleCreateIban} disabled={isCreatingIban} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm disabled:bg-violet-400 disabled:cursor-not-allowed">
                            {isCreatingIban ? 'Activating...' : 'Create IBAN Account'}
                         </button>
                        </>
                    )}
                </div>
            )}
            
            {/* India-specific Cards */}
            {!isInternational && (
                 <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm rounded-xl p-4 space-y-3">
                    <h3 className="font-bold text-base mb-1">Linked Cards</h3>
                     <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-sm">Debit & Credit Cards</p>
                            <p className="text-xs text-gray-500 dark:text-neutral-400">No cards linked</p>
                        </div>
                        <button disabled className="text-sm font-bold px-3 py-1 rounded-md bg-gray-200 dark:bg-neutral-700/50 text-gray-800/50 dark:text-white/50 cursor-not-allowed">
                            Add
                        </button>
                    </div>
                </div>
            )}


            {/* Linked Accounts */}
            <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm rounded-xl p-4 space-y-3">
                <h3 className="font-bold text-base mb-1">Linked Bank Accounts</h3>
                {isInternational && (
                    <LinkedAccountItem 
                        title="US Bank Account" 
                        subtitle={linkedAccounts.us ? `${linkedAccounts.us.bankName} ••••${linkedAccounts.us.accountNumber.slice(-4)}` : "For adding funds (on-ramp)"}
                        isLinked={!!linkedAccounts.us}
                        onClick={() => openLinkBankModal('us')}
                    />
                )}
                 <LinkedAccountItem 
                    title="Indian Bank Account" 
                    subtitle={linkedAccounts.inr ? `${linkedAccounts.inr.bankName} ••••${linkedAccounts.inr.accountNumber.slice(-4)}` : "For withdrawals (off-ramp)"}
                    isLinked={!!linkedAccounts.inr}
                    onClick={() => openLinkBankModal('inr')}
                 />
            </div>
            
            {/* App Settings */}
            <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm rounded-xl p-4">
                <h3 className="font-bold text-base mb-3">App Settings</h3>
                <button onClick={() => setActiveModal('manage_categories')} className="w-full flex justify-between items-center text-left p-2 -mx-2 rounded-lg hover:bg-gray-100/80 dark:hover:bg-neutral-800/80 transition-colors">
                    <span>Manage Spending Categories</span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
                 {installPrompt && (
                    <button onClick={() => installPrompt.prompt()} className="w-full flex justify-between items-center text-left p-2 -mx-2 rounded-lg hover:bg-gray-100/80 dark:hover:bg-neutral-800/80 transition-colors mt-2">
                        <span>Install Vishwam App</span>
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    </button>
                )}
            </div>
        </div>
    );
};

const LinkedAccountItem: React.FC<{title: string, subtitle: string, isLinked: boolean, onClick: () => void}> = ({ title, subtitle, isLinked, onClick }) => (
    <div className="flex items-center justify-between">
        <div>
            <p className="font-semibold text-sm">{title}</p>
            <p className="text-xs text-gray-500 dark:text-neutral-400">{subtitle}</p>
        </div>
        <button onClick={onClick} className={`text-sm font-bold px-3 py-1 rounded-md ${isLinked ? 'bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-white' : 'bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300'}`}>
            {isLinked ? 'Manage' : 'Add'}
        </button>
    </div>
)


export default ProfileScreen;
