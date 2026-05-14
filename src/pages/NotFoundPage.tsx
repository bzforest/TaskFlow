import { Link } from 'react-router-dom';
import { CircleAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
            >
                <div className="w-24 h-24 bg-brand-blue/10 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <CircleAlert size={48} className="text-brand-blue" />
                </div>
                
                <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                    404
                </h1>
                <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">
                    Page Not Found
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8 leading-relaxed">
                    Oops! The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
                </p>

                <Link 
                    to="/"
                    className="px-6 py-3 bg-brand-blue text-white font-semibold rounded-xl hover:bg-brand-blue-hover transition-colors shadow-lg shadow-brand-blue/20"
                >
                    Back to Dashboard
                </Link>
            </motion.div>
        </div>
    );
}