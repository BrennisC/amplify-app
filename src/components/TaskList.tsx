'use client';

import { ITask } from '@/models/Task';
import { useEffect, useState } from 'react';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';

export default function TaskList() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<ITask | null>(null);
  
  // Fetch all tasks
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    
    try {      const response = await fetch('/api');
      console.log('Fetching tasks from API...');
      console.log('Response status:', response);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      const data = await response.json();
      console.log('Fetched tasks:', data);
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };
    // Create a new task
  const handleCreateTask = async (taskData: Partial<ITask>) => {
    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error creating task:', errorData);
        const errorMessage = errorData.error || errorData.message || 'Failed to create task';
        throw new Error(errorMessage);
      }
      
      // Refresh the task list
      fetchTasks();
    } catch (err) {
      console.error('Error creating task:', err);
      throw err;
    }
  };
    // Update an existing task
  const handleUpdateTask = async (taskData: Partial<ITask>) => {
    if (!editingTask?._id) return;
    
    try {
      const response = await fetch(`/api/${editingTask._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || (errorData.success === false ? errorData.error : null) || 'Failed to update task';
        throw new Error(errorMessage);
      }
      
      // Refresh the task list and reset editing state
      fetchTasks();
      setEditingTask(null);
    } catch (err) {
      console.error('Error updating task:', err);
      throw err;
    }
  };
    // Delete a task
  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/${taskId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || errorData.message || 'Failed to delete task';
        throw new Error(errorMessage);
      }
      
      // Remove the task from the state
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      throw err;
    }
  };
    // Toggle task completion status
  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || errorData.message || 'Failed to update task status';
        throw new Error(errorMessage);
      }
      
      // Update the task in the state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId ? { ...task, completed } : task
        )
      );
    } catch (err) {
      console.error('Error updating task status:', err);
      throw err;
    }
  };
  
  // Load tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        {editingTask ? (
          <div className="mb-6">
            <TaskForm
              task={editingTask}
              isEditing={true}
              onSubmit={handleUpdateTask}
            />
            <div className="mt-4 text-center">
              <button
                onClick={() => setEditingTask(null)}
                className="text-gray-600 hover:underline dark:text-gray-400"
              >
                Cancel editing
              </button>
            </div>
          </div>
        ) : (
          <TaskForm onSubmit={handleCreateTask} />
        )}
      </div>
      
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Your Tasks</h2>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading tasks...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">No tasks found. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {tasks.map(task => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={setEditingTask}
              onDelete={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
