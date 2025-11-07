import React, { useEffect, useRef } from 'react';

interface ScanQRProps {
  onTestPaymentClick: () => void;
  onCancel: () => void;
}

const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);


const ScanQR: React.FC<ScanQRProps> = ({ onTestPaymentClick, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (isMounted && videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        alert("Could not access the camera. Please ensure permissions are granted.");
        onCancel();
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [onCancel]);

  return (
    <div className="fixed inset-0 bg-black z-30 flex flex-col items-center justify-center">
      <video ref={videoRef} autoPlay playsInline className="absolute top-0 left-0 w-full h-full object-cover"></video>
      
      {/* Overlay UI */}
      <div className="absolute inset-0 flex flex-col justify-between p-4">
        {/* Top bar */}
        <div className="flex justify-start">
            <button onClick={onCancel} className="bg-black/50 p-3 rounded-full text-white" aria-label="Back">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
        </div>

        {/* Scanner frame */}
        <div className="flex-grow flex items-center justify-center">
            <div className="w-64 h-64 border-4 border-dashed border-white/70 rounded-2xl relative">
                {/* Scanner line animation can be added here */}
            </div>
        </div>

        {/* Bottom bar */}
        <div className="pb-8">
            <button 
                onClick={onTestPaymentClick}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out"
            >
                Use Test Payment
            </button>
        </div>
      </div>
    </div>
  );
};

export default ScanQR;