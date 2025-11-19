import React from 'react';

const BackgroundMesh: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#FDFDFD]">
      <style>
        {`
          @keyframes float-gentle {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -30px) scale(1.05); }
            66% { transform: translate(-20px, 20px) scale(0.95); }
          }
          @keyframes float-drift {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-40px, 10px) scale(1.1); }
          }
        `}
      </style>

      {/* Premium Light Aesthetics - "Aave-like"
          Using very soft, high-key gradients that blend into white. 
          Avoids muddiness by keeping opacity low and blur high.
      */}

      {/* Top Left - Soft Violet/Blue */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-[float-gentle_15s_ease-in-out_infinite]"
        style={{ background: 'radial-gradient(circle, #a78bfa 0%, transparent 70%)' }} 
      />
      
      {/* Top Right - Soft Pink/Fuchsia */}
      <div 
        className="absolute top-[0%] right-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-[float-drift_20s_ease-in-out_infinite]"
        style={{ background: 'radial-gradient(circle, #f472b6 0%, transparent 70%)' }} 
      />

      {/* Bottom Center - Soft Cyan/Teal */}
      <div 
        className="absolute bottom-[-10%] left-[20%] w-[80vw] h-[80vw] rounded-full mix-blend-multiply filter blur-[100px] opacity-15 animate-[float-gentle_18s_ease-in-out_infinite_reverse]"
        style={{ background: 'radial-gradient(circle, #22d3ee 0%, transparent 70%)' }} 
      />
      
      {/* Subtle texture overlay for paper-like feel */}
      <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150"></div>
    </div>
  );
};

export default BackgroundMesh;