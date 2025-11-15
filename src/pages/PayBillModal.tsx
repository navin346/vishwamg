import React from 'react';

interface ModalProps {
    onClose: () => void;
    billerName: string;
    amount: number;
}

const PayBillModal: React.FC<ModalProps> = ({ onClose, billerName, amount }) => {
    const handlePayNow = () => {
        // This UPI link will open a payment app on the user's phone
        window.location.href = `upi://pay?pa=demo@vishwam&pn=Investor%20Demo&am=${amount.toFixed(2)}&cu=INR&tn=Mock%20Bill%20Payment%20for%20${billerName}`;
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-2xl p-6 shadow-xl animate-slide-up">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Confirm Payment</h2>
                    <button onClick={onClose} className="text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="text-center py-4">
                    <p className="text-sm text-gray-500 dark:text-neutral-400 mb-2">You are about to pay</p>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">₹{amount.toFixed(2)}</p>
                    <p className="text-lg text-gray-600 dark:text-neutral-300 mt-1">to {billerName}</p>
                </div>

                <button
                    onClick={handlePayNow}
                    className="w-full mt-6 bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform active:scale-95"
                >
                    Pay Now
                </button>
            </div>
            <style>{`
                @keyframes slide-up {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default PayBillModal;
