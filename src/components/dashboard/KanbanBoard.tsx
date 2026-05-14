import { useState } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import TaskCard from './TaskCard';
import FilterBar from './FilterBar';
import TaskModal from './TaskModal';
import TaskDetailModal from './TaskDetailModal';
import Pagination from '../ui/Pagination';
import type { TaskStatus } from '../../types';

interface KanbanBoardProps {
  mode: 'all' | 'my-tasks';
}

export default function KanbanBoard({ mode }: KanbanBoardProps) {
  const { tasks, searchQuery, filterPriority, filterStatus, moveTask, currentUser } = useTaskStore();
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTasks = tasks.filter((task) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = task.title.toLowerCase().includes(query) || 
                         task.projectName.toLowerCase().includes(query) ||
                         task.priority.toLowerCase().includes(query) ||
                         task.status.toLowerCase().includes(query) ||
                         task.tag.toLowerCase().includes(query);

    const matchesPriority = filterPriority === 'All' ? true : task.priority === filterPriority;
    const matchesStatus = filterStatus === 'All' ? true : task.status === filterStatus;

    // การกรองตามโหมด
    const matchesMode = mode === 'my-tasks' 
      ? task.assignees.some(a => a.id === currentUser.id) 
      : true;

    return matchesSearch && matchesPriority && matchesStatus && matchesMode;
  });

  const tasksPerColumn = 2;

  const todoTasks = filteredTasks.filter(task => task.status === 'To Do');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'In Progress')
  const doneTasks = filteredTasks.filter(task => task.status === 'Done')

  const maxColumnLength = Math.max(todoTasks.length, inProgressTasks.length, doneTasks.length);
  const totalPages = Math.max(1, Math.ceil(maxColumnLength / tasksPerColumn));

  const getTasksByStatus = (status: TaskStatus) => {
    const startIndex = (currentPage - 1) * tasksPerColumn;
    const endIndex = startIndex + tasksPerColumn;

    if (status === 'To Do') return todoTasks.slice(startIndex , endIndex);
    if (status === 'In Progress') return inProgressTasks.slice(startIndex , endIndex);
    if (status === 'Done') return doneTasks.slice(startIndex , endIndex);
    return [];
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  }

  const handleDrop = (e: React.DragEvent , status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      moveTask(taskId , status);
    }
  };
  
  return (
    <div className="h-full flex flex-col">

        {mode === 'my-tasks' && (
            <div className="mb-6 mt-2 p-5 bg-linear-to-r from-brand-blue/10 to-transparent dark:from-brand-blue/20 rounded-2xl border border-brand-blue/20 flex items-center gap-4">
                <img 
                    src={currentUser.avatarUrl || "https://i.pravatar.cc/150?img=11"} 
                    alt="Profile" 
                    className="w-14 h-14 rounded-full border-2 border-brand-blue shadow-sm"
                />
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Hello, {currentUser.name}!
                    </h2>
                    <p className="md:block hidden text-status-gray-text text-sm mt-1">
                        Here are all the tasks currently assigned to you. Let's get things done!
                    </p>
                </div>
            </div>
        )}

      <FilterBar />
      <TaskModal />
      <TaskDetailModal />
      
      {/* Board Container */}
      <div className="flex-1 mt-2 scrollbar-hide">
        <div className="flex flex-col xl:flex-row w-full gap-6 h-full items-start">
          
          {/* To Do */}
          <div 
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'To Do')}
            className="w-full xl:flex-1 xl:min-w-[300px] flex flex-col">
          
            <div className="bg-status-gray-bg text-status-gray-text font-bold text-sm py-3 px-4 rounded-t-2xl text-center">
              To Do
            </div>
          
            <div className="flex-1 bg-status-gray-bg/60 dark:bg-status-gray-bg/50 rounded-b-2xl p-4 flex flex-col gap-4">
              {getTasksByStatus('To Do').map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>

          {/* In Progress */}
          <div 
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'In Progress')}
            className="w-full xl:flex-1 xl:min-w-[300px] flex flex-col">

            <div className="bg-status-blue-bg text-status-blue-text font-bold text-sm py-3 px-4 rounded-t-2xl text-center">
              In Progress
            </div>
           
            <div className="flex-1 bg-status-blue-bg/60 dark:bg-status-blue-bg/50 rounded-b-2xl p-4 flex flex-col gap-4">
              {getTasksByStatus('In Progress').map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>

          {/* Done*/}
          <div 
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'Done')}          
            className="w-full xl:flex-1 xl:min-w-[300px] flex flex-col">

            <div className="bg-status-green-bg text-status-green-text font-bold text-sm py-3 px-4 rounded-t-2xl text-center">
              Done
            </div>
          
            <div className="flex-1 bg-status-green-bg/60 dark:bg-status-green-bg/50 rounded-b-2xl p-4 flex flex-col gap-4">
              {getTasksByStatus('Done').map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Pagination */}
      <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredTasks.length}
            onPageChange={setCurrentPage}
          />

    </div>
  );
}