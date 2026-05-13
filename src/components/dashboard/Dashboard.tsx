import { useTaskStore } from '../../store/useTaskStore';
import TaskCard from './TaskCard';
import FilterBar from './FilterBar';
import TaskModal from './TaskModal';
import type { TaskStatus } from '../../types';
import TaskDetailModal from './TaskDetailModal';

export default function Dashboard() {
  const { tasks, searchQuery, filterPriority, filterStatus, moveTask } = useTaskStore();

  const filteredTasks = tasks.filter((task) => {

    const query = searchQuery.toLowerCase();

    const matchesSearch =
      task.title.toLowerCase().includes(query) ||
      task.projectName.toLowerCase().includes(query) ||
      task.priority.toLowerCase().includes(query) ||
      task.status.toLowerCase().includes(query) ||
      task.tag.toLowerCase().includes(query);

    const matchesPriority = filterPriority === 'All' ? true : task.priority === filterPriority;

    const matchesStatus = filterStatus === 'All' ? true : task.status === filterStatus;

    return matchesSearch && matchesPriority && matchesStatus;
  })

  const getTasksByStatus = (status: TaskStatus) => {
    return filteredTasks.filter(task => task.status === status);
  };

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

      <FilterBar />
      <TaskModal />
      <TaskDetailModal />
      
      {/* Board Container */}
      <div className="flex-1 overflow-x-auto mt-2 scrollbar-hide">
        <div className="flex w-full gap-6 h-full items-start">
          
          {/* To Do */}
          <div 
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'To Do')}
            className="flex-1 min-w-[300px] flex flex-col">
          
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
            className="flex-1 min-w-[300px] flex flex-col">

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
            className="flex-1 min-w-[300px] flex flex-col">

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
    </div>
  );
}