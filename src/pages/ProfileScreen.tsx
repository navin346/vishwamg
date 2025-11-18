import React, { useState } from 'react';
import { useAppContext } from '@/src/context/AppContext';
import { ActiveModal, BankAccountType } from '@/src/MainApp';
import { Camera, User, ChevronRight, Settings, CreditCard, Landmark, LogOut } from 'lucide-react';

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
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 px-1 mt-6">{title}</h3>
    );

    const MenuItem: React.FC<{ icon: React.ReactNode, title: string, subtitle?: string, onClick?: () => void, rightElement?: React.ReactNode }> = ({ icon, title, subtitle, onClick, rightElement }) => (
        <button onClick={onClick} className="w-full bg-white dark:bg-zinc-900 p-4 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors text-left first:rounded-t-2xl last:rounded-b-2xl">
            <div className="flex items-center gap-3">
                <div className="text-zinc-500 dark:text-zinc-400">{icon}</div>
                <div>
                    <p className="font-semibold text-zinc-900 dark:text-white text-sm">{title}</p>
                    {subtitle && <p className="text-xs text-zinc-500">{subtitle}</p>}
                </div>
            </div>
            {rightElement || <ChevronRight size={16} className="text-zinc-400" />}
        </button>
    );

    return (
        <div className="p-5 pb-24 bg-zinc-50 dark:bg-zinc-950 min-h-full">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">Profile</h1>

            {/* User Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-zinc-200 dark:border-zinc-800">
                <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <User size={32} className="text-zinc-400" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white">J. Doe</h2>
                    <p className="text-sm text-zinc-500">+1 (555) 123-4567</p>
                    <div className="mt-2 flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${kycStatus === 'verified' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700'}`}>
                            {kycStatus}
                        </span>
                        {kycStatus !== 'verified' && <button onClick={() => setAuthFlow('kycStart')} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 underline">Verify Now</button>}
                    </div>
                </div>
            </div>

            {/* International IBAN */}
            {isInternational && (
                <>
                    <SectionHeader title="Banking" />
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                         {ibanDetails ? (
                            <div className="p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-bold text-zinc-900 dark:text-white">Your US Account</span>
                                    <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-600 dark:text-zinc-400">Checking</span>
                                </div>
                                <div className="space-y-1 font-mono text-xs text-zinc-500">
                                    <div className="flex justify-between"><span>IBAN</span> <span className="text-zinc-900 dark:text-white">{ibanDetails.iban}</span></div>
                                    <div className="flex justify-between"><span>BIC</span> <span className="text-zinc-900 dark:text-white">{ibanDetails.bic}</span></div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 text-center">
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">Get your own US bank account details.</p>
                                <button onClick={handleCreateIban} disabled={isCreatingIban} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2 rounded-lg w-full transition-colors">
                                    {isCreatingIban ? 'Creating...' : 'Create Account'}
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}

            <SectionHeader title="Linked Accounts" />
            <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                {isInternational && (
                    <MenuItem 
                        icon={<Landmark size={20} />}
                        title="US Bank Account"
                        subtitle={linkedAccounts.us ? linkedAccounts.us.bankName : "Not linked"}
                        onClick={() => openLinkBankModal('us')}
                        rightElement={<span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{linkedAccounts.us ? 'Manage' : 'Add'}</span>}
                    />
                )}
                <MenuItem 
                    icon={<Landmark size={20} />}
                    title="Indian Bank Account"
                    subtitle={linkedAccounts.inr ? linkedAccounts.inr.bankName : "Not linked"}
                    onClick={() => openLinkBankModal('inr')}
                    rightElement={<span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{linkedAccounts.inr ? 'Manage' : 'Add'}</span>}
                />
            </div>

            <SectionHeader title="Settings" />
            <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                <MenuItem icon={<Settings size={20} />} title="Spending Categories" onClick={() => setActiveModal('manage_categories')} />
                {installPrompt && <MenuItem icon={<CreditCard size={20} />} title="Install App" onClick={() => installPrompt.prompt()} />}
                <MenuItem icon={<LogOut size={20} />} title="Sign Out" onClick={() => window.location.reload()} />
            </div>
            
             <p className="text-center text-xs text-zinc-400 mt-8">Version 1.0.2 • Built with Gemini 3.0</p>
        </div>
    );
};

export default ProfileScreen;