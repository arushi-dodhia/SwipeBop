import React, { useEffect, useRef } from 'react';

const MultiCenterGradient = ({ children }) => {
  const canvasRef = useRef(null);
  let animationFrameId = null;
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let frame = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animateGradient = () => {
      if (!canvas) return;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#FBE4F1';
      ctx.fillRect(0, 0, width, height);

      const centers = [
        { x: width * 0.2, y: height * 0.2, color: '#EE4A1B', radius: width * 0.4 },
        { x: width * 0.8, y: height * 0.3, color: '#EE4A1B', radius: width * 0.5 },
        { x: width * 0.3, y: height * 0.8, color: '#0578FF', radius: width * 0.4 },
        { x: width * 0.7, y: height * 0.9, color: '#EE4A1B', radius: width * 0.35 },
        { x: width * 0.7, y: height * 0.2, color: '#0578FF', radius: width * 0.15 },
        { x: width * 0.6, y: height * 0.2, color: '#F194C9', radius: width * 0.2 }
      ];

      centers.forEach(({ x, y, color, radius }) => {
        const animatedRadius = radius * (0.8 + 0.2 * Math.sin(frame * 0.02)); // Pulsating effect
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, animatedRadius);
        gradient.addColorStop(0, `${color}88`); // 88 ~ 50% opacity
        gradient.addColorStop(1, 'rgba(251, 228, 241, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      });

      frame++;
      animationFrameId = requestAnimationFrame(animateGradient);
    };

    const startAnimation = () => {
      resizeCanvas();
      cancelAnimationFrame(animationFrameId); // Avoid multiple loops
      animateGradient();
    };

    window.addEventListener('resize', startAnimation);
    startAnimation(); // Initial call

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', startAnimation);
    };
  }, []);

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      <canvas 
        ref={canvasRef} 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default MultiCenterGradient;