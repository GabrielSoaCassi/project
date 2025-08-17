/**
 * Hook personalizado para gerenciamento de estado das tarefas
 */

import { useState, useEffect } from 'react';
import { Task } from '@/types/Task';
import { loadTasks, addTask, deleteTask } from '@/utils/storage';
import { sortTasksByDeadline } from '@/utils/taskHelpers';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carrega as tarefas do storage na inicialização
   */
  useEffect(() => {
    loadTasksFromStorage();
  }, []);

  const loadTasksFromStorage = async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedTasks = await loadTasks();
      const sortedTasks = sortTasksByDeadline(loadedTasks);
      setTasks(sortedTasks);
    } catch (err) {
      setError('Erro ao carregar tarefas');
      console.error('Erro ao carregar tarefas:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Adiciona uma nova tarefa
   */
  const handleAddTask = async (newTask: Task) => {
    try {
      setError(null);
      const updatedTasks = await addTask(newTask);
      const sortedTasks = sortTasksByDeadline(updatedTasks);
      setTasks(sortedTasks);
    } catch (err) {
      setError('Erro ao adicionar tarefa');
      console.error('Erro ao adicionar tarefa:', err);
      throw err;
    }
  };

  /**
   * Remove uma tarefa
   */
  const handleDeleteTask = async (taskId: string) => {
    try {
      setError(null);
      const updatedTasks = await deleteTask(taskId);
      const sortedTasks = sortTasksByDeadline(updatedTasks);
      setTasks(sortedTasks);
    } catch (err) {
      setError('Erro ao excluir tarefa');
      console.error('Erro ao excluir tarefa:', err);
      throw err;
    }
  };

  /**
   * Recarrega as tarefas do storage
   */
  const refreshTasks = () => {
    loadTasksFromStorage();
  };

  return {
    tasks,
    loading,
    error,
    addTask: handleAddTask,
    deleteTask: handleDeleteTask,
    refreshTasks,
  };
};