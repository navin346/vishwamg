import React from 'react';
import { useTheme } from '@/src/context/ThemeContext';

const BackgroundMesh: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-gray-50 dark:bg-[#050505] transition-colors duration-700">
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
          .animate-float-1 { animation: float-slow 15s ease-in-out infinite; }
          .animate-float-2 { animation: float-slower 20s ease-in-out infinite; }
        `}
      </style>

      {/* Top Blob */}
      <div 
        className={`absolute top-[-20%] left-[-10%] w-[90vw] h-[90vw] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-30 dark:opacity-25 animate-float-1 ${
          isDark ? 'bg-indigo-900' : 'bg-purple-200'
        }`} 
      />
      
      {/* Bottom Blob */}
      <div 
        className={`absolute bottom-[-20%] right-[-10%] w-[90vw] h-[90vw] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-30 dark:opacity-25 animate-float-2 ${
          isDark ? 'bg-slate-800' : 'bg-indigo-200'
        }`} 
      />

      {/* Accent Blob (Middle) */}
       <div 
        className={`absolute top-[30%] left-[20%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-20 dark:opacity-15 animate-pulse ${
          isDark ? 'bg-blue-900' : 'bg-pink-100'
        }`} 
      />

      {/* Noise Overlay for Texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150"></div>
    </div>
  );
};

export default BackgroundMesh;