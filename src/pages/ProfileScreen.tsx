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
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-4 mt-8">{title}</h3>
    );

    const MenuGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm mx-4">
            {children}
        </div>
    );

    const MenuItem: React.FC<{ icon: React.ReactNode, title: string, subtitle?: string, onClick?: () => void, rightElement?: React.ReactNode, isDestructive?: boolean }> = ({ icon, title, subtitle, onClick, rightElement, isDestructive }) => (
        <button onClick={onClick} className="w-full p-4 flex items-center justify-between border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors text-left group">
            <div className="flex items-center gap-4">
                <div className={`${isDestructive ? 'text-red-500 bg-red-50' : 'text-gray-600 bg-gray-50'} p-2 rounded-xl`}>{icon}</div>
                <div>
                    <p className={`font-bold text-sm ${isDestructive ? 'text-red-500' : 'text-gray-900'}`}>{title}</p>
                    {subtitle && <p className="text-xs text-gray-500 mt-0.5 font-medium">{subtitle}</p>}
                </div>
            </div>
            {rightElement || <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />}
        </button>
    );

    return (
        <div className="pb-24 min-h-full bg-[#FDFDFD] pt-6">
            <div className="px-6 mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">Profile</h1>
                <p className="text-gray-500 font-medium">Manage your account and settings</p>
            </div>

            {/* Identity Card */}
            <div className="mx-4 bg-white rounded-[2rem] p-5 flex items-center gap-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 mb-8">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <User size={32} className="text-gray-400" />
                </div>
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900">J. Doe</h2>
                    <p className="text-sm text-gray-500">+1 (555) 123-4567</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase border ${kycStatus === 'verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                        {kycStatus}
                    </span>
                     {kycStatus !== 'verified' && <button onClick={() => setAuthFlow('kycStart')} className="text-xs font-bold text-violet-600 hover:text-violet-700">Verify Now</button>}
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
                                rightElement={isCreatingIban ? <span className="text-xs">...</span> : <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded-md">Create</span>}
                            />
                        )}
                    </>
                )}
                <MenuItem 
                    icon={<CreditCard size={20} />}
                    title="Add/Remove Bank Accounts"
                    subtitle={linkedAccounts.inr ? linkedAccounts.inr.bankName : (linkedAccounts.us ? linkedAccounts.us.bankName : "Manage linked accounts")}
                    onClick={() => openLinkBankModal(isInternational ? 'us' : 'inr')}
                    rightElement={<span className="text-xs font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded-md">{linkedAccounts.inr || linkedAccounts.us ? 'Manage' : 'Link'}</span>}
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
            
             <p className="text-center text-xs text-gray-300 mt-12 mb-4 font-medium">Vishwam v1.3.0</p>
        </div>
    );
};

export default ProfileScreen;