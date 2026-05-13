import { useTaskStore } from '../../store/useTaskStore';
import TaskCard from './TaskCard';
import FilterBar from './FilterBar';
import TaskModal from './TaskModal';
import type { TaskStatus } from '../../types';

export default function Dashboard() {
  const { tasks, searchQuery, filterPriority, filterStatus } = useTaskStore();

  const filteredTasks = tasks.filter((task) => {

    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.projectName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = filterPriority === 'All' ? true : task.priority === filterPriority;

    const matchesStatus = filterStatus === 'All' ? true : task.status === filterStatus;

    return matchesSearch && matchesPriority && matchesStatus;
  })

  const getTasksByStatus = (status: TaskStatus) => {
    return filteredTasks.filter(task => task.status === status);
  };

  return (
    <div className="h-full flex flex-col">

      <FilterBar />
      <TaskModal />
      
      {/* Board Container */}
      <div className="flex-1 overflow-x-auto mt-2 scrollbar-hide">
        <div className="flex w-full gap-6 h-full items-start">
          
          {/* To Do */}
          <div className="flex-1 min-w-[300px] flex flex-col">
          
            <div className="bg-status-gray-bg text-status-gray-text font-bold text-sm py-3 px-4 rounded-t-2xl text-center">
              To Do
            </div>
          
            <div className="flex-1 bg-status-gray-bg/40 dark:bg-status-gray-bg/10 rounded-b-2xl p-4 flex flex-col gap-4">
              {getTasksByStatus('To Do').map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>

          {/* In Progress */}
          <div className="flex-1 min-w-[300px] flex flex-col">

            <div className="bg-status-blue-bg text-status-blue-text font-bold text-sm py-3 px-4 rounded-t-2xl text-center">
              In Progress
            </div>
           
            <div className="flex-1 bg-status-blue-bg/40 dark:bg-status-blue-bg/10 rounded-b-2xl p-4 flex flex-col gap-4">
              {getTasksByStatus('In Progress').map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>

          {/* Done*/}
          <div className="flex-1 min-w-[300px] flex flex-col">

            <div className="bg-status-green-bg text-status-green-text font-bold text-sm py-3 px-4 rounded-t-2xl text-center">
              Done
            </div>
          
            <div className="flex-1 bg-status-green-bg/40 dark:bg-status-green-bg/10 rounded-b-2xl p-4 flex flex-col gap-4">
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