import React from 'react';
import { Copy, Share2 } from 'lucide-react';
import { triggerHaptic } from '@/src/utils/haptics';
import { BankAccountDetails } from '@/src/services/banking/CoreBankingService';

interface BankDetailsCardProps {
    details: BankAccountDetails;
}

const BankDetailsCard: React.FC<BankDetailsCardProps> = ({ details }) => {
    
    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        triggerHaptic('light');
        // Ideally show a toast here, using alert for prototype simplicity
        // alert(`${label} copied!`); 
    };

    const DetailRow = ({ label, value }: { label: string, value: string }) => (
        <div className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0 group">
            <span className="text-sm text-gray-500 font-medium">{label}</span>
            <button 
                onClick={() => copyToClipboard(value, label)}
                className="text-right flex items-center gap-2 text-sm font-bold text-gray-900 group-hover:text-violet-600 transition-colors"
            >
                <span className="max-w-[180px] truncate">{value}</span>
                <Copy size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
        </div>
    );

    return (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden animate-slide-up">
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-bold text-lg opacity-90">GIFT City Wallet</h3>
                        <p className="text-xs text-indigo-100 font-medium tracking-wide">VIRTUAL ACCOUNT ({details.currency})</p>
                    </div>
                    <div className="bg-white/10 p-2 rounded-lg backdrop-blur-md">
                        <Share2 size={18} />
                    </div>
                </div>
                <p className="text-sm opacity-80 leading-relaxed">
                    Use these details to wire funds from any bank account globally. 
                    Funds usually arrive within 1-2 business days.
                </p>
            </div>
            
            <div className="p-6">
                <DetailRow label="Beneficiary Name" value={details.accountName} />
                <DetailRow label="Bank Name" value={details.bankName} />
                <DetailRow label="Account Number" value={details.accountNumber} />
                <DetailRow label="SWIFT / BIC" value={details.swiftCode} />
                {details.ifscCode && <DetailRow label="IFSC Code" value={details.ifscCode} />}
                {details.routingNumber && <DetailRow label="Routing Number" value={details.routingNumber} />}
                <DetailRow label="Branch" value={details.branchName} />
            </div>
            
            <div className="bg-gray-50 p-4 text-center">
                <p className="text-xs text-gray-400 font-medium">
                    Powered by GIFT City IFSC Banking Unit
                </p>
            </div>
        </div>
    );
};

export default BankDetailsCard;