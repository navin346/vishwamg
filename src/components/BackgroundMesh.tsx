import React from 'react';
import { useTheme } from '@/src/context/ThemeContext';

const BackgroundMesh: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`fixed inset-0 z-[-1] overflow-hidden pointer-events-none transition-colors duration-700 ${isDark ? 'bg-[#000000]' : 'bg-[#ffffff]'}`}>
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

      {/* Light Mode: Pure white base with very faint, clean pastel blobs. */}
      {/* Dark Mode: Deep black with ambient glow, not interfering with text. */}

      {/* Top Blob */}
      <div 
        className={`absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] rounded-full filter blur-[80px] animate-float-1 ${
          isDark ? 'bg-indigo-900/20 mix-blend-screen opacity-40' : 'bg-indigo-50 mix-blend-multiply opacity-60'
        }`} 
      />
      
      {/* Bottom Blob */}
      <div 
        className={`absolute bottom-[-10%] right-[-10%] w-[80vw] h-[80vw] rounded-full filter blur-[90px] animate-float-2 ${
          isDark ? 'bg-purple-900/20 mix-blend-screen opacity-40' : 'bg-purple-50 mix-blend-multiply opacity-60'
        }`} 
      />

      {/* Accent Blob (Middle/Side) */}
       <div 
        className={`absolute top-[40%] left-[30%] w-[50vw] h-[50vw] rounded-full filter blur-[100px] animate-float-3 ${
          isDark ? 'bg-blue-900/15 mix-blend-screen opacity-30' : 'bg-sky-50 mix-blend-multiply opacity-50'
        }`} 
      />

      {/* Noise Overlay for Texture - Extremely subtle */}
      <div className="absolute inset-0 opacity-[0.015] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150"></div>
    </div>
  );
};

export default BackgroundMesh;