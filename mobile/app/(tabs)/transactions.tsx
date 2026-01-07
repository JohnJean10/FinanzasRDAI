
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFinancial } from '../../context/financial-context';
import { formatCurrency } from '../../lib/utils';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';

export default function TransactionsScreen() {
    const { transactions, isLoading } = useFinancial();

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-slate-950">
                <Text className="text-lg text-slate-500">Cargando...</Text>
            </View>
        );
    }

    // Sort by date descending
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-950">
            <View className="p-4 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
                <Text className="text-xl font-bold text-slate-900 dark:text-white">Transacciones</Text>
            </View>

            {sortedTransactions.length === 0 ? (
                <View className="flex-1 justify-center items-center p-8">
                    <Text className="text-slate-400 text-center mb-4">No hay transacciones registradas.</Text>
                    <Link href="/modal" asChild>
                        <TouchableOpacity className="bg-blue-600 px-6 py-3 rounded-full">
                            <Text className="text-white font-bold">Agregar Nueva</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            ) : (
                <FlatList
                    data={sortedTransactions}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                    renderItem={({ item: t }) => (
                        <View className="bg-white dark:bg-slate-900 p-4 rounded-xl mb-3 flex-row justify-between items-center shadow-sm">
                            <View className="flex-row items-center gap-3">
                                <View className={`w-10 h-10 rounded-full justify-center items-center ${t.type === 'income' ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                                    <FontAwesome name={t.type === 'income' ? 'arrow-up' : 'arrow-down'} size={14} color={t.type === 'income' ? '#10b981' : '#f43f5e'} />
                                </View>
                                <View>
                                    <View className="flex-row items-center gap-2">
                                        <Text className="font-semibold text-slate-800 dark:text-white">{t.category}</Text>
                                        <Text className="text-xs text-slate-400">({t.description})</Text>
                                    </View>
                                    <Text className="text-xs text-slate-500">{new Date(t.date).toLocaleDateString()}</Text>
                                </View>
                            </View>
                            <Text className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                            </Text>
                        </View>
                    )}
                />
            )}

            {/* FAB */}
            <Link href="/modal" asChild>
                <TouchableOpacity
                    className="absolute bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full justify-center items-center shadow-xl z-50 elevation-5"
                >
                    <FontAwesome name="plus" size={24} color="white" />
                </TouchableOpacity>
            </Link>
        </SafeAreaView>
    );
}
