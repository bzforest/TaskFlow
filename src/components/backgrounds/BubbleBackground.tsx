import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function BubbleBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const springX = useSpring(mousePosition.x, { stiffness: 250, damping: 20 });
  const springY = useSpring(mousePosition.y, { stiffness: 250, damping: 20 });

  useEffect(() => {
    springX.set(mousePosition.x);
    springY.set(mousePosition.y);
  }, [mousePosition, springX, springY]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-linear-to-br from-indigo-300 via-pink-50 to-cyan-200">
      <svg className="absolute hidden">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      
      <div className="absolute inset-0 w-full h-full" style={{ filter: 'url(#goo)' }}>
        <motion.div 
          className="absolute top-[20%] left-[30%] w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply opacity-60"
          animate={{ x: [0, 80, -40, 0], y: [0, -60, 40, 0], scale: [1, 1.1, 0.9, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-[40%] right-[20%] w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply opacity-60"
          animate={{ x: [0, -60, 30, 0], y: [0, 80, -50, 0], scale: [1, 1.2, 0.8, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute -bottom-10 left-[40%] w-96 h-96 bg-green-200 rounded-full mix-blend-multiply opacity-60"
          animate={{ x: [0, 40, -60, 0], y: [0, -40, 60, 0], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute w-64 h-64 bg-brand-blue rounded-full mix-blend-multiply opacity-30"
          style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
        />
      </div>
    </div>
  );
}