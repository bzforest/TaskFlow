import { useState } from 'react';
import { LayoutDashboard, CheckSquare, Users, Settings, ChevronLeft, ChevronRight, } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
}

export default function Sidebar ({ isOpen , setIsOpen }: SidebarProps) {
    const [hoveredMenu , setHoverMenu] = useState<string | null>(null);

    const menuItems = [
        { name: 'Dashboard' , icon: LayoutDashboard, active: true },
        { name: 'My Tasks' , icon: CheckSquare, active: false },
        { name: 'Team' , icon: Users, active: false },
        { name: 'Setting' , icon: Settings, active: false },
    ];

    return (
        <aside className={clsx(
                "relative flex flex-col bg-brand-navy text-gray-300 transition-all duration-300 z-20",
                isOpen ? "w-64" : "w-20"
            )}
        >
            <div className="flex items-center h-16 mt-4 mb-4 px-4 overflow-hidden">
            <div className="flex items-center justify-center min-w-10 min-h-10 bg-brand-blue rounded-lg text-white font-bold text-xl shrink-0">
                T
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className='ml-3 text-white font-bold text-xl tracking-wide whitespace-nowrap'
                    >
                        TaskFlow
                    </motion.span>
                )}
            </AnimatePresence>
            </div>

            <nav className='flex-1 px-3 space-y-2 relative'>
                {menuItems.map((item) => (
                    <button
                        key={item.name}
                        onMouseEnter={() => setHoverMenu(item.name)}
                        onMouseLeave={() => setHoverMenu(null)}
                        className={clsx(
                            "relative flex items-center w-full px-3 py-3 rounded-lg transition-colors group cursor-pointer",
                            item.active ? "text-white" : "text-gray-400 hover:text-white"
                        )}
                    >
                        {/* Background Highlight ตอน Active หรือ Hover (Framer Motion) */}
                        {item.active && (
                            <motion.div
                                layoutId="active-bg"
                                className='absolute inset-0 bg-brand-blue rounded-lg'
                                initial={false}
                                transition={{ type: "spring", stiffness: 300, damping: 30}}
                            />
                        )}
                        { !item.active && hoveredMenu === item.name && (
                            <motion.div 
                                layoutId="hover-bg"
                                className='absolute inset-0 bg-gray-800 rounded-lg'
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0}}
                            />
                        )}

                        {/* ไอคอนและข้อความ (อยู่บนสุด) */}
                        <div className="relative flex items-center z-10 w-full">
                            <item.icon size={20} className="min-w-5 shrink-0" />
                            <AnimatePresence>
                                {isOpen && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: "auto" }}
                                        exit={{ opacity: 0, width: 0 }}
                                        className="ml-3 font-medium whitespace-nowrap overflow-hidden transition-transform duration-200 group-hover:translate-x-1"
                                    >
                                        {item.name}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    </button>
                ))}
            </nav>

            {/* ปุ่มพับ/ขยาย Sidebar */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute -right-3 top-10 bg-white dark:bg-gray-700 text-gray-800 dark:text-white p-1 rounded-full border border-gray-200 dark:border-gray-600 shadow-md hover:scale-110 transition-transform z-30 cursor-pointer"
            >
                {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>

        </aside>
    );
}