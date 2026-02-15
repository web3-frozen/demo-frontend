import { useState, useEffect, useCallback } from 'react';
import type { Task, CreateTaskRequest, UpdateTaskRequest } from '../types/task';

const API_BASE = '/api/tasks';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error(`Failed to fetch tasks: ${res.status}`);
      const data = await res.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 30000);
    return () => clearInterval(interval);
  }, [fetchTasks]);

  const createTask = async (req: CreateTaskRequest): Promise<Task> => {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (!res.ok) throw new Error('Failed to create task');
    const task = await res.json();
    setTasks(prev => [task, ...prev]);
    return task;
  };

  const updateTask = async (id: string, req: UpdateTaskRequest): Promise<Task> => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (!res.ok) throw new Error('Failed to update task');
    const task = await res.json();
    setTasks(prev => prev.map(t => (t.id === id ? task : t)));
    return task;
  };

  const deleteTask = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete task');
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return { tasks, loading, error, createTask, updateTask, deleteTask, refresh: fetchTasks };
}
