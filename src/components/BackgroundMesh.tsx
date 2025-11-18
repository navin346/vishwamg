import React from 'react';
import { useTheme } from '@/src/context/ThemeContext';

const BackgroundMesh: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`fixed inset-0 z-[-1] overflow-hidden pointer-events-none transition-colors duration-700 ${isDark ? 'bg-[#050505]' : 'bg-white'}`}>
      {/* CSS for continuous floating animation */}
      <style>
        {`
          @keyframes float-slow {
            0% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0, 0) scale(1); }
          }
          @keyframes float-slower {
            0% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(-30px, 50px) scale(1.2); }
            66% { transform: translate(20px, -20px) scale(0.8); }
            100% { transform: translate(0, 0) scale(1); }
          }
          @keyframes float-reverse {
            0% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(-20px, 30px) scale(0.9); }
            66% { transform: translate(30px, -40px) scale(1.1); }
            100% { transform: translate(0, 0) scale(1); }
          }
          .animate-float-1 { animation: float-slow 18s ease-in-out infinite; }
          .animate-float-2 { animation: float-slower 24s ease-in-out infinite; }
          .animate-float-3 { animation: float-reverse 20s ease-in-out infinite; }
        `}
      </style>

      {/* Light Mode: Very subtle, "Whitish" graphic feel with pastels */}
      {/* Dark Mode: Deep, ambient glow that doesn't reduce text contrast */}

      {/* Top Blob */}
      <div 
        className={`absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] rounded-full filter blur-[80px] opacity-40 animate-float-1 ${
          isDark ? 'bg-indigo-900/30 mix-blend-screen' : 'bg-indigo-100 mix-blend-multiply'
        }`} 
      />
      
      {/* Bottom Blob */}
      <div 
        className={`absolute bottom-[-10%] right-[-10%] w-[80vw] h-[80vw] rounded-full filter blur-[90px] opacity-40 animate-float-2 ${
          isDark ? 'bg-purple-900/20 mix-blend-screen' : 'bg-purple-100 mix-blend-multiply'
        }`} 
      />

      {/* Accent Blob (Middle/Side) */}
       <div 
        className={`absolute top-[40%] left-[30%] w-[50vw] h-[50vw] rounded-full filter blur-[100px] opacity-30 animate-float-3 ${
          isDark ? 'bg-blue-900/20 mix-blend-screen' : 'bg-sky-100 mix-blend-multiply'
        }`} 
      />

      {/* Noise Overlay for Texture - Extremely subtle */}
      <div className="absolute inset-0 opacity-[0.015] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150"></div>
    </div>
  );
};

export default BackgroundMesh;