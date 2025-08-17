/**
 * Funções auxiliares para manipulação de tarefas
 */

import { Task, TaskPriority } from '@/types/Task';

/**
 * Ordena as tarefas por prazo (mais próximas primeiro)
 */
export const sortTasksByDeadline = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    const dateA = new Date(a.deadline);
    const dateB = new Date(b.deadline);
    return dateA.getTime() - dateB.getTime();
  });
};

/**
 * Gera um ID único para nova tarefa
 */
export const generateTaskId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

/**
 * Formatação de data e hora para exibição
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Formatação de data simples para exibição
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Verifica se uma tarefa está atrasada
 */
export const isTaskOverdue = (deadline: string): boolean => {
  const now = new Date();
  const taskDeadline = new Date(deadline);
  return taskDeadline < now;
};

/**
 * Verifica se uma tarefa está próxima do prazo (menos de 24 horas)
 */
export const isTaskNearDeadline = (deadline: string): boolean => {
  const now = new Date();
  const taskDeadline = new Date(deadline);
  const timeDiff = taskDeadline.getTime() - now.getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60);
  
  return hoursDiff > 0 && hoursDiff <= 24;
};

/**
 * Retorna a cor correspondente à prioridade
 */
export const getPriorityColor = (priority: TaskPriority): string => {
  switch (priority) {
    case 'alta':
      return '#EF4444'; // Vermelho
    case 'media':
      return '#F59E0B'; // Laranja
    case 'baixa':
      return '#10B981'; // Verde
    default:
      return '#6B7280'; // Cinza
  }
};

/**
 * Retorna o texto de prioridade formatado
 */
export const getPriorityText = (priority: TaskPriority): string => {
  switch (priority) {
    case 'alta':
      return 'Alta';
    case 'media':
      return 'Média';
    case 'baixa':
      return 'Baixa';
    default:
      return 'Baixa';
  }
};