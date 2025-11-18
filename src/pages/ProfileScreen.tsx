import React, { useState } from 'react';
import { useAppContext } from '@/src/context/AppContext';
import { ActiveModal, BankAccountType } from '@/src/MainApp';
import { User, ChevronRight, Settings, CreditCard, Landmark, LogOut, ShieldCheck, FileText } from 'lucide-react';

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

    const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
        <h3 className="text-xs font-bold text-gray-500 dark:text-neutral-500 uppercase tracking-wider mb-2 px-4 mt-8">{title}</h3>
    );

    const MenuGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-800 mx-4">
            {children}
        </div>
    );

    const MenuItem: React.FC<{ icon: React.ReactNode, title: string, subtitle?: string, onClick?: () => void, rightElement?: React.ReactNode, isDestructive?: boolean }> = ({ icon, title, subtitle, onClick, rightElement, isDestructive }) => (
        <button onClick={onClick} className="w-full p-4 flex items-center justify-between border-b border-gray-100 dark:border-neutral-800 last:border-0 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors text-left">
            <div className="flex items-center gap-3">
                <div className={`${isDestructive ? 'text-red-500' : 'text-gray-500 dark:text-neutral-400'}`}>{icon}</div>
                <div>
                    <p className={`font-semibold text-sm ${isDestructive ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>{title}</p>
                    {subtitle && <p className="text-xs text-gray-500 dark:text-neutral-500">{subtitle}</p>}
                </div>
            </div>
            {rightElement || <ChevronRight size={16} className="text-gray-400 dark:text-neutral-600" />}
        </button>
    );

    return (
        <div className="pb-24 min-h-full bg-gray-50 dark:bg-black pt-4">
            <div className="px-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Profile</h1>
                <p className="text-gray-500 dark:text-neutral-400">Manage your account and settings</p>
            </div>

            {/* Identity Card */}
            <div className="mx-4 bg-white dark:bg-neutral-900 rounded-3xl p-4 flex items-center gap-4 shadow-sm border border-gray-200 dark:border-neutral-800 mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
                    <User size={32} className="text-gray-400" />
                </div>
                <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">J. Doe</h2>
                    <p className="text-sm text-gray-500">+1 (555) 123-4567</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${kycStatus === 'verified' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700'}`}>
                        {kycStatus}
                    </span>
                     {kycStatus !== 'verified' && <button onClick={() => setAuthFlow('kycStart')} className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Verify</button>}
                </div>
            </div>

            {/* Banking Section */}
            <SectionHeader title="Banking & Payments" />
            <MenuGroup>
                {isInternational && (
                    <>
                        {ibanDetails ? (
                             <MenuItem 
                                icon={<Landmark size={20} />}
                                title="US Checking Account"
                                subtitle={`IBAN: ${ibanDetails.iban.slice(0, 8)}...`}
                                onClick={() => {}}
                                rightElement={<span className="text-xs font-bold text-gray-400">Details</span>}
                            />
                        ) : (
                             <MenuItem 
                                icon={<Landmark size={20} />}
                                title="Create IBAN / US Virtual Bank Account"
                                subtitle="Get local banking details"
                                onClick={handleCreateIban}
                                rightElement={isCreatingIban ? <span className="text-xs">...</span> : <span className="text-xs font-bold text-indigo-500">Create</span>}
                            />
                        )}
                    </>
                )}
                <MenuItem 
                    icon={<CreditCard size={20} />}
                    title="Add/Remove Bank Accounts"
                    subtitle={linkedAccounts.inr ? linkedAccounts.inr.bankName : (linkedAccounts.us ? linkedAccounts.us.bankName : "Manage linked accounts")}
                    onClick={() => openLinkBankModal(isInternational ? 'us' : 'inr')}
                    rightElement={<span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{linkedAccounts.inr || linkedAccounts.us ? 'Manage' : 'Link'}</span>}
                />
            </MenuGroup>

            {/* Preferences */}
            <SectionHeader title="Preferences" />
            <MenuGroup>
                <MenuItem icon={<Settings size={20} />} title="Spending Categories" onClick={() => setActiveModal('manage_categories')} />
                <MenuItem icon={<ShieldCheck size={20} />} title="Security & Privacy" onClick={() => {}} />
                <MenuItem icon={<FileText size={20} />} title="Statements" onClick={() => {}} />
            </MenuGroup>

            {/* App */}
            <SectionHeader title="App" />
            <MenuGroup>
                {installPrompt && <MenuItem icon={<CreditCard size={20} />} title="Install App" onClick={() => installPrompt.prompt()} />}
                <MenuItem isDestructive icon={<LogOut size={20} />} title="Sign Out" onClick={() => window.location.reload()} />
            </MenuGroup>
            
             <p className="text-center text-xs text-gray-400 dark:text-neutral-600 mt-8 mb-4">Vishwam v1.3.0</p>
        </div>
    );
};

export default ProfileScreen;