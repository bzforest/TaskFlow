import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

interface AnimatedProgressProps {
  progress: number;
}

export default function AnimatedProgress({ progress }: AnimatedProgressProps) {
  // state สำหรับเก็บค่า progress
  const [displayProgress, setDisplayProgress] = useState(0);

  // การตั้งเวลา setInterval
  useEffect(() => {
    let start = 0;
    const end = progress;

    // ถ้า task นี้ยังไม่ได้เริ่มทำ ไม่ต้องตั้งเวลา
    if (start === end) {
      const timeout = setTimeout(() => setDisplayProgress(end), 0);
      return () => clearTimeout(timeout);
    }

    // คำนวณความเร็วในการวิ่งของตัวเลข
    const duration = 800;
    const incrementTime = Math.abs(Math.floor(duration / end));

    const timer = setInterval(() => {
      start += 1;
      setDisplayProgress(start);

      if (start === end) clearInterval(timer);
    }, incrementTime);

    // ล้างตัวจับเวลาเก่า เพื่อป้องกันปัญหา memory leak จนเว็บค้าง
    return () => clearInterval(timer);
  }, [progress]);

  const barColor =
    progress === 0 ? 'bg-status-gray-bg' :
    progress === 100 ? 'bg-brand-green' :
    'bg-brand-blue';

  return (
    <div className="w-full flex flex-col gap-1.5 mt-2">

      {/* ส่วนแสดงตัวอักษรและเปอร์เซ็นต์แบบตัวเลขวิ่ง */}
      <div className="flex justify-between items-center text-[10px] font-bold text-status-gray-text">
        <span>Progress</span>
        <span>{displayProgress}%</span>
      </div>

      <div className="h-1.5 w-full bg-status-gray-bg rounded-full overflow-hidden">
        <motion.div
          className={clsx("h-full rounded-full", barColor)}
          initial={{ width: 0 }}                // เริ่มต้นที่ 0
          animate={{ width: `${progress}%` }}   // ยืดความกว้างตามเปอร์เซ็นต์
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>

    </div>
  );
}