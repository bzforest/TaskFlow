import { type ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export default function Modal ({ isOpen , onClose , title , children }: ModalProps) {

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown' , handleEsc);
        return () => window.removeEventListener('keydown' , handleEsc);
    }, [onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6'>
                    
                    { /* Backdrop */ }
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className='absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer'
                    />

                    { /* MOdal Box */ }
                    <motion.div
                        initial={{ opacity: 0 , scale: 0.95 , y: 20 }}
                        animate={{ opacity: 1 , scale: 1 , y: 0 }}
                        exit={{ opacity: 0 , scale: 0.95 , y: 20 }}
                        transition={{ type: "spring" , duration: 0.5 , bounce: 0.3 }}
                        className='relative w-full max-w-lg bg-white dark:bg-brand-navy rounded-2xl shadow-2xl border border-brand-grey-border dark:border-gray-700 flex flex-col'
                    >
                        { /* Head */ }
                        <div className='flex items-center justify-between px-6 py-4 border-b border-brand-grey-border dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-t-2xl'>
                            <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                                {title}
                            </h2>
                            <button
                                onClick={onClose}
                                className='p-2 rounded-lg text-status-gray-text hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer hover:scale-105'
                            >
                                <X size={20}/>
                            </button>
                        </div>

                        { /* Body */ }
                        <div className='p-6'>
                            {children}
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}