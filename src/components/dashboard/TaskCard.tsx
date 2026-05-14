import { Calendar } from 'lucide-react';
import type { Task } from '../../types';
import clsx from 'clsx';
import AnimatedProgress from '../ui/AnimatedProgress';
import AnimatedAvatarGroup from '../ui/AnimatedAvatarGroup';
import { useTaskStore } from '../../store/useTaskStore';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export default function TaskCard({ task }: TaskCardProps) {

    const { openDetailModal } = useTaskStore();

    const priorityColors = {
        'Low': 'bg-status-green-bg text-status-green-text',
        'Medium Priority': 'bg-status-yellow-bg text-status-yellow-text',
        'High Priority': 'bg-status-red-bg text-status-red-text',
    };

    const statusColors = {
        'To Do': 'bg-status-gray-bg text-status-gray-text',
        'In Progress': 'bg-status-blue-bg text-status-blue-text',
        'Done': 'bg-status-green-bg text-status-green-text',
    };

    const handleDragStart = (e: React.DragEvent) => {
      e.dataTransfer.setData('taskId' , task.id);
      setTimeout(() => {
        (e.target as HTMLElement).classList.add('opacity-50');
      }, 0)
    };

    const handleDragEnd = (e: React.DragEvent) => {
      (e.target as HTMLElement).classList.remove('opacity-50');
    };

  return (
    <div 
      onClick={() => openDetailModal(task)}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="bg-white dark:bg-brand-navy border border-brand-grey-border dark:border-transparent rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col gap-3 group hover:border-brand-blue dark:hover:border-brand-blue"
    >
      {/* Title & Project Name */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-brand-blue transition-colors">
          {task.title}
        </h3>
        <p className="text-xs text-status-gray-text mt-0.5">{task.projectName}</p>
      </div>

      {/* Tags & Priority */}
      <div className="flex flex-wrap gap-2 text-[10px] font-bold">
        <span className="px-2 py-1 bg-status-gray-bg text-status-gray-text rounded-md">
          {task.tag}
        </span>
        <span className={clsx("px-2 py-1 rounded-md", priorityColors[task.priority])}>
          {task.priority}
        </span>
      </div>

      {/* Date & Status */}
      <div className="flex items-center gap-3 text-xs font-semibold mt-1">
        <div className="flex items-center text-status-gray-text">
          <Calendar size={14} className="mr-1.5" />
          {task.date}
        </div>
        <span className={clsx("px-2 py-0.5 rounded-md text-[10px]", statusColors[task.status])}>
          {task.status}
        </span>
      </div>

      {/* Progress & Avatar Group (ใช้ Component ใหม่ที่เราสร้าง) */}
      <div className="mt-2 flex items-end justify-between gap-4">
        
        <div className="flex-1">
          <AnimatedProgress progress={task.progress} />
        </div>

        <div className="shrink-0 mb-0.5">
          <AnimatedAvatarGroup users={task.assignees} max={3} />
        </div>

      </div>
    </div>
  );
}