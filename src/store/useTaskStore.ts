import { create } from 'zustand';
import type { Task, TaskPriority, TaskStatus } from '../types';
import { initialTasks } from '../data/mockTasks';

export type TabType = 'dashboard' | 'my-tasks' | 'team' | 'settings';

// State & Actions
interface TaskStore {
    // State (ข้อมูล)
    tasks: Task[];
    searchQuery: string;
    filterPriority: TaskPriority | 'All';
    filterStatus: TaskStatus | 'All';
    isDarkMode: boolean;
    isModalOpen: boolean;
    selectedTask: Task | null;
    isDetailModalOpen: boolean;
    activeTab: TabType;

    // ACtion (การจัดการข้อมูล)
    addTask: (task: Task) => void;
    updateTask: (updateTask: Task) => void;
    deleteTask: (taskId: string) => void;
    moveTask: (taskId: string, newStatus: TaskStatus) => void;
    setSearchQuery: (query: string) => void;
    setFilterPriority: (priority: TaskPriority | 'All') => void;
    setFilterStatus: (status: TaskStatus | 'All') => void;
    toggleDarkMode: () => void;
    openModal: () => void;
    closeModal: () => void;
    openDetailModal: (task: Task) => void;
    closeDetailModal: () => void;
    setActiveTab: (tab: TabType) => void;

    currentUser: {
        id: string;
        name: string;
        avatarUrl?: string;
    };
}

export const useTaskStore = create<TaskStore>((set) => ({

    // dashboard หน้าเริ่มต้น
    activeTab: 'dashboard',
    setActiveTab: (tab) => set({ activeTab: tab }),

    tasks: initialTasks,
    searchQuery: '',
    filterPriority: 'All',
    filterStatus: 'All',

    // เช็ค Local Storage ก่อนเลย ถ้าไม่มีค่อยไปเช็คจากระบบเครื่อง
    isDarkMode: localStorage.getItem('theme') === 'dark' || 
                (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches),
    isModalOpen: false,

    currentUser: {
        id: 'u1',
        name: 'Best',
        avatarUrl: 'https://i.pravatar.cc/150?img=1'
    },

    selectedTask: null,
    isDetailModalOpen: false,

    addTask: (task) =>
        set((state) => ({ tasks: [...state.tasks, task] })),

    updateTask: (updateTask) =>
        set((state) => ({
            tasks: state.tasks.map((task) =>
                task.id === updateTask.id ? updateTask : task
            ),
        })),
    
    deleteTask: (taskId) => 
        set((state) => ({
            tasks: state.tasks.filter(task => task.id !== taskId)
        })),

    moveTask: (taskId , newStatus) =>
        set((state) => ({
            tasks: state.tasks.map((task) => {
                if (task.id === taskId) {
                    const updatedProgress = newStatus === 'Done' ? 100 : task.progress;
                    return { ...task , status: newStatus , progress: updatedProgress };
                }
                return task;
            }),
        })),

    setSearchQuery: (query) => set({ searchQuery: query}),
    setFilterPriority: (priority) => set({ filterPriority: priority }),
    setFilterStatus: (status) => set ({ filterStatus: status }),

    toggleDarkMode: () =>
        set((state) => {
            const newDarkMode = !state.isDarkMode;
            if (newDarkMode) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
            return { isDarkMode: newDarkMode };
        }),

    openModal: () => set({ isModalOpen: true }),
    closeModal: () => set({ isModalOpen: false }),

    openDetailModal: (task) => set({ selectedTask: task, isDetailModalOpen: true }),
    closeDetailModal: () => set({ selectedTask: null, isDetailModalOpen: false }),
}));