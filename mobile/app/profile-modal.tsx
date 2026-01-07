
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useFinancial } from '../context/financial-context';
import { FontAwesome } from '@expo/vector-icons';

export default function ProfileModal() {
    const { user, updateUser } = useFinancial();
    const router = useRouter();

    const [name, setName] = useState(user.name);
    const [income, setIncome] = useState(user.monthlyIncome.toString());

    const handleSave = () => {
        const cleanIncome = parseFloat(income.replace(/[^0-9.]/g, '')) || 0;

        updateUser({
            name: name,
            monthlyIncome: cleanIncome
        });

        router.back();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white dark:bg-slate-900"
        >
            <View className="p-4 border-b border-gray-100 dark:border-slate-800 flex-row justify-between items-center">
                <TouchableOpacity onPress={() => router.back()}>
                    <Text className="text-blue-600 text-lg">Cancelar</Text>
                </TouchableOpacity>
                <Text className="text-lg font-bold text-slate-900 dark:text-white">Perfil</Text>
                <TouchableOpacity onPress={handleSave}>
                    <Text className="text-blue-600 font-bold text-lg">Guardar</Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="p-6">
                <View className="items-center mb-8">
                    <View className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full justify-center items-center mb-4">
                        <FontAwesome name="user" size={40} color="#2563eb" />
                    </View>
                    <Text className="text-slate-500 dark:text-slate-400">Toca para cambiar foto (Pronto)</Text>
                </View>

                <View className="space-y-6">
                    <View>
                        <Text className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nombre Completo</Text>
                        <TextInput
                            className="bg-white p-4 rounded-xl text-slate-900 border border-slate-200"
                            value={name}
                            onChangeText={setName}
                            placeholder="Ej: Juan Pérez"
                            placeholderTextColor="#94a3b8"
                        />
                    </View>

                    <View>
                        <Text className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Ingreso Mensual (RD$)</Text>
                        <TextInput
                            className="bg-white p-4 rounded-xl text-slate-900 border border-slate-200"
                            value={income}
                            onChangeText={setIncome}
                            placeholder="Ej: 50000"
                            placeholderTextColor="#94a3b8"
                            keyboardType="numeric"
                        />
                        <Text className="text-xs text-slate-500 mt-2">
                            Este valor se usa para calcular tu presupuesto y metas de ahorro.
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleSave}
                    className="bg-blue-600 p-4 rounded-xl mt-8 shadow-lg shadow-blue-500/30"
                >
                    <Text className="text-center text-white font-bold text-lg">Actualizar Perfil</Text>
                </TouchableOpacity>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}
