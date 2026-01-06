
import { Debt } from './index';

// Tipos base
type Currency = 'DOP' | 'USD';
type IncomeSource = 'empleado' | 'freelance' | 'negocio_propio' | 'remesas' | 'inversiones';
type RiskTolerance = 'conservador' | 'moderado' | 'agresivo';

// Usuario completo
interface UserProfile {
    // Identificación
    id: string;
    name: string;
    email?: string;
    birthDate?: Date;
    avatar?: string;
    occupation?: string;

    // Configuración
    preferredCurrency: Currency;
    dateFormat: 'DD/MM/AAAA' | 'MM/DD/AAAA';
    language: 'es' | 'en';
    theme: 'light' | 'dark' | 'system';

    // Preferencias de notificaciones
    notifications: {
        budgetAlertsEnabled: boolean;
        debtRemindersEnabled: boolean;
        goalAchievementsEnabled: boolean;
        weeklyReportsEnabled: boolean;
        streakRemindersEnabled: boolean;
    };

    // Seguridad
    security: {
        pinEnabled: boolean;
        biometricEnabled: boolean;
    };
}

// Datos financieros
interface FinancialData {
    // Ingresos
    monthlyIncome: number;
    incomeSources: Array<{
        type: IncomeSource;
        amount: number;
        frequency: 'semanal' | 'quincenal' | 'mensual' | 'irregular';
        isRemittance: boolean;
    }>;

    // Gastos
    fixedExpenses: number;
    variableExpenses: number;
    expenseCategories: Record<string, number>;

    // Deudas
    totalDebt: number;
    debts: Debt[];

    // Activos
    savings: number;
    investments: number;
    otherAssets: number;

    // Fondo de emergencia
    emergencyFund: {
        currentAmount: number;
        targetMonths: number; // típicamente 3-6
        targetAmount: number;
        monthsCovered: number;
    };

    // Indicadores de salud financiera
    healthIndicators: {
        savingsRate: number; // porcentaje
        debtToIncomeRatio: number;
        emergencyFundMonths: number;
        financialHealthScore: number; // 0-100
    };
}

// Metas
interface FinancialGoal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: Date;
    priority: 'alta' | 'media' | 'baja';
    category: 'fondo_emergencia' | 'vacaciones' | 'vehiculo' | 'vivienda' | 'educacion' | 'inversion' | 'otro';
    isCompleted: boolean;
    completedAt?: Date;
    createdAt: Date;
}

// Comportamiento en la app
interface AppBehavior {
    userSince: Date;
    lastActive: Date;
    currentStreak: number;
    longestStreak: number;
    averageSessionsPerWeek: number;
    favoriteFeatures: string[];
    educationModulesCompleted: string[];
    totalTransactionsLogged: number;
}

// Configuración completa del usuario
interface UserConfig {
    profile: UserProfile;
    financial: FinancialData;
    goals: FinancialGoal[];
    behavior: AppBehavior;

    // Metadata
    onboardingCompleted: boolean;
    lastDataUpdate: Date;
    configVersion: string;
    dataMigrationVersion?: string;
}

// Funciones helper
interface UserHelpers {
    getTotalIncome(): number;
    getTotalFixedExpenses(): number;
    getTotalDebt(): number;
    getGreenNumber(): number;
    getEmergencyFundProgress(): number;
    getFinancialHealthScore(): number;
    getMonthlySavingsCapacity(): number;
    getDebtFreeDate(method: 'snowball' | 'avalanche', extraPayment: number): Date;
    getMonthsToGoal(goalId: string, additionalMonthlyContribution: number): number;
}

export type {
    UserProfile,
    FinancialData,
    FinancialGoal,
    AppBehavior,
    UserConfig,
    UserHelpers,
    Currency,
    IncomeSource,
    RiskTolerance
};
