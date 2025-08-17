/**
 * Componente para estado vazio da lista de tarefas
 */

import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { SquareCheck as CheckSquare } from 'lucide-react-native';
import { getThemeColors } from '@/hooks/useColorScheme';

export default function EmptyState() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <CheckSquare color={colors.textTertiary} size={48} />
      </View>
      <Text style={[styles.title, { color: colors.textSecondary }]}>Nenhuma tarefa encontrada</Text>
      <Text style={[styles.subtitle, { color: colors.textTertiary }]}>
        Toque no botão "+" para adicionar sua primeira tarefa
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});