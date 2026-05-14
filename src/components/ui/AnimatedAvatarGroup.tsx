import { motion } from 'framer-motion';
import type { User } from '../../types';

interface AvatarGroupProps {
    users: User[];
    max?: number;
}

export default function AnimatedAvatarGroup ({ users, max = 3 }: AvatarGroupProps) {
    const displayUsers = users.slice(0 , max);
    const remainingCount = users.length - max;

    return (
        <div className='flex items-center -space-x-2'>
            {displayUsers.map((user , idx) => (
                <motion.div
                    key={user.id}
                    className='relative rounded-full border-2 border-white dark:border-brand-navy cursor-pointer group/avatar'
                    initial={{ zIndex: idx }}
                    whileHover={{
                        scale: 1.15,
                        y: -8,
                        transition: { type: "spring" , stiffness: 300 , damping: 20 }
                    }}
                    style={{ zIndex: idx }}
                >
                    <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className='w-7 h-7 rounded-full object-cover'
                    />

                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200 bg-tooltip-bg text-white text-[10px] py-1 px-2 rounded-md whitespace-nowrap pointer-events-none z-50 shadow-md">
                        {user.name}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-tooltip-arrow"></div>
                    </div>
                </motion.div>
            ))}

            {remainingCount > 0 && (
                <motion.div
                    initial={{ zIndex: displayUsers.length }}
                    className='w-7 h-7 rounded-full border-2 border-white dark:border-brand-navy bg-status-gray-bg text-status-gray-text text-[10px] font-bold flex items-center justify-center relative cursor-pointer'
                    whileHover={{ 
                        scale: 1.15, 
                        y: -8, 
                        zIndex: 50,
                        transition: { type: "spring" , stiffness: 300 , damping: 20 }
                    }}
                >
                    +{remainingCount}
                </motion.div>
            )}
        </div>
    );
}