import { useState } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import Modal from '../ui/Modal';
import { Trash2, Edit2, Plus, X, Users, AlertTriangle, Check } from 'lucide-react';
import clsx from 'clsx';
import type { Task, ChecklistItem } from '../../types';
import AnimatedProgress from '../ui/AnimatedProgress';
import AnimatedAvatarGroup from '../ui/AnimatedAvatarGroup';

export default function TaskDetailModal() {
    const { selectedTask , isDetailModalOpen , closeDetailModal , updateTask , deleteTask , currentUser } = useTaskStore();

    const [isEditing , setIsEditing] = useState(false);
    const [draftTask , setDraftTask] = useState<Task | null>(null);
    const [showDeleteConfirm , setShowDeleteConfirm] = useState(false);
    const [newChecklistTitle , setNewChecklistTitle] = useState('');

    const [prevSelectedId, setPrevSelectedId] = useState<string | null>(null);
    const currentId = selectedTask?.id || null; 

    if (currentId !== prevSelectedId) {
        setPrevSelectedId(currentId);
        setDraftTask(selectedTask ? { ...selectedTask } : null);
        setIsEditing(false);
        setShowDeleteConfirm(false);
    }

    if (!selectedTask || !draftTask) return null;

    const handleSave = () => {
        updateTask(draftTask);
        setIsEditing(false);
    };

    const handleConfirmDelete = () => {
        deleteTask(draftTask.id);
        closeDetailModal();
    };

    const toggleChecklist = (checkId: string) => {
        const updatedChecklist = (draftTask.checklist || []).map(item =>
            item.id === checkId ? { ...item, isCompleted: !item.isCompleted } : item
        );

        // คำนวน Progress
        const completedCount = updatedChecklist.filter(item => item.isCompleted).length;
        const totalCount = updatedChecklist.length;
        const newProgress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

        // อัปเดต status ตาม Progress
        let newStatus = draftTask.status;
        if (newProgress === 100) newStatus = 'Done';
        else if (newProgress > 0 && newProgress < 100) newStatus = 'In Progress';
        else if (newProgress === 0) newStatus = 'To Do';
        
        // 
        const updatedTask = {
            ...draftTask,
            checklist: updatedChecklist,
            progress: newProgress,
            status: newStatus
        };

        setDraftTask(updatedTask);

        // ถ้าไม่ได้อยู่ในโหมด Edit ก็ยังสามารถ checklist ได้
        if (!isEditing) updateTask(updatedTask);
    };

    const handleAddChecklist = () => {
        if (!newChecklistTitle.trim()) return;
        
        const newItem: ChecklistItem = {
            id: Date.now().toString(),
            title: newChecklistTitle,
            isCompleted: false
        };
        const updatedChecklist = [...(draftTask.checklist || []), newItem];

        // คำนวน Progress ใหม่
        const completedCount = updatedChecklist.filter(item => item.isCompleted).length;
        const totalCount = updatedChecklist.length;
        const newProgress = Math.round((completedCount / totalCount) * 100);

        setDraftTask({ ...draftTask, checklist: updatedChecklist, progress: newProgress });
        setNewChecklistTitle('');
    };

    // จำลองเพิ่มผู้รับผิดชอบ
    const handleJoinTask = () => {
        const isAlreadyAssigned = draftTask.assignees.some(u => u.id === currentUser.id);
        
        if (!isAlreadyAssigned) {
            setDraftTask({
                ...draftTask,
                assignees: [...draftTask.assignees, { id: currentUser.id, name: currentUser.name, avatarUrl: currentUser.avatarUrl || ''}]
            });
        }
    };


    return (
        <Modal isOpen={isDetailModalOpen} onClose={closeDetailModal} title={isEditing ? "Edit Task" : "Task Details"}>
        
        {/* ยืนยันการลบ */}
        {showDeleteConfirm && (
            <div className="absolute inset-0 z-50 bg-white/95 dark:bg-brand-navy/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center rounded-2xl">
            <AlertTriangle size={48} className="text-red-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete this task?</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">This action cannot be undone. Are you sure you want to permanently delete "{draftTask.title}"?</p>
            <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                <button onClick={handleConfirmDelete} className="px-4 py-2 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 transition-colors">Yes, Delete</button>
            </div>
            </div>
        )}

        {/* content */}
        <div className="flex flex-col gap-6">
            
            {/* Title & Description */}
            <div>
            {isEditing ? (
                <input 
                type="text" 
                value={draftTask.title} 
                onChange={(e) => setDraftTask({...draftTask, title: e.target.value})}
                className="w-full text-xl font-bold px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-blue mb-3 text-gray-900 dark:text-white"
                />
            ) : (
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{draftTask.title}</h3>
            )}

            {isEditing ? (
                <textarea 
                placeholder="Add a more detailed description..."
                value={draftTask.description || ''} 
                onChange={(e) => setDraftTask({...draftTask, description: e.target.value})}
                className="w-full h-24 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-brand-blue resize-none text-gray-900 dark:text-white"
                />
            ) : (
                <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg min-h-[60px]">
                {draftTask.description || <span className="text-gray-400 italic">No description provided.</span>}
                </p>
            )}
            </div>
    
            {/* Progress Bar */}
            <div>
                <AnimatedProgress progress={draftTask.progress} />
            </div>

            {/* Assignees */}
            <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                    <Users size={16} /> Assignees
                </h4>
                <div className="flex items-center gap-3">
                    <AnimatedAvatarGroup users={draftTask.assignees} max={5} />
                    {isEditing && (
                        <button onClick={handleJoinTask} className="w-8 h-8 rounded-full border border-dashed border-gray-400 dark:border-gray-600 flex items-center justify-center text-gray-500 hover:text-brand-blue hover:border-brand-blue transition-colors" title="Join Task">
                            <Plus size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Checklist Section */}
            <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                    To-Do List
                </h4>
                
                <div className="flex flex-col gap-2">
                    {(draftTask.checklist || []).map((item) => (
                        <div key={item.id} className="flex items-center gap-3 group">
                            <button 
                                onClick={() => toggleChecklist(item.id)}
                                className={clsx(
                                    "w-5 h-5 rounded flex items-center justify-center transition-colors border cursor-pointer",
                                    item.isCompleted 
                                    ? "bg-brand-blue border-brand-blue text-white" 
                                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-transparent hover:border-brand-blue"
                                )}
                            >
                                <Check size={14} />
                            </button>
                            <span className={clsx("text-sm transition-all", item.isCompleted ? "line-through text-gray-400" : "text-gray-700 dark:text-gray-200")}>
                                {item.title}
                            </span>
                            
                            {/* ปุ่มลบ Checklist */}
                            {isEditing && (
                                <button 
                                    onClick={() => {
                                        const updated = (draftTask.checklist || []).filter(c => c.id !== item.id);
                                        setDraftTask({...draftTask, checklist: updated});
                                    }}
                                    className="ml-auto opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    ))}

                    {/* New Checklist */}
                    {isEditing && (
                        <div className="flex items-center gap-2 mt-2">
                            <input 
                                type="text" 
                                placeholder="Add an item..."
                                value={newChecklistTitle}
                                onChange={(e) => setNewChecklistTitle(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddChecklist()}
                                className="flex-1 px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-blue text-gray-900 dark:text-white"
                            />
                            <button onClick={handleAddChecklist} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                                Add
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                
                <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                    <Trash2 size={16} /> <span className="hidden sm:inline">Delete Task</span>
                </button>

                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <button onClick={() => { setIsEditing(false); setDraftTask({...selectedTask}); }} className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-white bg-brand-blue rounded-lg hover:bg-brand-blue-hover shadow-lg shadow-brand-blue/20 transition-colors">
                                Apply Changes
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gray-800 dark:bg-gray-700 rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors">
                            <Edit2 size={16} /> Edit Details
                        </button>
                    )}
                </div>
            </div>

        </div>
        </Modal>
    );
}