/**
 * Botão flutuante para adicionar nova tarefa
 */

import React from 'react';
import { TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Plus } from 'lucide-react-native';
import { getThemeColors } from '@/hooks/useColorScheme';

interface FloatingActionButtonProps {
  onPress: () => void;
}

export default function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.primary, shadowColor: colors.shadow }]} 
      onPress={onPress} 
      activeOpacity={0.8}
    >
      <Plus color="#FFFFFF" size={24} strokeWidth={2.5} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});