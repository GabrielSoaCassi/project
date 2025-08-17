/**
 * Componente seletor de data e hora
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, useColorScheme } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, Clock } from 'lucide-react-native';
import { getThemeColors } from '@/hooks/useColorScheme';

interface DateSelectorProps {
  value: Date;
  onChange: (date: Date) => void;
}

export default function DateSelector({ value, onChange }: DateSelectorProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemeColors(isDark);

  const formatDisplayDate = (date: Date): string => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatDisplayTime = (date: Date): string => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      // Mantém o horário atual ao alterar apenas a data
      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(value.getHours());
      newDateTime.setMinutes(value.getMinutes());
      onChange(newDateTime);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    
    if (selectedTime) {
      // Combina a data atual com o novo horário
      const newDateTime = new Date(value);
      newDateTime.setHours(selectedTime.getHours());
      newDateTime.setMinutes(selectedTime.getMinutes());
      onChange(newDateTime);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.selectorContainer}>
        {/* Seletor de Data */}
        <TouchableOpacity 
          style={[
            styles.selector, 
            styles.dateSelector,
            { 
              backgroundColor: colors.inputBackground, 
              borderColor: colors.inputBorder 
            }
          ]} 
          onPress={() => setShowDatePicker(true)}
        >
          <View style={styles.selectorContent}>
            <Calendar color={colors.primary} size={20} />
            <Text style={[styles.selectorText, { color: colors.inputText }]}>{formatDisplayDate(value)}</Text>
          </View>
        </TouchableOpacity>

        {/* Seletor de Hora */}
        <TouchableOpacity 
          style={[
            styles.selector, 
            styles.timeSelector,
            { 
              backgroundColor: colors.inputBackground, 
              borderColor: colors.inputBorder 
            }
          ]} 
          onPress={() => setShowTimePicker(true)}
        >
          <View style={styles.selectorContent}>
            <Clock color={colors.primary} size={20} />
            <Text style={[styles.selectorText, { color: colors.inputText }]}>{formatDisplayTime(value)}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={value}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  selectorContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  selector: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 48,
  },
  dateSelector: {
    // Estilos específicos para o seletor de data se necessário
  },
  timeSelector: {
    // Estilos específicos para o seletor de hora se necessário
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorText: {
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
});