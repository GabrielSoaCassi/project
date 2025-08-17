/**
 * Definição dos tipos para o sistema de tarefas
 */

export type TaskPriority = 'baixa' | 'media' | 'alta';

export interface Task {
  id: string;
  name: string;
  deadline: string; // ISO string format with time
  priority: TaskPriority;
  createdAt: string; // ISO string format
  notificationIds?: string[]; // IDs das notificações agendadas
}

export interface TaskFormData {
  name: string;
  deadline: Date; // Date with time
  priority: TaskPriority;
}