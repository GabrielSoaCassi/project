/**
 * Componente seletor de prioridade
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, useColorScheme } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { TaskPriority } from '@/types/Task';
import { getPriorityColor, getPriorityText } from '@/utils/taskHelpers';
import { getThemeColors } from '@/hooks/useColorScheme';

interface PrioritySelectorProps {
  value: TaskPriority;
  onSelect: (priority: TaskPriority) => void;
}

const priorities: TaskPriority[] = ['baixa', 'media', 'alta'];

export default function PrioritySelector({ value, onSelect }: PrioritySelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemeColors(isDark);

  const handleSelect = (priority: TaskPriority) => {
    onSelect(priority);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity 
        style={[
          styles.selector,
          { 
            backgroundColor: colors.inputBackground, 
            borderColor: colors.inputBorder 
          }
        ]} 
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.selectedOption}>
          <View style={[styles.colorIndicator, { backgroundColor: getPriorityColor(value) }]} />
          <Text style={[styles.selectedText, { color: colors.inputText }]}>{getPriorityText(value)}</Text>
        </View>
        <ChevronDown color={colors.textSecondary} size={20} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Selecionar Prioridade</Text>
            {priorities.map((priority) => (
              <TouchableOpacity
                key={priority}
                style={[
                  styles.option,
                  value === priority && { backgroundColor: colors.backgroundSecondary }
                ]}
                onPress={() => handleSelect(priority)}
              >
                <View style={[styles.colorIndicator, { backgroundColor: getPriorityColor(priority) }]} />
                <Text style={[
                  styles.optionText, 
                  { color: colors.text },
                  value === priority && { color: colors.primary, fontWeight: '600' }
                ]}>
                  {getPriorityText(priority)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 48,
  },
  selectedOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedText: {
    fontSize: 16,
    marginLeft: 8,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 2,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 8,
  },
});