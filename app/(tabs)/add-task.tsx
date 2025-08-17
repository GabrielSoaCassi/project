/**
 * Tela para adicionar nova tarefa
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useColorScheme
} from 'react-native';
import { router } from 'expo-router';
import { Save, ArrowLeft, TestTube } from 'lucide-react-native';
import { useTasks } from '@/hooks/useTasks';
import PrioritySelector from '@/components/PrioritySelector';
import DateSelector from '@/components/DateSelector';
import { TaskPriority, TaskFormData } from '@/types/Task';
import { generateTaskId } from '@/utils/taskHelpers';
import { getThemeColors } from '@/hooks/useColorScheme';
import { scheduleTestNotification } from '@/utils/notifications';

export default function AddTaskScreen() {
  const { addTask } = useTasks();
  const [saving, setSaving] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemeColors(isDark);

  // Estado do formulário
  const [formData, setFormData] = useState<TaskFormData>({
    name: '',
    deadline: (() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0); // Define para 9:00 AM do próximo dia
      return tomorrow;
    })(),
    priority: 'media',
  });

  /**
   * Valida se o formulário está preenchido corretamente
   */
  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      Alert.alert('Erro', 'Por favor, insira o nome da tarefa');
      return false;
    }
    return true;
  };

  /**
   * Salva a nova tarefa
   */
  const handleSaveTask = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      
      const newTask = {
        id: generateTaskId(),
        name: formData.name.trim(),
        deadline: formData.deadline.toISOString(),
        priority: formData.priority,
        createdAt: new Date().toISOString(),
      };

      await addTask(newTask);
      
      Alert.alert('Sucesso', 'Tarefa adicionada com sucesso!', [
        { text: 'OK', onPress: () => router.push('/') }
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a tarefa');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Volta para a tela anterior
   */
  const handleGoBack = () => {
    router.back();
  };

  /**
   * Testa o sistema de notificações
   */
  const handleTestNotification = async () => {
    try {
      await scheduleTestNotification();
      Alert.alert('Teste', 'Notificação de teste agendada para 5 segundos!');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao agendar notificação de teste');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <ArrowLeft color={colors.primary} size={24} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.text }]}>Nova Tarefa</Text>
            <TouchableOpacity style={styles.testButton} onPress={handleTestNotification}>
              <TestTube color={colors.textSecondary} size={20} />
            </TouchableOpacity>
          </View>

          {/* Formulário */}
          <View style={styles.form}>
            {/* Campo Nome da Tarefa */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Nome da Tarefa *</Text>
              <TextInput
                style={[
                  styles.textInput,
                  { 
                    backgroundColor: colors.inputBackground, 
                    borderColor: colors.inputBorder,
                    color: colors.inputText
                  }
                ]}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Digite o nome da tarefa..."
                placeholderTextColor={colors.placeholder}
                maxLength={100}
                multiline
                textAlignVertical="top"
              />
            </View>

            {/* Campo Prazo */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Data e Hora do Prazo</Text>
              <DateSelector
                value={formData.deadline}
                onChange={(date) => setFormData({ ...formData, deadline: date })}
              />
            </View>

            {/* Campo Prioridade */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Prioridade</Text>
              <PrioritySelector
                value={formData.priority}
                onSelect={(priority) => setFormData({ ...formData, priority })}
              />
            </View>
          </View>
        </ScrollView>

        {/* Botão de Salvar */}
        <View style={[styles.buttonContainer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[
              styles.saveButton, 
              { backgroundColor: colors.primary, shadowColor: colors.shadow },
              saving && { backgroundColor: colors.textTertiary }
            ]}
            onPress={handleSaveTask}
            disabled={saving}
          >
            <Save color="#FFFFFF" size={20} />
            <Text style={styles.saveButtonText}>
              {saving ? 'Salvando...' : 'Salvar Tarefa'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  placeholder: {
    width: 32,
  },
  testButton: {
    padding: 4,
  },
  form: {
    padding: 16,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 48,
    maxHeight: 120,
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});