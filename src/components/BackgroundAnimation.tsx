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
            // Initialize with default settings
            const effect = (window as any).VANTA.NET({
              el: vantaRef.current,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.00,
              minWidth: 200.00,
              scale: 1.00,
              scaleMobile: 1.00,
              // Initial generic colors, will be overwritten by the effect below
              color: 0x6366f1,
              backgroundColor: 0xf0f4f8,
              points: 15.00,
              maxDistance: 23.00,
              spacing: 17.00,
              showDots: true
            });
            setVantaEffect(effect);
        } catch (e) {
            console.error("Vanta JS failed to load", e);
        }
      }
    };

    const timeout = setTimeout(loadEffect, 50);
    return () => {
        clearTimeout(timeout);
        if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  // Dynamic Theme Updates - Making visuals more compelling
  useEffect(() => {
    if (vantaEffect) {
        const isDark = theme === 'dark';
        vantaEffect.setOptions({
            // Compelling colors: Vivid Violet vs Deep Indigo
            color: isDark ? 0x7c3aed : 0x4f46e5, 
            // Background: Deep Void Black vs Crisp Off-White
            backgroundColor: isDark ? 0x050505 : 0xf8fafc, 
            // Make points slightly denser
            points: isDark ? 13.00 : 14.00,
            // Increase max distance for more connections in dark mode
            maxDistance: isDark ? 25.00 : 22.00,
            spacing: isDark ? 16.00 : 18.00,
            backgroundAlpha: 1
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
            transition: 'background-color 0.5s ease' // Smooth transition for the canvas container
        }} 
    />
  );
};

export default BackgroundAnimation;
