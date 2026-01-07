
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFinancial } from '../context/financial-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ModalScreen() {
  const router = useRouter();
  const { type: initialType } = useLocalSearchParams();
  const { addTransaction } = useFinancial();

  const [type, setType] = useState<'income' | 'expense'>((initialType as 'income' | 'expense') || 'expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const categories = type === 'income'
    ? ['Salario', 'Negocio', 'Inversiones', 'Regalos', 'Otros']
    : ['Vivienda', 'Alimentación', 'Transporte', 'Servicios', 'Entretenimiento', 'Salud', 'Educación', 'Ahorros', 'Deudas', 'Otros'];

  const handleSubmit = () => {
    if (!amount || !description || !category) return;

    addTransaction({
      type,
      amount: parseFloat(amount),
      description,
      category,
      date: new Date().toISOString(),
      account: 'Efectivo' // Default for MVP
    });

    router.back();
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-slate-950">
      {/* Header */}
      <View className="flex-row justify-between items-center p-4 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-blue-600 text-base font-medium">Cancelar</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-slate-900 dark:text-white">Nueva Transacción</Text>
        <TouchableOpacity onPress={handleSubmit} disabled={!amount || !description}>
          <Text className={`text-base font-bold ${(!amount || !description) ? 'text-gray-400' : 'text-blue-600'}`}>Guardar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Type Switcher */}
        <View className="flex-row bg-gray-200 dark:bg-slate-800 p-1 rounded-xl mb-6">
          <TouchableOpacity
            className={`flex-1 py-2 rounded-lg items-center ${type === 'income' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}
            onPress={() => setType('income')}
          >
            <Text className={`font-medium ${type === 'income' ? 'text-emerald-600' : 'text-slate-500'}`}>Ingreso</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-2 rounded-lg items-center ${type === 'expense' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}
            onPress={() => setType('expense')}
          >
            <Text className={`font-medium ${type === 'expense' ? 'text-rose-600' : 'text-slate-500'}`}>Gasto</Text>
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <View className="bg-white dark:bg-slate-900 p-4 rounded-xl mb-4">
          <Text className="text-xs text-slate-500 mb-1">Monto (RD$)</Text>
          <TextInput
            className="text-3xl font-bold text-slate-900 dark:text-white"
            placeholder="0.00"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            autoFocus
          />
        </View>

        {/* Description Input */}
        <View className="bg-white dark:bg-slate-900 p-4 rounded-xl mb-4">
          <Text className="text-xs text-slate-500 mb-1">Descripción</Text>
          <TextInput
            className="text-base text-slate-900 dark:text-white"
            placeholder="¿En qué gastaste?"
            placeholderTextColor="#94a3b8"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Categories */}
        <Text className="text-base font-bold text-slate-900 dark:text-white mb-3 mt-2">Categoría</Text>
        <View className="flex-row flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              onPress={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full border ${category === cat ? 'bg-blue-600 border-blue-600' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}
            >
              <Text className={`${category === cat ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}
