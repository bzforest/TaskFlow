import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface DatePickerProps {
    value: string;
    onChange: (date: string) => void;
    placement?: 'top' | 'bottom';
}

export default function CustomDatePicker({ value, onChange, placement = 'bottom' }: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    
    // ใช้เก็บค่าเดือน/ปี ปัจจุบันที่กำลังกดดูอยู่ในปฏิทิน
    const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
    const dropdownRef = useRef<HTMLDivElement>(null);

    // ดักจับการคลิกด้านนอกเพื่อปิดปฏิทิน
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ฟังก์ชันช่วยจัดการวันที่
    const formatDisplayDate = (dateString: string) => {
        if (!dateString) return "Pick a date";
        const d = new Date(dateString);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const handleSelectDate = (d: Date) => {
        // แปลงกลับเป็น YYYY-MM-DD เพื่อเก็บลง State หลัก
        const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        onChange(formatted);
        setIsOpen(false);
    };

    // คำนวณเพื่อวาดตารางปฏิทิน
    const currentMonth = viewDate.getMonth();
    const currentYear = viewDate.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    // Presets ปุ่มลัด
    const presets = [
        { label: "Today", offset: 0 },
        { label: "Tomorrow", offset: 1 },
        { label: "In 3 days", offset: 3 },
        { label: "In a week", offset: 7 },
    ];

    const applyPreset = (daysOffset: number) => {
        const target = new Date();
        target.setDate(target.getDate() + daysOffset);
        handleSelectDate(target);
        setViewDate(target);
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/* ปุ่ม Trigger เพื่อเปิดปฏิทิน */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "w-full flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border rounded-lg text-sm transition-all duration-200 cursor-pointer focus:outline-none text-left",
                    isOpen ? "border-brand-blue ring-1 ring-brand-blue" : "border-gray-300 dark:border-gray-700",
                    !value && "text-status-gray-text"
                )}
            >
                <CalendarIcon size={16} className={value ? "text-brand-blue" : "text-status-gray-text"} />
                <span className={clsx("font-medium", value ? "text-gray-900 dark:text-white" : "font-normal")}>
                    {formatDisplayDate(value)}
                </span>
            </button>

            {/* Popup ปฏิทิน */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: placement === 'top' ? 10 : -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: placement === 'top' ? 10 : -10 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute left-0 w-[280px] bg-white dark:bg-brand-navy border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden p-3
                            ${ placement === 'top' ? "bottom-full mb-2" : "top-full mt-2"
                        }`}
                    >
                        {/* ส่วนหัว เปลี่ยนเดือน */}
                        <div className="flex items-center justify-between mb-4">
                            <button 
                                type="button"
                                onClick={() => setViewDate(new Date(currentYear, currentMonth - 1, 1))}
                                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                                {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </span>
                            <button 
                                type="button"
                                onClick={() => setViewDate(new Date(currentYear, currentMonth + 1, 1))}
                                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>

                        {/* ตารางวัน */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {dayNames.map(day => (
                                <div key={day} className="text-center text-[10px] font-semibold text-status-gray-text py-1">
                                    {day}
                                </div>
                            ))}
                            
                            {/* ช่องว่างสำหรับวันแรกของเดือน */}
                            {blanks.map((_, i) => <div key={`blank-${i}`} />)}
                            
                            {/* วันที่ 1 ถึง 30/31 */}
                            {days.map(day => {
                                const currentDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                const isSelected = value === currentDateStr;
                                
                                return (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => handleSelectDate(new Date(currentYear, currentMonth, day))}
                                        className={clsx(
                                            "h-8 w-8 rounded-md flex items-center justify-center text-sm font-medium transition-colors cursor-pointer",
                                            isSelected 
                                                ? "bg-brand-blue text-white shadow-md shadow-brand-blue/30" 
                                                : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 hover:scale-[1.13] dark:hover:bg-gray-700"
                                        )}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="h-px w-full bg-gray-200 dark:bg-gray-700 my-3" />

                        {/* ปุ่ม Presets */}
                        <div className="grid grid-cols-2 gap-2">
                            {presets.map(preset => (
                                <button
                                    key={preset.label}
                                    type="button"
                                    onClick={() => applyPreset(preset.offset)}
                                    className="px-2 py-1.5 text-xs font-semibold border border-gray-200 dark:border-gray-700 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-brand-blue dark:hover:border-brand-blue transition-colors cursor-pointer"
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}