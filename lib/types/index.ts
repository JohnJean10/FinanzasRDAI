export interface Transaction {
    id: number;
    type: 'income' | 'expense';
    description: string;
    amount: number;
    category: string;
    date: string;
    account: string;
}

export interface BudgetConfig {
    category: string;
    limit: number;
}

export interface Goal {
    id: number;
    name: string;
    target: number;
    current: number;
    deadline: string;
    icon: string;
}

export interface Debt {
    id: number; // Added ID for better management
    name: string;
    balance: number;
    rate: number;
    minPayment: number;
}

export interface UserProfile {
    name: string;
    monthlyIncome: number;
    profile: 'Basico' | 'Premium';
}

export interface AppData {
    user: UserProfile;
    transactions: Transaction[];
    budgetConfigs: BudgetConfig[];
    goals: Goal[];
    debts: Debt[];
}
