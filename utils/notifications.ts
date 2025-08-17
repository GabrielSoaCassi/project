/**
 * Utilitários para gerenciamento de notificações
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Task } from '@/types/Task';

// Configuração do comportamento das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Solicita permissões para notificações
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Permissão para notificações negada');
      return false;
    }

    // Configuração adicional para Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Lembretes de Tarefas',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#3B82F6',
      });
    }

    return true;
  } catch (error) {
    console.error('Erro ao solicitar permissões de notificação:', error);
    return false;
  }
};

/**
 * Agenda uma notificação para uma tarefa
 */
export const scheduleTaskNotification = async (task: Task): Promise<string | null> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return null;
    }

    const taskDate = new Date(task.deadline);
    const now = new Date();
    
    // Agenda notificação 1 hora antes do prazo
    const reminderTime = new Date(taskDate.getTime() - 60 * 60 * 1000);
    
    // Agenda notificação de lembrete (1 hora antes) se for no futuro
    if (reminderTime > now) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '⏰ Tarefa próxima do prazo!',
          body: `"${task.name}" expira em 1 hora`,
          data: { taskId: task.id, type: 'reminder' },
          sound: true,
        },
        trigger: {
          date: reminderTime,
        },
      });
      console.log(`Lembrete agendado para ${reminderTime.toLocaleString()}`);
    }

    // Agenda alarme no momento exato do prazo se for no futuro
    if (taskDate > now) {
      const alarmId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🚨 PRAZO EXPIRADO!',
          body: `A tarefa "${task.name}" atingiu o prazo limite!`,
          data: { taskId: task.id, type: 'deadline' },
          sound: true,
          priority: 'high',
        },
        trigger: {
          date: taskDate,
        },
      });
      console.log(`Alarme de prazo agendado para ${taskDate.toLocaleString()}`);
      return alarmId;
    }

    return null;
  } catch (error) {
    console.error('Erro ao agendar notificações:', error);
    return null;
  }
};

/**
 * Agenda múltiplas notificações para uma tarefa
 */
export const scheduleTaskNotifications = async (task: Task): Promise<string[]> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return [];
    }

    const taskDate = new Date(task.deadline);
    const now = new Date();
    const notificationIds: string[] = [];
    
    // Agenda notificação 1 hora antes do prazo
    const reminderTime = new Date(taskDate.getTime() - 60 * 60 * 1000);
    if (reminderTime > now) {
      const reminderId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '⏰ Tarefa próxima do prazo!',
          body: `"${task.name}" expira em 1 hora`,
          data: { taskId: task.id, type: 'reminder' },
          sound: true,
        },
        trigger: {
          date: reminderTime,
        },
      });
      notificationIds.push(reminderId);
      console.log(`Lembrete agendado para ${reminderTime.toLocaleString()}`);
    }

    // Agenda alarme no momento exato do prazo
    if (taskDate > now) {
      const alarmId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🚨 PRAZO EXPIRADO!',
          body: `A tarefa "${task.name}" atingiu o prazo limite!`,
          data: { taskId: task.id, type: 'deadline' },
          sound: true,
          priority: 'high',
        },
        trigger: {
          date: taskDate,
        },
      });
      notificationIds.push(alarmId);
      console.log(`Alarme de prazo agendado para ${taskDate.toLocaleString()}`);
    }

    return notificationIds;
  } catch (error) {
    console.error('Erro ao agendar notificações:', error);
    return [];
  }
};

/**
 * Cancela múltiplas notificações
 */
export const cancelTaskNotifications = async (notificationIds: string[]): Promise<void> => {
  try {
    for (const id of notificationIds) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }
    console.log('Notificações canceladas:', notificationIds);
  } catch (error) {
    console.error('Erro ao cancelar notificações:', error);
  }
};

/**
 * Agenda notificação de teste (para debug)
 */
export const scheduleTestNotification = async (): Promise<void> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return null;
    }

    // Agenda notificação para 5 segundos no futuro
    const testTime = new Date(Date.now() + 5000);
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🧪 Teste de Notificação',
        body: 'Esta é uma notificação de teste do sistema de alarmes',
        data: { type: 'test' },
        sound: true,
      },
      trigger: {
        date: testTime,
      },
    });
    
    console.log(`Notificação de teste agendada para ${testTime.toLocaleString()}`);
  } catch (error) {
    console.error('Erro ao agendar notificação de teste:', error);
  }
};

/**
 * Cancela uma notificação agendada
 */
export const cancelTaskNotification = async (notificationId: string): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log('Notificação cancelada:', notificationId);
  } catch (error) {
    console.error('Erro ao cancelar notificação:', error);
  }
};

/**
 * Cancela todas as notificações agendadas
 */
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('Todas as notificações foram canceladas');
  } catch (error) {
    console.error('Erro ao cancelar todas as notificações:', error);
  }
};

/**
 * Verifica se uma tarefa precisa de notificação
 */
export const shouldScheduleNotification = (deadline: string): boolean => {
  const taskDate = new Date(deadline);
  const now = new Date();
  const notificationTime = new Date(taskDate.getTime() - 60 * 60 * 1000);
  
  return notificationTime > now;
};