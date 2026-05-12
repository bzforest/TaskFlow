import type { Task } from "../types";

// จำลองข้อมูล User (Avatar)
const users = {
  user1: { id: 'u1', name: 'Alice', avatarUrl: 'https://i.pravatar.cc/150?img=1' },
  user2: { id: 'u2', name: 'Bob', avatarUrl: 'https://i.pravatar.cc/150?img=2' },
  user3: { id: 'u3', name: 'Charlie', avatarUrl: 'https://i.pravatar.cc/150?img=3' },
  user4: { id: 'u4', name: 'Diana', avatarUrl: 'https://i.pravatar.cc/150?img=4' },
};

export const initialTasks: Task[] = [
  {
    id: 't1',
    title: 'Implement Dark Mode',
    projectName: 'Web App Redesign',
    tag: 'Feature',
    priority: 'Medium Priority',
    date: 'Oct 28',
    status: 'To Do',
    progress: 0,
    assignees: [users.user1, users.user2, users.user3],
  },
  {
    id: 't2',
    title: 'Implement Dark Mode Toggle',
    projectName: 'Web App Redesign',
    tag: 'Feature',
    priority: 'Medium Priority',
    date: 'Oct 28',
    status: 'In Progress',
    progress: 45,
    assignees: [users.user2, users.user3, users.user4],
  },
  {
    id: 't3',
    title: 'Promist t:lear determination',
    projectName: 'Web App Redesign',
    tag: 'Feature',
    priority: 'High Priority',
    date: 'Oct 28',
    status: 'Done',
    progress: 100,
    assignees: [users.user1, users.user4],
  },
  {
    id: 't4',
    title: 'Implement annoliance',
    projectName: 'Web App Redesign',
    tag: 'Feature',
    priority: 'Low',
    date: 'Oct 28',
    status: 'To Do',
    progress: 0,
    assignees: [users.user2, users.user4, users.user1],
  },
  // เดี๋ยวเราค่อยมาเติมข้อมูลเพิ่มทีหลังเพื่อให้พอทดสอบ Pagination ครับ
];