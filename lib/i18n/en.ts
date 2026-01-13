import { Translations } from "./es";

// English translations
export const en: Translations = {
    // Common
    common: {
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        edit: "Edit",
        add: "Add",
        search: "Search",
        loading: "Loading...",
        noData: "No data",
        viewAll: "View all",
        close: "Close",
        confirm: "Confirm",
        back: "Back",
        next: "Next",
        submit: "Submit",
        clear: "Clear",
        filter: "Filter",
        sort: "Sort",
        all: "All",
        others: "Others",
        more: "More",
        less: "Less",
    },

    // Navigation
    nav: {
        dashboard: "Dashboard",
        accounts: "Accounts",
        transactions: "Transactions",
        budgets: "Budgets",
        goals: "Goals & Savings",
        investments: "Investments",
        debts: "Debts",
        coach: "AI Coach",
        reports: "Reports",
        settings: "Settings",
    },

    // Dashboard
    dashboard: {
        greeting: "Hi",
        totalBalance: "total balance",
        transfer: "Transfer",
        add: "Add",
        totalEarning: "Total Earning",
        totalSpending: "Total Spending",
        totalIncome: "Total Income",
        totalRevenue: "Total Revenue",
        thisMonth: "This month",
        lastMonth: "Last month",
        subscriptions: "Subscriptions",
        daysLeft: "days left",
        balance: "Balance",
        netWorth: "Net Worth",
        totalCashSpent: "Total Cash Spent",
        increasedBy: "Increased By",
        cashflow: "Cashflow",
        income: "Income",
        expense: "Expense",
        recentTransactions: "Recent Transactions",
        completed: "Completed",
        pending: "Pending",
    },

    // AI Assistant
    ai: {
        title: "AI Assistant",
        whatCanIHelp: "What Can I help with?",
        askAnything: "Ask anything...",
        showCashflow: "Show me my cash flow",
        planBudget: "Plan my monthly budget",
        detectUnusual: "Detect unusual transactions",
        revealBalance: "Reveal my balance",
        chooseModel: "Choose Model",
    },

    // Accounts
    accounts: {
        title: "Accounts",
        addAccount: "Add Account",
        accountName: "Account name",
        accountType: "Account type",
        balance: "Balance",
        currency: "Currency",
        bank: "Bank",
        cash: "Cash",
        credit: "Credit Card",
        investment: "Investment",
        savings: "Savings",
        default: "Primary",
        setAsDefault: "Set as primary",
    },

    // Transactions
    transactions: {
        title: "Transactions",
        addTransaction: "Add Transaction",
        description: "Description",
        amount: "Amount",
        date: "Date",
        category: "Category",
        type: "Type",
        income: "Income",
        expense: "Expense",
        transfer: "Transfer",
        saving: "Saving",
        account: "Account",
        recurring: "Recurring",
        frequency: "Frequency",
        daily: "Daily",
        weekly: "Weekly",
        biweekly: "Biweekly",
        monthly: "Monthly",
        yearly: "Yearly",
    },

    // Budgets
    budgets: {
        title: "Budgets",
        addBudget: "Add Budget",
        budgetName: "Name",
        limit: "Limit",
        spent: "Spent",
        remaining: "Remaining",
        alerts: "Alerts",
        percentUsed: "% used",
    },

    // Goals
    goals: {
        title: "Savings Goals",
        addGoal: "New Goal",
        goalName: "Goal name",
        targetAmount: "Target amount",
        currentAmount: "Current amount",
        deadline: "Deadline",
        monthlyContribution: "Monthly contribution",
        progress: "Progress",
        emergencyFund: "Emergency Fund",
    },

    // Debts
    debts: {
        title: "Debts",
        addDebt: "Add Debt",
        debtName: "Name",
        originalAmount: "Original amount",
        currentBalance: "Current balance",
        interestRate: "Interest rate",
        minPayment: "Minimum payment",
        dueDate: "Due date",
        creditCard: "Credit Card",
        loan: "Loan",
        mortgage: "Mortgage",
        other: "Other",
        makePayment: "Make Payment",
    },

    // Settings
    settings: {
        title: "Settings",
        profile: "Profile",
        name: "Name",
        language: "Language",
        currency: "Currency",
        theme: "Theme",
        darkMode: "Dark Mode",
        lightMode: "Light Mode",
        notifications: "Notifications",
        budgetAlerts: "Budget alerts",
        goalAchievements: "Goal achievements",
        debtReminders: "Debt reminders",
        exportData: "Export Data",
        resetData: "Reset Data",
        about: "About",
    },

    // Onboarding
    onboarding: {
        welcome: "Hello there!",
        welcomeSubtitle: "I'm your new financial advisor. I'm not a bank, so I won't sell you cards. I'm here to talk honestly about your money.",
        whatsYourName: "What's your name?",
        namePlaceholder: "Your name here...",
        currency: "Currency",
        letsGo: "Let's go!",
        howMuchIncome: "How much do you earn monthly?",
        monthlyIncome: "Monthly income",
        fixedExpenses: "Fixed monthly expenses",
        finish: "Activate!",
    },

    // Time ranges
    timeRange: {
        thisMonth: "This Month",
        lastMonth: "Last Month",
        last3Months: "Last 3 Months",
        last6Months: "Last 6 Months",
        thisYear: "This Year",
        allTime: "All Time",
    },

    // Errors & Messages
    messages: {
        budgetWarning: "Warning! You're overspending on {category}",
        budgetCritical: "Alert! You've exceeded the {category} budget",
        goalAchieved: "Congratulations! You reached your goal: {goal}",
        transactionAdded: "Transaction added successfully",
        dataReset: "Data reset",
        errorOccurred: "An error occurred",
    },
};
