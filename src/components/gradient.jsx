import React, { useEffect, useRef } from 'react';

const MultiCenterGradient = ({ children }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const updateGradient = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#FBE4F1'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const centers = [
        { x: canvas.width * 0.2, y: canvas.height * 0.2, color: '#EE4A1BE3', radius: canvas.width * 0.6 }, 
        { x: canvas.width * 0.8, y: canvas.height * 0.3, color: '#EE4A1BE3', radius: canvas.width * 0.7 }, 
        { x: canvas.width * 0.3, y: canvas.height * 0.8, color: '#0578FFE5', radius: canvas.width * 0.6 }, 
        { x: canvas.width * 0.7, y: canvas.height * 0.9, color: '#EE4A1BE3', radius: canvas.width * 0.5 } , 
        { x: canvas.width * 0.7, y: canvas.height * 0.2, color: '#0578FFE5', radius: canvas.width * 0.2 }, 
        { x: canvas.width * 0.6, y: canvas.height * 0.2, color: '#F194C9', radius: canvas.width * 0.3 } 
      ];
      
      centers.forEach(center => {
        const gradient = ctx.createRadialGradient(
          center.x, center.y, 0,
          center.x, center.y, center.radius
        );
        

        const rgbaColor = hexToRgba(center.color, 0.4); 
        
        gradient.addColorStop(0, rgbaColor);
        gradient.addColorStop(1, 'rgba(251, 228, 241, 0)');
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });
      
      ctx.globalCompositeOperation = 'overlay';
      ctx.globalAlpha = 0.001;
      
      for (let x = 0; x < canvas.width; x += 4) {
        for (let y = 0; y < canvas.height; y += 4) {
          const value = Math.floor(Math.random() * 255);
          ctx.fillStyle = `rgb(${value}, ${value}, ${value})`;
          ctx.fillRect(x, y, 4, 4);
        }
      }
    };
    
    const hexToRgba = (hex, alpha = 1) => {
      if (!hex) return `rgba(0, 0, 0, ${alpha})`;
      
      hex = hex.replace('#', '');
      
      let hexAlpha = alpha;
      if (hex.length === 8) {
        hexAlpha = parseInt(hex.slice(6, 8), 16) / 255;
        hex = hex.slice(0, 6);
      }
      
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      
      return `rgba(${r}, ${g}, ${b}, ${hexAlpha})`;
    };
    
    updateGradient();
    window.addEventListener('resize', updateGradient);
    
    return () => window.removeEventListener('resize', updateGradient);
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
