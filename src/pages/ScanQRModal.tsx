import React from 'react';
import { useAppContext } from '../context/AppContext';

interface ModalProps {
    onClose: () => void;
}

const ScanQRModal: React.FC<ModalProps> = ({ onClose }) => {
    const { userMode } = useAppContext();
    const isIndiaMode = userMode === 'INDIA';

    const title = isIndiaMode ? 'Scan UPI to Pay' : 'Scan Wallet to Pay';
    const subtitle = isIndiaMode
        ? 'Position any UPI QR code inside the frame'
        : 'Position the recipient\'s wallet address QR code inside the frame';

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-center text-white animate-fade-in">
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
                 <h2 className="text-xl font-bold">{title}</h2>
                 <button onClick={onClose} className="bg-white/10 hover:bg-white/20 rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                {/* Placeholder for camera feed */}
                <div className="w-full h-full bg-black rounded-lg"></div>

                {/* Corner brackets */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>

                {/* Scanning line animation */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-violet-400/80 rounded-full shadow-[0_0_15px_2px_rgba(192,132,252,0.7)] animate-scan"></div>
            </div>

            <p className="mt-6 text-center max-w-xs">{subtitle}</p>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
                @keyframes scan {
                    0% { transform: translateY(0); opacity: 0.8; }
                    50% { transform: translateY(16rem); opacity: 1; } /* 64 * 4px = 256px */
                    100% { transform: translateY(0); opacity: 0.8; }
                }
                @media (min-width: 640px) {
                    @keyframes scan {
                        0% { transform: translateY(0); opacity: 0.8; }
                        50% { transform: translateY(20rem); opacity: 1; } /* 80 * 4px = 320px */
                        100% { transform: translateY(0); opacity: 0.8; }
                    }
                }
                .animate-scan {
                    animation: scan 2.5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default ScanQRModal;
