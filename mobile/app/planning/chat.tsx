
import { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useFinancial } from '../../context/financial-context';
import { generateCoachResponse } from '../../services/gemini';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: string;
}

export default function ChatScreen() {
    const { user, transactions, isLoading: isDataLoading } = useFinancial();
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            text: `👋 ¡Hola ${user.name.split(' ')[0]}! Soy tu Coach Financiero. ¿En qué trabajamos hoy?`,
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Prepare context
        const context = {
            userName: user.name,
            totalIncome: user.monthlyIncome,
            recentTransactions: transactions.slice(0, 5)
        };

        const responseText = await generateCoachResponse(userMsg.text, context);

        const aiMsg: Message = {
            id: (Date.now() + 1).toString(),
            text: responseText,
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);
    };

    useEffect(() => {
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }, [messages]);

    const renderMessage = ({ item }: { item: Message }) => {
        const isUser = item.sender === 'user';
        return (
            <View className={`mb-4 flex-row ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                    <View className="w-8 h-8 rounded-full bg-indigo-100 justify-center items-center mr-2">
                        <FontAwesome name="android" size={16} color="#4f46e5" />
                    </View>
                )}

                <View
                    style={{ maxWidth: '80%' }}
                    className={`p-4 rounded-2xl shadow-sm ${isUser
                            ? 'bg-blue-600 rounded-tr-none'
                            : 'bg-white dark:bg-slate-700 rounded-tl-none border border-slate-100 dark:border-slate-600'
                        }`}
                >
                    <Text className={`text-base leading-5 ${isUser
                            ? 'text-white font-medium'
                            : 'text-slate-800 dark:text-gray-100'
                        }`}>
                        {item.text}
                    </Text>
                    <Text className={`text-[10px] mt-1 text-right ${isUser
                            ? 'text-blue-100'
                            : 'text-slate-400 dark:text-slate-300'
                        }`}>
                        {item.timestamp}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-950">
            <Stack.Screen options={{ title: 'Coach IA', headerBackTitle: 'Atrás' }} />

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={item => item.id}
                renderItem={renderMessage}
                contentContainerStyle={{ padding: 16 }}
                className="flex-1"
                ListFooterComponent={
                    isTyping ? (
                        <View className="flex-row items-center ml-10 mb-4">
                            <ActivityIndicator size="small" color="#4f46e5" />
                            <Text className="text-xs text-slate-500 ml-2">Escribiendo...</Text>
                        </View>
                    ) : null
                }
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={100}
                className="p-4 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800"
            >
                <View className="flex-row items-center gap-2">
                    <TextInput
                        className="flex-1 bg-gray-100 dark:bg-slate-800 p-3 rounded-full text-slate-900 dark:text-white"
                        placeholder="Escribe tu mensaje..."
                        placeholderTextColor="#94a3b8"
                        value={input}
                        onChangeText={setInput}
                        onSubmitEditing={handleSend}
                    />
                    <TouchableOpacity
                        onPress={handleSend}
                        disabled={!input.trim() || isTyping}
                        className={`w-12 h-12 rounded-full justify-center items-center ${!input.trim() ? 'bg-gray-300 dark:bg-slate-700' : 'bg-indigo-600'}`}
                    >
                        <FontAwesome name="send" size={18} color="white" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
