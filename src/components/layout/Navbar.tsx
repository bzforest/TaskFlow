import { useState } from 'react';
import { Search, Bell, Sun, Moon, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '../../store/useTaskStore';
import clsx from 'clsx';

export default function Navbar() {
  const { isDarkMode, toggleDarkMode, searchQuery, setSearchQuery } = useTaskStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="h-20 bg-white dark:bg-brand-navy border-b border-brand-grey-border dark:border-transparent flex items-center justify-between px-6 transition-colors duration-300 z-10">
      
      {/* ด้านซ้าย */}
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      </div>

      {/* ด้านขวา */}
      <div className="flex items-center space-x-6">
        
        {/* ช่อง Search หลัก */}
        <div className="relative hidden md:block group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-status-gray-text group-focus-within:text-brand-blue transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 pl-10 pr-4 py-2 bg-status-gray-bg text-status-gray-text border border-transparent focus:border-brand-blue focus:bg-transparent rounded-lg outline-none transition-all duration-300"
          />
        </div>

        {/* ปุ่มแจ้งเตือน */}
        <button className="relative text-status-gray-text hover:text-brand-blue transition-transform hover:scale-110 cursor-pointer">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-red"></span>
          </span>
        </button>

        {/* ปุ่มสลับ Dark/Light Mode */}
        <button 
          onClick={toggleDarkMode}
          className="relative flex items-center justify-center w-10 h-10 text-status-gray-text hover:text-brand-blue transition-colors overflow-hidden cursor-pointer"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isDarkMode ? (
              <motion.div
                key="moon"
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                className="absolute"
              >
                <Moon size={20} />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                className="absolute"
              >
                <Sun size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Avatar Dropdown */}
        <div 
          className="flex items-center space-x-2 cursor-pointer group"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <img 
            src="https://i.pravatar.cc/150?img=11" 
            alt="User Avatar" 
            className="w-9 h-9 rounded-full border-2 border-brand-grey-border dark:border-transparent group-hover:border-brand-blue transition-colors"
          />
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">Best Sakditat</span>
              <span className="text-xs text-status-gray-text">Admin</span>
            </div>
            
            <ChevronDown 
              size={16} 
              className={clsx(
                "text-status-gray-text transition-transform duration-300",
                isDropdownOpen ? "rotate-180" : "rotate-0"
              )} 
            />
          </div>
        </div>

      </div>
    </header>
  );
}