import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  // สร้าง State สำหรับพับ/ขยาย Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-brand-grey-bg dark:bg-gray-900 transition-colors duration-300">
      
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex flex-col flex-1 overflow-hidden">
        
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
        
      </div>

    </div>
  );
}