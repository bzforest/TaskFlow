import { useEffect, useRef } from 'react';

export default function HexagonBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const hexSize = 35; 
    const hexWidth = Math.sqrt(3) * hexSize;
    const rowHeight = 1.5 * hexSize;

    function drawHexagon(x: number, y: number, size: number, glow: number) {
      ctx!.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle_deg = 60 * i - 30;
        const angle_rad = Math.PI / 180 * angle_deg;
        const px = x + size * Math.cos(angle_rad);
        const py = y + size * Math.sin(angle_rad);
        if (i === 0) ctx!.moveTo(px, py);
        else ctx!.lineTo(px, py);
      }
      ctx!.closePath();
      
      // สีของเส้นขอบรังผึ้ง
      ctx!.strokeStyle = `rgba(37, 99, 235, 0.1)`; 
      ctx!.lineWidth = 1;
      ctx!.stroke();

      // ถ้าระยะเมาส์อยู่ใกล้ หรือโหนดนั้นกำลังกะพริบ ให้ระบายสีเรืองแสง
      if (glow > 0) {
        ctx!.fillStyle = `rgba(37, 99, 235, ${glow})`; 
        ctx!.fill();
      }
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#0f131f'; 
      ctx.fillRect(0, 0, width, height);

      const cols = Math.ceil(width / hexWidth) + 2;
      const rows = Math.ceil(height / rowHeight) + 2;

      // ดึงเวลาปัจจุบันมาใช้ขับเคลื่อนคลื่น Sine Wave
      const time = Date.now() * 0.0005;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          let x = col * hexWidth;
          const y = row * rowHeight;
          
          if (row % 2 !== 0) {
            x += hexWidth / 2;
          }

          // คำนวณแสงจากเมาส์
          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          let mouseGlow = 0;
          const maxDist = 70; 
          if (dist < maxDist) {
            mouseGlow = 0.4 * (1 - dist / maxDist);
          }

          // Auto-Animation (Twinkle Effect)
          let autoGlow = 0;
          
          // สุ่มให้แค่บางรังผึ้งเท่านั้นที่กะพริบเพื่อไม่ให้ดูรกเกินไป
          const pseudoRandomSeed = (row * 8 + col * 10) % 30;
          
          if (pseudoRandomSeed < 3) {
            // Sine Wave ที่ทำให้ค่าค่อยๆ ขึ้นลงระหว่าง 0 ถึง 1 แบบนุ่มนวล
            const wave = (Math.sin(time + pseudoRandomSeed) + 1) / 2;
            
            // จำกัดความสว่างสูงสุดของ Auto Glow
            autoGlow = wave * 0.2;
          }

          // 3. เอาแสงเมาส์กับแสงกระพริบมารวมกัน (เลือกอันที่สว่างกว่ามาโชว์)
          const finalGlow = Math.max(mouseGlow, autoGlow);

          drawHexagon(x, y, hexSize - 2, finalGlow);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none -z-10" />;
}