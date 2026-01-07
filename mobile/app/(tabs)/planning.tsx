
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';

const EDUCATION_MODULES = [
    {
        id: 'emergency-fund',
        title: 'Fondo de Emergencia',
        icon: 'shield',
        color: 'bg-emerald-100',
        iconColor: '#059669',
        description: 'Tu red de seguridad financiera.'
    },
    {
        id: 'investments',
        title: 'Inversiones en RD',
        icon: 'line-chart',
        color: 'bg-blue-100',
        iconColor: '#2563eb',
        description: 'Haz que tu dinero crezca.'
    },
    {
        id: 'debt',
        title: 'Eliminar Deudas',
        icon: 'chain-broken', // or similar if available, verify icon
        color: 'bg-rose-100',
        iconColor: '#e11d48',
        description: 'Recupera tu libertad.'
    }
];

export default function PlanningScreen() {
    return (
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-950">
            <View className="p-4 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 mb-4">
                <Text className="text-xl font-bold text-slate-900 dark:text-white">Educación Financiera</Text>
                <Text className="text-slate-500 text-sm">Aprende y crece con FinanzasRD AI</Text>
            </View>

            <ScrollView className="flex-1 px-4">
                {/* AI Coach Banner */}
                <Link href="/planning/chat" asChild>
                    <TouchableOpacity className="bg-indigo-600 p-6 rounded-2xl mb-6 shadow-md">
                        <View className="flex-row justify-between items-center">
                            <View className="flex-1">
                                <Text className="text-white font-bold text-lg mb-1">Tu Coach IA</Text>
                                <Text className="text-indigo-100 text-sm">Pregúntame sobre tus finanzas o pide consejos personalizados.</Text>
                            </View>
                            <View className="bg-white/20 p-3 rounded-full">
                                <FontAwesome name="comments" size={24} color="white" />
                            </View>
                        </View>
                    </TouchableOpacity>
                </Link>

                {/* Modules Grid */}
                <Text className="text-lg font-bold text-slate-800 dark:text-white mb-4">Módulos</Text>
                <View className="gap-4">
                    {EDUCATION_MODULES.map((module) => (
                        <Link key={module.id} href={`/planning/${module.id}`} asChild>
                            <TouchableOpacity
                                className="bg-white dark:bg-slate-900 p-4 rounded-xl flex-row items-center gap-4 shadow-sm"
                            >
                                <View className={`w-12 h-12 rounded-full justify-center items-center ${module.color}`}>
                                    <FontAwesome name={module.icon as any} size={20} color={module.iconColor} />
                                </View>
                                <View className="flex-1">
                                    <Text className="font-bold text-slate-900 dark:text-white text-base">{module.title}</Text>
                                    <Text className="text-slate-500 text-xs">{module.description}</Text>
                                </View>
                                <FontAwesome name="chevron-right" size={12} color="#94a3b8" />
                            </TouchableOpacity>
                        </Link>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
