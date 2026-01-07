
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { emergencyFundEducation, investmentEducation, debtEliminationEducation } from '../../lib/data/education-templates';
import { SafeAreaView } from 'react-native-safe-area-context';

const CONTENT_MAP: Record<string, string> = {
    'emergency-fund': emergencyFundEducation,
    'investments': investmentEducation,
    'debt': debtEliminationEducation,
};

const TITLES: Record<string, string> = {
    'emergency-fund': 'Fondo de Emergencia',
    'investments': 'Inversiones',
    'debt': 'Eliminar Deudas',
};

export default function ModuleDetailScreen() {
    const { id } = useLocalSearchParams();
    const content = CONTENT_MAP[id as string] || "Contenido no encontrado.";
    const title = TITLES[id as string] || "Lección";

    // Simple markdown-ish rendering for MVP
    const renderContent = (text: string) => {
        return text.split('\n').map((line, index) => {
            if (line.startsWith('# ')) {
                return <Text key={index} className="text-2xl font-bold text-slate-900 dark:text-white mb-4 mt-2">{line.replace('# ', '')}</Text>;
            }
            if (line.startsWith('## ')) {
                return <Text key={index} className="text-xl font-bold text-blue-600 mb-2 mt-4">{line.replace('## ', '')}</Text>;
            }
            if (line.startsWith('### ')) {
                return <Text key={index} className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2 mt-2">{line.replace('### ', '')}</Text>;
            }
            if (line.startsWith('- ')) {
                return (
                    <View key={index} className="flex-row gap-2 mb-1 pl-2">
                        <Text className="text-blue-500">•</Text>
                        <Text className="text-slate-600 dark:text-slate-300 flex-1 leading-6">{line.replace('- ', '')}</Text>
                    </View>
                );
            }
            if (line.trim() === '') return <View key={index} className="h-2" />;

            return <Text key={index} className="text-slate-600 dark:text-slate-300 mb-2 leading-6">{line}</Text>;
        });
    };

    return (
        <View className="flex-1 bg-gray-50 dark:bg-slate-950">
            <Stack.Screen options={{ title: title, headerBackTitle: 'Atrás' }} />
            <ScrollView className="flex-1 p-4">
                <View className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm mb-8">
                    {renderContent(content)}
                </View>
            </ScrollView>
        </View>
    );
}
