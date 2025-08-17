/**
 * Hook para detectar o tema do sistema (Dark/Light)
 */

import { useColorScheme as useRNColorScheme } from 'react-native';

export const useColorScheme = () => {
  const colorScheme = useRNColorScheme();
  return colorScheme || 'light';
};

/**
 * Cores adaptáveis ao tema
 */
export const getThemeColors = (isDark: boolean) => ({
  // Cores de fundo
  background: isDark ? '#000000' : '#FFFFFF',
  backgroundSecondary: isDark ? '#1C1C1E' : '#F2F2F7',
  backgroundTertiary: isDark ? '#2C2C2E' : '#FFFFFF',
  
  // Cores de texto
  text: isDark ? '#FFFFFF' : '#000000',
  textSecondary: isDark ? '#AEAEB2' : '#3C3C43',
  textTertiary: isDark ? '#8E8E93' : '#8E8E93',
  
  // Cores de borda
  border: isDark ? '#38383A' : '#C6C6C8',
  borderSecondary: isDark ? '#48484A' : '#E5E5EA',
  
  // Cores de ação
  primary: '#007AFF',
  primaryDark: '#0056CC',
  
  // Cores de status
  success: isDark ? '#30D158' : '#34C759',
  warning: isDark ? '#FF9F0A' : '#FF9500',
  error: isDark ? '#FF453A' : '#FF3B30',
  
  // Cores de prioridade
  priorityHigh: isDark ? '#FF453A' : '#FF3B30',
  priorityMedium: isDark ? '#FF9F0A' : '#FF9500',
  priorityLow: isDark ? '#30D158' : '#34C759',
  
  // Cores de input
  inputBackground: isDark ? '#1C1C1E' : '#F2F2F7',
  inputBorder: isDark ? '#38383A' : '#C6C6C8',
  inputText: isDark ? '#FFFFFF' : '#000000',
  placeholder: isDark ? '#8E8E93' : '#8E8E93',
  
  // Cores de card
  cardBackground: isDark ? '#1C1C1E' : '#FFFFFF',
  cardBorder: isDark ? '#38383A' : '#E5E5EA',
  
  // Cores de sombra
  shadow: isDark ? '#000000' : '#000000',
  shadowOpacity: isDark ? 0.3 : 0.1,
});