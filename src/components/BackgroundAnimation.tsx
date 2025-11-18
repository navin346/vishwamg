import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/src/context/ThemeContext';

const BackgroundAnimation: React.FC = () => {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const loadEffect = () => {
      if ((window as any).VANTA && vantaRef.current && !vantaEffect) {
        try {
            const effect = (window as any).VANTA.NET({
              el: vantaRef.current,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.00,
              minWidth: 200.00,
              scale: 1.00,
              scaleMobile: 1.00,
              points: 14.00,
              maxDistance: 24.00,
              spacing: 18.00,
              showDots: true
            });
            setVantaEffect(effect);
        } catch (e) {
            console.error("Vanta JS failed to load", e);
        }
      }
    };

    // Small delay to ensure scripts are loaded
    const timeout = setTimeout(loadEffect, 100);
    return () => {
        clearTimeout(timeout);
        if (vantaEffect) vantaEffect.destroy();
    };
  }, []); // Run once on mount

  // Dynamic Theme Updates
  useEffect(() => {
    if (vantaEffect) {
        const isDark = theme === 'dark';
        vantaEffect.setOptions({
            color: isDark ? 0x8b5cf6 : 0x6366f1, // Violet-500 vs Indigo-500
            backgroundColor: isDark ? 0x050505 : 0xf0f4f8, // Almost Black vs Light Blue-Grey
            points: isDark ? 12.00 : 14.00,
            maxDistance: isDark ? 24.00 : 22.00,
            backgroundAlpha: 1 // Ensure full opacity for the canvas itself
        });
    }
  }, [theme, vantaEffect]);

  return (
    <div 
        ref={vantaRef} 
        style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            zIndex: -1,
        }} 
    />
  );
};

export default BackgroundAnimation;
