import { useState, useRef, useEffect } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import Modal from '../ui/Modal';
import { ChevronDown, Check, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import type { TaskPriority, TaskStatus } from '../../types';
import CustomDatePicker from '../ui/CustomDatePicker';

function FormSelect<T extends string>({ 
    value, options, onChange 
}: { 
    value: T; options: { label: string; value: T }[]; onChange: (val: T) => void; 
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedLabel = options.find((opt) => opt.value === value)?.label || value;

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "w-full flex items-center justify-between px-3 py-2 bg-white dark:bg-gray-800 border rounded-lg text-sm transition-all duration-200 cursor-pointer focus:outline-none",
                    isOpen ? "border-brand-blue ring-1 ring-brand-blue" : "border-gray-300 dark:border-gray-700"
                )}
            >
                <span className="text-gray-900 dark:text-white">{selectedLabel}</span>
                <ChevronDown size={16} className={clsx("text-status-gray-text transition-transform duration-300", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.ul
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden py-1"
                    >
                        {options.map((opt) => (
                            <li key={opt.value}>
                                <button
                                    type="button"
                                    onClick={() => { onChange(opt.value); setIsOpen(false); }}
                                    className={clsx(
                                        "w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors cursor-pointer",
                                        value === opt.value ? "text-brand-blue bg-brand-blue/5 font-semibold" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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

export default function TaskModal() {
    const { isModalOpen, closeModal, addTask, currentUser } = useTaskStore();

    const [title, setTitle] = useState('');
    const [projectName, setProjectName] = useState('');
    const [tag, setTag] = useState('');
    const [priority, setPriority] = useState<TaskPriority>('Medium Priority');
    const [status, setStatus] = useState<TaskStatus>('To Do');
    const [date, setDate] = useState('');

    const handleClose = () => {
        setTitle('');
        setProjectName('');
        setTag('');
        setPriority('Medium Priority');
        setStatus('To Do');
        setDate('');
        closeModal(); // เรียก Zustand ให้ปิด Modal
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !projectName.trim()) {
            alert("Please fill in both Title and Project Name.");
            return;
        }

        const newTask = {
            id: Date.now().toString(),
            title,
            projectName,
            tag: tag.trim() ? tag : 'Feature',
            priority,
            status,
            date: date || new Date().toISOString().split('T')[0],
            progress: status === 'Done' ? 100 : 0,
            assignees: [
                { id: currentUser.id, name: currentUser.name, avatarUrl: currentUser.avatarUrl || ""}
            ] 
        };

        addTask(newTask);
        handleClose();
    };

    const handleClearInput = () => {
        setTitle('');
        setProjectName('');
        setTag('');
        setPriority('Medium Priority');
        setStatus('To Do');
        setDate('');
    }

    const priorityOptions: { label: string; value: TaskPriority }[] = [
        { label: 'Low', value: 'Low' },
        { label: 'Medium', value: 'Medium Priority' },
        { label: 'High', value: 'High Priority' },
    ];

    const statusOptions: { label: string; value: TaskStatus }[] = [
        { label: 'To Do', value: 'To Do' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Done', value: 'Done' },
    ];

    return (
        <Modal isOpen={isModalOpen} onClose={handleClose} title='Create New Task'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-2 md:gap-4'>

                { /* Title */ }
                <div>
                    <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                        Task Title <span className='text-brand-red'>*</span>
                    </label>
                    <input 
                        type='text'
                        placeholder='e.g. Implement Dark Mode'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className='w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors text-gray-900 dark:text-white'
                        required
                    />
                </div>

                { /* Project Name & Tag */ }
                <div className='flex flex-col sm:flex-row gap-4'>
                    <div className='flex-1'>
                        <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                            Project Name <span className='text-brand-red'>*</span>
                        </label>
                        <input 
                            type='text'
                            placeholder='e.g. Web App Redesign'
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className='w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors text-gray-900 dark:text-white'
                            required
                        />
                    </div>
                    <div className='w-full sm:w-1/3'>
                        <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1'>Tag</label>
                        <input 
                            type='text'
                            placeholder='e.g. Feature, Bug'
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                            className='w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors text-gray-900 dark:text-white'
                        />
                    </div>
                </div>

                {/* Priority & Status */}
                <div className='flex flex-col sm:flex-row gap-4'>
                    <div className='flex-1 relative z-10'>
                        <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1'>Priority</label>
                        <FormSelect value={priority} options={priorityOptions} onChange={(val) => setPriority(val)} />
                    </div>
                    <div className='flex-1 relative z-10'>
                        <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1'>Status</label>
                        <FormSelect value={status} options={statusOptions} onChange={(val) => setStatus(val)} />
                    </div>
                </div>
                
                {/* Due Date */}
                <div>
                    <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1'>Due Date</label>
                    <CustomDatePicker 
                        value={date}
                        onChange={setDate}
                    />
                </div>

                {/* Clear + Save & Cancel */}
                <div className="mt-6 flex items-center pt-4 border-t border-gray-400 dark:border-gray-700">
                    
                    <button 
                        type="button"
                        onClick={handleClearInput}
                        title="Clear all inputs"
                        className='mr-auto flex items-center gap-2 text-status-gray-text hover:text-brand-red dark:hover:text-brand-red transition-colors cursor-pointer text-sm font-semibold p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20'
                    >
                        <RotateCcw size={16} />
                        <span className="hidden sm:inline">Reset</span>
                    </button>

                    <div className="flex gap-3">
                        <button 
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="px-4 py-2 rounded-lg font-semibold bg-brand-blue text-white hover:bg-brand-blue-hover transition-colors shadow-lg shadow-brand-blue/20 cursor-pointer"
                        >
                            Save Task
                        </button>
                    </div>
                </div>

            </form>
        </Modal>
    )
}