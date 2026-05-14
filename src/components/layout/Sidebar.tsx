import { useState } from 'react';
import { LayoutDashboard, CheckSquare, Users, Settings, ChevronLeft, ChevronRight, BarChart3, type LucideIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { NavLink } from 'react-router-dom';
import { useTaskStore } from '../../store/useTaskStore';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
}

export default function Sidebar ({ isOpen , setIsOpen }: SidebarProps) {
    const [hoveredMenu , setHoverMenu] = useState<string | null>(null);
    const { isMobileMenuOpen, setMobileMenuOpen } = useTaskStore();
    const showText = isOpen || isMobileMenuOpen;

    const menuItems: { path: string; name: string; icon: LucideIcon }[] = [
        { path: '/', name: 'Dashboard' , icon: LayoutDashboard },
        { path: '/my-tasks', name: 'My Tasks' , icon: CheckSquare },
        { path: '/analytics', name: 'Analytics' , icon: BarChart3 },
        { path: '/team', name: 'Team' , icon: Users },
        { path: '/settings', name: 'Setting' , icon: Settings },
    ];

      return (
        <>
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            <aside className={clsx(
                "flex flex-col bg-brand-navy text-gray-300 transition-all duration-300 z-50",
                "fixed inset-y-0 left-0 h-full",
                isMobileMenuOpen ? "translate-x-0 shadow-2xl w-64" : "-translate-x-full w-64",
                "md:relative md:translate-x-0",
                isOpen ? "md:w-64" : "md:w-20"
            )}>
                
                {/* Header */}
                <div className="flex items-center justify-between h-16 mt-4 mb-4 px-4 overflow-hidden">
                    <div className="flex items-center">
                        <div className="flex items-center justify-center min-w-10 min-h-10 bg-brand-blue rounded-lg text-white font-bold text-xl shrink-0">
                            T
                        </div>
                        <AnimatePresence>
                            {showText && (
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

                    {/* ปิดเมนูบนมือถือ */}
                    <button 
                        onClick={() => setMobileMenuOpen(false)}
                        className="md:hidden text-gray-400 hover:text-white transition-colors p-1"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className='flex-1 px-3 space-y-2 relative'>
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            onMouseEnter={() => setHoverMenu(item.path)}
                            onMouseLeave={() => setHoverMenu(null)}
                            className={({ isActive }) => clsx(
                                "relative flex items-center w-full px-3 py-3 rounded-lg transition-colors group cursor-pointer",
                                isActive ? "text-white" : "text-gray-400 hover:text-white"
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    {/* Background Highlight */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-bg"
                                            className='absolute inset-0 bg-brand-blue rounded-lg'
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 300, damping: 30}}
                                        />
                                    )}
                                    { !isActive && hoveredMenu === item.path && (
                                        <motion.div 
                                            layoutId="hover-bg"
                                            className='absolute inset-0 bg-white/10 rounded-lg'
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0}}
                                        />
                                    )}

                                    {/* ไอคอนและข้อความ */}
                                    <div className="relative flex items-center z-10 w-full">
                                        <item.icon size={20} className="min-w-5 shrink-0" />
                                        <AnimatePresence>
                                            {showText && (
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
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* ปุ่มพับ/ขยาย Sidebar โชว์เฉพาะจอ md  */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="hidden md:flex absolute -right-3 top-10 bg-status-gray-bg text-status-gray-text p-1 rounded-full shadow-md hover:scale-110 transition-transform z-60 cursor-pointer items-center justify-center"
                >
                    {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </button>

            </aside>
        </>
    );
}