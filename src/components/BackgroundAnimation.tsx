import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const BackgroundAnimation: React.FC = () => {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    // Ensure VANTA and THREE are loaded from the CDN scripts in index.html
    if ((window as any).VANTA && !vantaEffect) {
      setVantaEffect((window as any).VANTA.NET({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyrocontrols: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x7c3aed, // Corresponds to violet-600
        backgroundColor: theme === 'dark' ? 0x0 : 0xfafafa, // Black or roughly bg-gray-50
        points: theme === 'dark' ? 10.00 : 12.00,
        maxDistance: 20.00,
        spacing: 15.00
      }));
    }
    
    // Cleanup function to destroy the effect when the component unmounts
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]); // Dependency array ensures this runs only once to initialize

  // Update options when theme changes
  useEffect(() => {
      if (vantaEffect) {
          vantaEffect.setOptions({
              backgroundColor: theme === 'dark' ? 0x0 : 0xfafafa, // Black or bg-gray-50
              points: theme === 'dark' ? 10.00 : 12.00,
          })
      }
  }, [theme, vantaEffect]);

  return <div ref={vantaRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }} />;
};

export default BackgroundAnimation;