/**
 * Utilitários para persistência de dados usando AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '@/types/Task';
import { scheduleTaskNotifications, cancelTaskNotifications } from './notifications';

const TASKS_STORAGE_KEY = '@tasks';

/**
 * Salva as tarefas no AsyncStorage
 */
export const saveTasks = async (tasks: Task[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(tasks);
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Erro ao salvar tarefas:', error);
    throw new Error('Falha ao salvar tarefas');
  }
};

/**
 * Carrega as tarefas do AsyncStorage
 */
export const loadTasks = async (): Promise<Task[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Erro ao carregar tarefas:', error);
    return [];
  }
};

/**
 * Adiciona uma nova tarefa
 */
export const addTask = async (task: Task): Promise<Task[]> => {
  try {
    const existingTasks = await loadTasks();
    
    // Agenda notificações para a nova tarefa
    const notificationIds = await scheduleTaskNotifications(task);
    if (notificationIds.length > 0) {
      task.notificationIds = notificationIds;
    }
    
    const updatedTasks = [...existingTasks, task];
    await saveTasks(updatedTasks);
    return updatedTasks;
  } catch (error) {
    console.error('Erro ao adicionar tarefa:', error);
    throw new Error('Falha ao adicionar tarefa');
  }
};

/**
 * Remove uma tarefa pelo ID
 */
export const deleteTask = async (taskId: string): Promise<Task[]> => {
  try {
    const existingTasks = await loadTasks();
    const taskToDelete = existingTasks.find(task => task.id === taskId);
    
    // Cancela as notificações se existirem
    if (taskToDelete?.notificationIds && taskToDelete.notificationIds.length > 0) {
      await cancelTaskNotifications(taskToDelete.notificationIds);
    }
    
    const updatedTasks = existingTasks.filter(task => task.id !== taskId);
    await saveTasks(updatedTasks);
    return updatedTasks;
  } catch (error) {
    console.error('Erro ao excluir tarefa:', error);
    throw new Error('Falha ao excluir tarefa');
  }
};