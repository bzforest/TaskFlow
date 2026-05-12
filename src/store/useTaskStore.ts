import { create } from 'zustand';
import type { Task, TaskPriority, TaskStatus } from '../types';
import { initialTasks } from '../data/mockTasks';

// State & Actions
interface TaskStore {
    // State (ข้อมูล)
    tasks: Task[];
    searchQuery: string;
    filterPriority: TaskPriority | 'All';
    filterStatus: TaskStatus | 'All';
    isDarkMode: boolean;

    // ACtion (การจัดการข้อมูล)
    addTask: (task: Task) => void;
    updateTask: (updateTask: Task) => void;
    setSearchQuery: (query: string) => void;
    setFilterPriority: (priority: TaskPriority | 'All') => void;
    setFilterStatus: (status: TaskStatus | 'All') => void;
    toggleDarkMode: () => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
    tasks: initialTasks,
    searchQuery: '',
    filterPriority: 'All',
    filterStatus: 'All',

    // เช็คว่าผู้ใช้งานเปิด darkMode ไว้ในเครื่องมั้ย ถ้ามีจะใช้ตามเครื่อง
    isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,

    addTask: (task) =>
        set((state) => ({ tasks: [...state.tasks, task] })),

    updateTask: (updateTask) =>
        set((state) => ({
            tasks: state.tasks.map((task) =>
                task.id === updateTask.id ? updateTask : task
            ),
        })),

    setSearchQuery: (query) => set({ searchQuery: query}),

    setFilterPriority: (priority) => set({ filterPriority: priority }),
    setFilterStatus: (status) => set ({ filterStatus: status }),

    toggleDarkMode: () =>
        set((state) => {
            const newDarkMode = !state.isDarkMode;
            if (newDarkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            return { isDarkMode: newDarkMode };
        }),
}));