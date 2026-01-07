
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFinancial } from '../../context/financial-context';
import { formatCurrency, calculatePeriodStats } from '../../lib/utils';
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function DashboardScreen() {
  const { transactions, user, isLoading } = useFinancial();

  // Calculate Global Balance
  const totalBalance = transactions.reduce((acc, t) => {
    return t.type === 'income' ? acc + t.amount : acc - t.amount;
  }, 0);

  // Calculate Monthly Stats
  const now = new Date();
  const stats = calculatePeriodStats(transactions, now.getFullYear(), now.getMonth());

  // Recent Transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-slate-950">
        <Text className="text-lg text-slate-500">Cargando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-950">
      <ScrollView className="flex-1 px-4 pt-4">
        {/* Header */}
        <View className="mb-6 flex-row justify-between items-center">
          <Link href="/profile-modal" asChild>
            <TouchableOpacity className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full justify-center items-center">
                <FontAwesome name="user" size={16} color="#2563eb" />
              </View>
              <View>
                <Text className="text-lg text-slate-500 dark:text-slate-400">Hola,</Text>
                <Text className="text-xl font-bold text-slate-900 dark:text-white capitalize">{user.name}</Text>
              </View>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity className="bg-slate-200 dark:bg-slate-800 p-2 rounded-full">
            <FontAwesome name="bell" size={20} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Main Balance Card */}
        <View className="bg-blue-600 rounded-2xl p-6 shadow-lg mb-6">
          <Text className="text-blue-100 text-sm font-medium mb-1">Balance Total</Text>
          <Text className="text-white text-3xl font-bold">{formatCurrency(totalBalance)}</Text>
          <View className="flex-row mt-4 justify-between">
            <View>
              <Text className="text-blue-200 text-xs">Ingresos</Text>
              <Text className="text-white font-semibold">+{formatCurrency(stats.income)}</Text>
            </View>
            <View>
              <Text className="text-blue-200 text-xs">Gastos</Text>
              <Text className="text-white font-semibold">-{formatCurrency(stats.expenses)}</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="flex-row justify-between mb-8">
          <Link href="/modal?type=income" asChild>
            <TouchableOpacity className="items-center gap-2">
              <View className="w-14 h-14 rounded-2xl justify-center items-center bg-emerald-100">
                <FontAwesome name="plus" size={20} color="#059669" />
              </View>
              <Text className="text-xs font-medium text-slate-600 dark:text-slate-300">Ingreso</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/modal?type=expense" asChild>
            <TouchableOpacity className="items-center gap-2">
              <View className="w-14 h-14 rounded-2xl justify-center items-center bg-rose-100">
                <FontAwesome name="minus" size={20} color="#e11d48" />
              </View>
              <Text className="text-xs font-medium text-slate-600 dark:text-slate-300">Gasto</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/modal?type=expense" asChild>
            <TouchableOpacity className="items-center gap-2">
              <View className="w-14 h-14 rounded-2xl justify-center items-center bg-blue-100">
                <FontAwesome name="exchange" size={20} color="#2563eb" />
              </View>
              <Text className="text-xs font-medium text-slate-600 dark:text-slate-300">Transfer</Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity className="items-center gap-2">
            <View className="w-14 h-14 rounded-2xl justify-center items-center bg-slate-100 dark:bg-slate-800">
              <FontAwesome name="ellipsis-h" size={20} color="#475569" />
            </View>
            <Text className="text-xs font-medium text-slate-600 dark:text-slate-300">Más</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View>
          <View className="flex-row justify-between items-end mb-4">
            <Text className="text-lg font-bold text-slate-900 dark:text-white">Recientes</Text>
            <Link href="/(tabs)/transactions" asChild>
              <Text className="text-blue-600 text-sm font-medium">Ver todo</Text>
            </Link>
          </View>

          {recentTransactions.length === 0 ? (
            <View className="bg-white dark:bg-slate-900 p-8 rounded-xl items-center">
              <Text className="text-slate-400">No hay transacciones aún</Text>
            </View>
          ) : (
            recentTransactions.map(t => (
              <View key={t.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl mb-3 flex-row justify-between items-center shadow-sm">
                <View className="flex-row items-center gap-3">
                  <View className={`w-10 h-10 rounded-full justify-center items-center ${t.type === 'income' ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                    <FontAwesome name={t.type === 'income' ? 'arrow-up' : 'arrow-down'} size={14} color={t.type === 'income' ? '#10b981' : '#f43f5e'} />
                  </View>
                  <View>
                    <Text className="font-semibold text-slate-800 dark:text-white">{t.category}</Text>
                    <Text className="text-xs text-slate-500">{new Date(t.date).toLocaleDateString()}</Text>
                  </View>
                </View>
                <Text className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Bottom Spacer */}
        <View className="h-20" />
      </ScrollView>

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

const COLORS: any = {
  'text-emerald-600': '#059669',
  'text-rose-600': '#e11d48',
  'text-blue-600': '#2563eb',
  'text-slate-600': '#475569',
};

function ActionParams({ icon, label, color, iconColor }: any) {
  return (
    <View className="items-center gap-2">
      <TouchableOpacity className={`w-14 h-14 rounded-2xl justify-center items-center ${color}`}>
        <FontAwesome name={icon} size={20} color={COLORS[iconColor] || '#475569'} />
      </TouchableOpacity>
      <Text className="text-xs font-medium text-slate-600 dark:text-slate-300">{label}</Text>
    </View>
  )
}
