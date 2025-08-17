/**
 * Componente para exibir uma tarefa individual na lista
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, useColorScheme } from 'react-native';
import { Trash2, Clock, CircleAlert as AlertCircle, Bell, AlarmClock } from 'lucide-react-native';
import { Task } from '@/types/Task';
import { formatDateTime, isTaskOverdue, isTaskNearDeadline, getPriorityColor, getPriorityText } from '@/utils/taskHelpers';
import { getThemeColors } from '@/hooks/useColorScheme';

interface TaskCardProps {
  task: Task;
  onDelete: (taskId: string) => void;
}

export default function TaskCard({ task, onDelete }: TaskCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemeColors(isDark);
  
  const isOverdue = isTaskOverdue(task.deadline);
  const isNearDeadline = isTaskNearDeadline(task.deadline);
  const priorityColor = getPriorityColor(task.priority);
  const priorityText = getPriorityText(task.priority);

  /**
   * Confirma a exclusão da tarefa
   */
  const confirmDelete = () => {
    Alert.alert(
      'Excluir Tarefa',
      'Tem certeza que deseja excluir esta tarefa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => onDelete(task.id) }
      ]
    );
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: colors.cardBackground, borderLeftColor: colors.border },
      isOverdue && styles.overdueContainer,
      !isOverdue && isNearDeadline && styles.nearDeadlineContainer
    ]}>
      {/* Indicador de prioridade */}
      <View style={[styles.priorityIndicator, { backgroundColor: priorityColor }]} />
      
      <View style={styles.content}>
        {/* Nome da tarefa */}
        <Text style={[
          styles.taskName,
          { color: colors.text },
          isOverdue && styles.overdueText,
          !isOverdue && isNearDeadline && styles.nearDeadlineText
        ]} numberOfLines={2}>
          {task.name}
        </Text>
        
        {/* Informações de prazo e prioridade */}
        <View style={styles.infoRow}>
          <View style={styles.deadlineContainer}>
            <Clock color={isOverdue ? colors.error : isNearDeadline ? colors.warning : colors.textSecondary} size={16} />
            <Text style={[
              styles.deadline,
              { color: colors.textSecondary },
              isOverdue && styles.overdueText,
              !isOverdue && isNearDeadline && styles.nearDeadlineText
            ]}>
              {formatDateTime(task.deadline)}
            </Text>
            {isOverdue && <AlarmClock color={colors.error} size={16} />}
            {!isOverdue && isNearDeadline && <Bell color={colors.warning} size={16} />}
          </View>
          
          <View style={styles.priorityContainer}>
            <View style={[styles.priorityBadge, { backgroundColor: priorityColor }]}>
              <Text style={styles.priorityText}>{priorityText}</Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Botão de exclusão */}
      <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
        <Trash2 color={colors.error} size={20} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
  },
  overdueContainer: {
  },
  nearDeadlineContainer: {
  },
  priorityIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 20,
  },
  overdueText: {
  },
  nearDeadlineText: {
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deadline: {
    fontSize: 14,
    marginLeft: 6,
    marginRight: 4,
  },
  priorityContainer: {
    alignItems: 'flex-end',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF', // Sempre branco para contraste
  },
  deleteButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});