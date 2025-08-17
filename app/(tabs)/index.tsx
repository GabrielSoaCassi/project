/**
 * Tela principal de listagem de tarefas
 */

import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Alert, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { useTasks } from '@/hooks/useTasks';
import TaskCard from '@/components/TaskCard';
import FloatingActionButton from '@/components/FloatingActionButton';
import EmptyState from '@/components/EmptyState';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Task } from '@/types/Task';
import { getThemeColors } from '@/hooks/useColorScheme';

export default function TaskListScreen() {
  const { tasks, loading, error, deleteTask, refreshTasks } = useTasks();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemeColors(isDark);

  // Recarrega as tarefas quando a tela ganha foco
  useFocusEffect(
    React.useCallback(() => {
      refreshTasks();
    }, [])
  );

  /**
   * Navega para a tela de adicionar tarefa
   */
  const navigateToAddTask = () => {
    router.push('/add-task');
  };

  /**
   * Handle para excluir tarefa
   */
  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir a tarefa');
    }
  };

  /**
   * Renderiza cada item da lista
   */
  const renderTaskItem = ({ item }: { item: Task }) => (
    <TaskCard task={item} onDelete={handleDeleteTask} />
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Minhas Tarefas</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {tasks.length === 0 
            ? 'Nenhuma tarefa cadastrada' 
            : `${tasks.length} tarefa${tasks.length !== 1 ? 's' : ''} cadastrada${tasks.length !== 1 ? 's' : ''}`
          }
        </Text>
      </View>

      {/* Exibe erro se houver */}
      {error && (
        <View style={[styles.errorContainer, { backgroundColor: isDark ? '#2D1B1B' : '#FEF2F2', borderColor: isDark ? '#5B2C2C' : '#FECACA' }]}>
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        </View>
      )}

      {/* Lista de tarefas ou estado vazio */}
      {tasks.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Botão flutuante para adicionar tarefa */}
      <FloatingActionButton onPress={navigateToAddTask} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  errorContainer: {
    margin: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  listContainer: {
    paddingVertical: 8,
    paddingBottom: 100, // Espaço para o botão flutuante
  },
});