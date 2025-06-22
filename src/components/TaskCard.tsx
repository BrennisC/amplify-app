'use client';

import { ITask } from '@/models/Task';
import { useState } from 'react';
import { FaCheck, FaEdit, FaHourglass, FaTrash } from 'react-icons/fa';

interface TaskCardProps {
  task: ITask;
  onEdit: (task: ITask) => void;
  onDelete: (id: string) => Promise<void>;
  onToggleComplete: (id: string, completed: boolean) => Promise<void>;
}

export default function TaskCard({ task, onEdit, onDelete, onToggleComplete }: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await onDelete(task._id as string);
      } catch (error) {
        console.error('Failed to delete task:', error);
        setIsDeleting(false);
      }
    }
  };

  const handleToggleComplete = async () => {
    setIsUpdating(true);
    try {
      await onToggleComplete(task._id as string, !task.completed);
    } catch (error) {
      console.error('Failed to update task status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-opacity ${
      isDeleting ? 'opacity-50' : 'opacity-100'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className={`text-xl font-semibold ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-white'}`}>
          {task.title}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(task)}
            disabled={isDeleting || isUpdating}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-full dark:text-blue-400 dark:hover:bg-gray-700 transition"
            aria-label="Edit task"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting || isUpdating}
            className="p-2 text-red-600 hover:bg-red-100 rounded-full dark:text-red-400 dark:hover:bg-gray-700 transition"
            aria-label="Delete task"
          >
            <FaTrash size={16} />
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {task.description}
      </p>
      
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
          <span>Created: {formatDate(task.createdAt)}</span>
        </div>
        
        <button
          onClick={handleToggleComplete}
          disabled={isDeleting || isUpdating}
          className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
            task.completed
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
          }`}
        >
          {task.completed ? (
            <>
              <FaCheck size={12} />
              <span>Completed</span>
            </>
          ) : (
            <>
              <FaHourglass size={12} />
              <span>Pending</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
