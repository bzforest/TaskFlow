import { Hammer } from 'lucide-react';

interface ComingSoonProps {
    title: string;
}

export default function ComingSoon({ title }: ComingSoonProps) {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-brand-blue/10 dark:bg-brand-blue/20 rounded-full flex items-center justify-center mb-6">
                <Hammer size={40} className="text-brand-blue" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {title} is under construction
            </h2>
            <p className="text-status-gray-text max-w-md">
                We're working hard to bring you this feature. Please check back later!
            </p>
        </div>
    );
}