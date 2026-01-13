// Spanish translations (DEFAULT)
export const es = {
    // Common
    common: {
        save: "Guardar",
        cancel: "Cancelar",
        delete: "Eliminar",
        edit: "Editar",
        add: "Agregar",
        search: "Buscar",
        loading: "Cargando...",
        noData: "Sin datos",
        viewAll: "Ver todo",
        close: "Cerrar",
        confirm: "Confirmar",
        back: "Volver",
        next: "Siguiente",
        submit: "Enviar",
        clear: "Limpiar",
        filter: "Filtrar",
        sort: "Ordenar",
        all: "Todos",
        others: "Otros",
        more: "Más",
        less: "Menos",
    },

    // Navigation
    nav: {
        dashboard: "Dashboard",
        accounts: "Cuentas",
        transactions: "Transacciones",
        budgets: "Presupuestos",
        goals: "Metas y Ahorros",
        investments: "Inversiones",
        debts: "Deudas",
        coach: "Coach IA",
        reports: "Reportes",
        settings: "Configuración",
    },

    // Dashboard
    dashboard: {
        greeting: "Hola",
        totalBalance: "balance total",
        transfer: "Transferir",
        add: "Agregar",
        totalEarning: "Ingresos Totales",
        totalSpending: "Gastos Totales",
        totalIncome: "Ingreso Total",
        totalRevenue: "Ganancia Total",
        thisMonth: "Este mes",
        lastMonth: "Mes pasado",
        subscriptions: "Suscripciones",
        daysLeft: "días restantes",
        balance: "Balance",
        netWorth: "Patrimonio Neto",
        totalCashSpent: "Total Gastado",
        increasedBy: "Aumentó",
        cashflow: "Flujo de Caja",
        income: "Ingresos",
        expense: "Gastos",
        recentTransactions: "Transacciones Recientes",
        completed: "Completado",
        pending: "Pendiente",
    },

    // AI Assistant
    ai: {
        title: "Asistente IA",
        whatCanIHelp: "¿En qué puedo ayudarte?",
        askAnything: "Pregunta lo que quieras...",
        showCashflow: "Mostrar flujo de caja",
        planBudget: "Planificar presupuesto",
        detectUnusual: "Detectar gastos inusuales",
        revealBalance: "Revelar mi balance",
        chooseModel: "Elegir Modelo",
    },

    // Accounts
    accounts: {
        title: "Cuentas",
        addAccount: "Agregar Cuenta",
        accountName: "Nombre de la cuenta",
        accountType: "Tipo de cuenta",
        balance: "Balance",
        currency: "Moneda",
        bank: "Banco",
        cash: "Efectivo",
        credit: "Tarjeta de Crédito",
        investment: "Inversión",
        savings: "Ahorro",
        default: "Principal",
        setAsDefault: "Establecer como principal",
    },

    // Transactions
    transactions: {
        title: "Transacciones",
        addTransaction: "Agregar Transacción",
        description: "Descripción",
        amount: "Monto",
        date: "Fecha",
        category: "Categoría",
        type: "Tipo",
        income: "Ingreso",
        expense: "Gasto",
        transfer: "Transferencia",
        saving: "Ahorro",
        account: "Cuenta",
        recurring: "Recurrente",
        frequency: "Frecuencia",
        daily: "Diario",
        weekly: "Semanal",
        biweekly: "Quincenal",
        monthly: "Mensual",
        yearly: "Anual",
    },

    // Budgets
    budgets: {
        title: "Presupuestos",
        addBudget: "Agregar Presupuesto",
        budgetName: "Nombre",
        limit: "Límite",
        spent: "Gastado",
        remaining: "Disponible",
        alerts: "Alertas",
        percentUsed: "% usado",
    },

    // Goals
    goals: {
        title: "Metas de Ahorro",
        addGoal: "Nueva Meta",
        goalName: "Nombre de la meta",
        targetAmount: "Monto objetivo",
        currentAmount: "Monto actual",
        deadline: "Fecha límite",
        monthlyContribution: "Aporte mensual",
        progress: "Progreso",
        emergencyFund: "Fondo de Emergencia",
    },

    // Debts
    debts: {
        title: "Deudas",
        addDebt: "Agregar Deuda",
        debtName: "Nombre",
        originalAmount: "Monto original",
        currentBalance: "Balance actual",
        interestRate: "Tasa de interés",
        minPayment: "Pago mínimo",
        dueDate: "Fecha de vencimiento",
        creditCard: "Tarjeta de Crédito",
        loan: "Préstamo",
        mortgage: "Hipoteca",
        other: "Otro",
        makePayment: "Realizar Pago",
    },

    // Settings
    settings: {
        title: "Configuración",
        profile: "Perfil",
        name: "Nombre",
        language: "Idioma",
        currency: "Moneda",
        theme: "Tema",
        darkMode: "Modo Oscuro",
        lightMode: "Modo Claro",
        notifications: "Notificaciones",
        budgetAlerts: "Alertas de presupuesto",
        goalAchievements: "Logros de metas",
        debtReminders: "Recordatorios de deudas",
        exportData: "Exportar Datos",
        resetData: "Reiniciar Datos",
        about: "Acerca de",
    },

    // Onboarding
    onboarding: {
        welcome: "¡Dímelo líder!",
        welcomeSubtitle: "Soy tu nuevo asesor financiero. No soy un banco, así que no te voy a vender tarjetas. Vine a que hablemos claro de tus cuartos.",
        whatsYourName: "¿Cómo te llamas?",
        namePlaceholder: "Tu nombre aquí...",
        currency: "Moneda",
        letsGo: "Vamos al mambo",
        howMuchIncome: "¿Cuánto ganas al mes?",
        monthlyIncome: "Ingreso mensual",
        fixedExpenses: "Gastos fijos mensuales",
        finish: "¡Dale, actívalo!",
    },

    // Time ranges
    timeRange: {
        thisMonth: "Este Mes",
        lastMonth: "Mes Pasado",
        last3Months: "Últimos 3 Meses",
        last6Months: "Últimos 6 Meses",
        thisYear: "Este Año",
        allTime: "Todo el Tiempo",
    },

    // Errors & Messages
    messages: {
        budgetWarning: "¡Cuidado! Estás gastando demasiado en {category}",
        budgetCritical: "¡Alerta! Has superado el presupuesto de {category}",
        goalAchieved: "¡Felicidades! Alcanzaste tu meta: {goal}",
        transactionAdded: "Transacción agregada exitosamente",
        dataReset: "Datos reiniciados",
        errorOccurred: "Ocurrió un error",
    },
};

export type Translations = typeof es;
