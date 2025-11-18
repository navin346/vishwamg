import React from 'react';
import { useTheme } from '@/src/context/ThemeContext';

const BackgroundMesh: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Base Background */}
      <div className={`absolute inset-0 transition-colors duration-700 ${isDark ? 'bg-[#050505]' : 'bg-[#F2F4F6]'}`} />
      
      {/* Subtle Ambient Glows - Kast Style (No rainbow) */}
      <div 
        className={`absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse ${
          isDark ? 'bg-zinc-800' : 'bg-white'
        }`} 
      />
      
      <div 
        className={`absolute bottom-[-20%] right-[-10%] w-[80vw] h-[80vw] rounded-full mix-blend-screen filter blur-[100px] opacity-20 ${
          isDark ? 'bg-slate-800' : 'bg-indigo-50'
        }`} 
      />

      {/* Noise Overlay for Premium Texture */}
      <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150"></div>
    </div>
  );
};

export default BackgroundMesh;