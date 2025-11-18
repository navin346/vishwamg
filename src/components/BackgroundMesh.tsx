import React from 'react';
import { useTheme } from '@/src/context/ThemeContext';

const BackgroundMesh: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      <div className={`absolute inset-0 transition-colors duration-1000 ${isDark ? 'bg-black' : 'bg-gray-50'}`} />
      
      {/* Blob 1 - Top Left */}
      <div 
        className={`absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob ${
          isDark ? 'bg-indigo-900/60' : 'bg-purple-300'
        }`} 
      />
      
      {/* Blob 2 - Top Right */}
      <div 
        className={`absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob animation-delay-2000 ${
          isDark ? 'bg-blue-900/60' : 'bg-yellow-300'
        }`} 
      />
      
      {/* Blob 3 - Bottom Left */}
      <div 
        className={`absolute bottom-[-20%] left-[20%] w-[70vw] h-[70vw] rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob animation-delay-4000 ${
          isDark ? 'bg-purple-900/60' : 'bg-pink-300'
        }`} 
      />

      {/* Noise Overlay for texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150"></div>
      
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default BackgroundMesh;