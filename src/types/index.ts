export type TaskPriority = 'Low' | 'Medium Priority' | 'High Priority';
export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export interface User {
    id: string;
    name: string;
    avatarUrl: string;
}

export interface Task {
    id: string;
    title: string;
    projectName: string;
    tag: string;
    priority: TaskPriority;
    date: string;
    status: TaskStatus;
    progress: number;
    assignees: User[];
}