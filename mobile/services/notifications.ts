
import { notificationSystemPrompts } from "@/lib/data/education-templates";
import { formatCurrency } from "@/lib/utils";

export type NotificationType = 'budget_alert' | 'savings_tip' | 'achievement' | 'reminder' | 'insight';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    date: Date;
    read: boolean;
    actionUrl?: string;
}

export const NotificationService = {

    // Generar alerta de presupuesto
    checkBudgetThreshold: (category: string, current: number, limit: number): Notification | null => {
        const percentage = (current / limit) * 100;

        if (percentage >= 80) {
            const remaining = limit - current;
            const template = notificationSystemPrompts.budgetAlert.template
                .replace('[X]', percentage.toFixed(0))
                .replace('[categoría]', category)
                .replace('[Y]', formatCurrency(remaining));

            return {
                id: Date.now().toString(),
                type: 'budget_alert',
                title: '⚠️ Alerta de Presupuesto',
                message: template,
                date: new Date(),
                read: false,
                actionUrl: '/(tabs)/index' // Changed from /dashboard/budget for mobile
            };
        }
        return null;
    },

    // Generar celebración de logro
    checkSavingsGoal: (goalName: string, current: number, target: number): Notification | null => {
        if (current >= target) {
            const template = notificationSystemPrompts.achievementCelebration.template
                .replace('[X]', '3'); // Mock calculation

            return {
                id: Date.now().toString(),
                type: 'achievement',
                title: '🎉 ¡Meta Alcanzada!',
                message: template,
                date: new Date(),
                read: false,
                actionUrl: '/(tabs)/planning' // Changed from /dashboard/goals
            };
        }
        return null;
    },

    // Generar recordatorio
    checkInactivity: (daysInactive: number): Notification | null => {
        if (daysInactive >= 3) {
            const template = notificationSystemPrompts.friendlyReminder.template
                .replace('[X]', daysInactive.toString());

            return {
                id: Date.now().toString(),
                type: 'reminder',
                title: '📅 Te extrañamos',
                message: template,
                date: new Date(),
                read: false,
                actionUrl: '/(tabs)/index'
            };
        }
        return null;
    }
};
