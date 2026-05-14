import { useState, useRef, useEffect } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { Search, Plus, X, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import type { TaskPriority, TaskStatus } from '../../types';
import { useLocation } from 'react-router-dom';

// Custom Dropdown
interface DropdownProps<T> {
  label: string;
  value: T | 'All';
  options: { label: string; value: T | 'All' }[];
  onChange: (val: T | 'All') => void;
  width?: string;
}

function CustomSelect<T extends string>({ label, value, options, onChange, width = "160px" }: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // หาข้อความของ label ที่ตรงกับ value ปัจจุบัน เพื่อเอามาโชว์ที่ปุ่ม
  const selectedOptionLabel = options.find((opt) => opt.value === value)?.label || value;

  return (
    <div className="relative" ref={dropdownRef} style={{ width }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "w-full flex items-center justify-between px-3 py-2 bg-white dark:bg-brand-navy border rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer shadow-sm h-[42px]",
          isOpen ? "border-brand-blue ring-2 ring-brand-blue/10" : "border-brand-grey-border dark:border-gray-700"
        )}
      >
        <span className="truncate text-gray-900 dark:text-white">
          <span className="text-status-gray-text font-medium">{label}:</span> {selectedOptionLabel}
        </span>
        <ChevronDown 
          size={16} 
          className={clsx("text-status-gray-text transition-transform duration-300", isOpen && "rotate-180")} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 w-full bg-white dark:bg-gray-800 border border-brand-grey-border dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden py-1"
          >
            {options.map((opt) => (
              <li key={opt.value}>
                <button
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={clsx(
                    "w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                    value === opt.value 
                      ? "text-brand-blue bg-brand-blue/5" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-brand-blue/10 hover:text-brand-blue"
                  )}
                >
                  {opt.label}
                  {value === opt.value && <Check size={14} className="text-brand-blue" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

//  Flip Button
function FlipButton({ onClick }: { onClick?: () => void }) {

    return (
      <button 
        onClick={onClick}
        className="hidden md:block group relative h-[42px] px-4 overflow-hidden rounded-lg bg-brand-blue hover:bg-violet-400 dark:hover:bg-brand-blue-hover/60 text-white font-semibold shadow-lg shadow-brand-blue/20 transition-colors cursor-pointer"
      >
        {/* เมื่อ Hover จะเลื่อนแกน Y ขึ้นไปครึ่งนึง (-1/2) ด้วยอนิเมชันแบบสปริง (cubic-bezier) */}
        <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] group-hover:-translate-y-1/2">
          
          {/* หน้าแรก */}
          <div className="flex items-center justify-center gap-2 h-[42px]">
            <Plus size={18} />
            <span className="hidden sm:inline">New Task</span>
          </div>
          
          {/* หน้าที่สอง */}
          <div className="flex items-center justify-center gap-2 h-[42px]">
            <span className="hidden sm:inline text-amber-300">Create Now!</span>
          </div>
  
        </div>
      </button>
    );
  }

  function FlipButtonMobile({ onClick }: { onClick?: () => void }) {

    return (
      <button 
        onClick={onClick}
        className="md:hidden group relative h-[42px] px-4 overflow-hidden rounded-lg bg-brand-blue hover:bg-violet-400 dark:hover:bg-brand-blue-hover/60 text-white font-semibold shadow-lg shadow-brand-blue/20 transition-colors cursor-pointer w-full"
      >
        {/* เมื่อ Hover จะเลื่อนแกน Y ขึ้นไปครึ่งนึง (-1/2) ด้วยอนิเมชันแบบสปริง (cubic-bezier) */}
        <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] group-hover:-translate-y-1/2">
          
          {/* หน้าแรก */}
          <div className="flex items-center justify-center gap-2 h-[42px]">
            <Plus size={18} />
            <span className="inline">New Task</span>
          </div>
          
          {/* หน้าที่สอง */}
          <div className="flex items-center justify-center gap-2 h-[42px]">
            <span className="inline text-amber-300">Create Now!</span>
          </div>
  
        </div>
      </button>
    );
  }

export default function FilterBar() {
  const { 
    searchQuery, setSearchQuery, 
    filterPriority, setFilterPriority, 
    filterStatus, setFilterStatus,
    openModal 
  } = useTaskStore();

  // Local State
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [localPriority, setLocalPriority] = useState<TaskPriority | 'All'>(filterPriority);
  const [localStatus, setLocalStatus] = useState<TaskStatus | 'All'>(filterStatus);

  // ฟังก์ชันบันทึกค่าลง Zustand
  const handleSearch = () => {
    setSearchQuery(localSearch);
    setFilterPriority(localPriority);
    setFilterStatus(localStatus);
  };

  const handleClearFilter = () => {
    setSearchQuery('');
    setLocalSearch('');
    
    setFilterPriority('All');
    setLocalPriority('All');
    
    setFilterStatus('All');
    setLocalStatus('All');
  };

  const priorityOptions: { label: string; value: TaskPriority | 'All' }[] = [
    { label: 'All', value: 'All' },
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium Priority' },
    { label: 'High', value: 'High Priority' },
  ];

  const statusOptions: { label: string; value: TaskStatus | 'All' }[] = [
    { label: 'All', value: 'All' },
    { label: 'To Do', value: 'To Do' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Done', value: 'Done' },
  ];

  const location = useLocation();

  return (
    <div className='flex flex-col gap-4 mb-6 relative z-30'>

      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        {location.pathname === '/' ? (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white md:block hidden">Dashboard</h2>
        ) : (
            <div></div>
        )}
            <FlipButton
                onClick={openModal}
            />
      </div>

{/* Search & Filter */}
<div className='flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4'>
        
        {/* Search */}
        <div className='relative flex-1 group'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-status-gray-text group-focus-within:text-brand-blue transition-colors' size={18} />
          <input 
            type='text'
            placeholder='Search tasks...'
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className='w-full pl-10 pr-4 py-2 bg-white dark:bg-brand-navy border border-brand-grey-border dark:border-gray-700 rounded-lg text-sm font-semibold text-gray-900 dark:text-white outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all shadow-sm h-[42px]'
          />
        </div>

        {/* Filters */}
        <div className='flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3'>

          <div className="grid grid-cols-2 sm:flex items-center gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-[170px]">
              <CustomSelect 
                label="Priority" 
                value={localPriority}
                options={priorityOptions} 
                onChange={(val) => setLocalPriority(val as TaskPriority | 'All')}
                width="100%"
              />
            </div>
            <div className="w-full sm:w-[170px]">
              <CustomSelect 
                label="Status" 
                value={localStatus}
                options={statusOptions} 
                onChange={(val) => setLocalStatus(val as TaskStatus | 'All')}
                width="100%"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={handleSearch}
              className="flex-1 sm:flex-none flex items-center justify-center bg-white dark:bg-brand-navy hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-brand-grey-border dark:border-gray-700 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm cursor-pointer h-[42px]"
            >
              <Search size={18} className="sm:mr-0 mr-2" />
              <span className="sm:hidden">Search</span> 
            </button>

            <button
              onClick={handleClearFilter}
              title="Clear Filters"
              className='flex items-center justify-center w-[42px] h-[42px] shrink-0 bg-white dark:bg-brand-navy border border-brand-grey-border dark:border-gray-700 rounded-lg text-status-gray-text hover:text-brand-red hover:border-brand-red transition-all shadow-sm cursor-pointer'
            >
              <X size={18}/>
            </button>
          </div>

          <div className='w-full sm:hidden mt-2'>
            <FlipButtonMobile onClick={openModal} />
          </div>

        </div>
      </div>
    </div>
  );
}