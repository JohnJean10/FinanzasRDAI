/**
 * ============================================
 * APLICACIÓN PRINCIPAL - FinanzasRD AI
 * Asistente Financiero con IA para República Dominicana
 * ============================================
 */

// ============================================
// CONFIGURACIÓN Y DATOS INICIALES
// ============================================

// Categorías con iconos para el sistema
const CATEGORIES = {
    'alimentacion_supermercado': { name: 'Supermercado', icon: 'fa-shopping-cart', color: '#FF9800' },
    'alimentacion_restaurantes': { name: 'Restaurantes', icon: 'fa-utensils', color: '#FF9800' },
    'alimentacion_comida_rapida': { name: 'Comida Rápida', icon: 'fa-hamburger', color: '#FF9800' },
    'transporte_gasolina': { name: 'Gasolina', icon: 'fa-gas-pump', color: '#2196F3' },
    'transporte_publico': { name: 'Transporte Público', icon: 'fa-bus', color: '#2196F3' },
    'transporte_uber': { name: 'Uber/Metro', icon: 'fa-car', color: '#2196F3' },
    'vivienda_alquiler': { name: 'Alquiler', icon: 'fa-home', color: '#4CAF50' },
    'vivienda_servicios': { name: 'Servicios del Hogar', icon: 'fa-lightbulb', color: '#4CAF50' },
    'servicios_telefono': { name: 'Teléfono/Internet', icon: 'fa-mobile-alt', color: '#9C27B0' },
    'servicios_suscripciones': { name: 'Suscripciones', icon: 'fa-credit-card', color: '#9C27B0' },
    'salud_farmacia': { name: 'Farmacia', icon: 'fa-pills', color: '#F44336' },
    'salud_medico': { name: 'Médico', icon: 'fa-user-md', color: '#F44336' },
    'entretenimiento_cine': { name: 'Cine/Eventos', icon: 'fa-film', color: '#FFC107' },
    'entretenimiento_streaming': { name: 'Streaming', icon: 'fa-play', color: '#FFC107' },
    'shopping_ropa': { name: 'Ropa', icon: 'fa-tshirt', color: '#E91E63' },
    'shopping_electronica': { name: 'Electrónica', icon: 'fa-laptop', color: '#E91E63' },
    'educacion_cursos': { name: 'Educación', icon: 'fa-book', color: '#00BCD4' },
    'familia_remesas': { name: 'Remesas', icon: 'fa-hand-holding-usd', color: '#003366' },
    'ingreso_sueldo': { name: 'Sueldo', icon: 'fa-money-bill-wave', color: '#00A86B' },
    'ingreso_freelance': { name: 'Freelance', icon: 'fa-laptop-house', color: '#00A86B' },
    'ingreso_remesas': { name: 'Remesas Recibidas', icon: 'fa-gift', color: '#00A86B' },
    'otros_impuestos': { name: 'Impuestos', icon: 'fa-file-invoice-dollar', color: '#607D8B' },
    'otros_otros': { name: 'Otros', icon: 'fa-ellipsis-h', color: '#607D8B' }
};

// Patrones para predicción automática de categorías (Simulación IA)
const CATEGORY_PATTERNS = {
    'alimentacion_supermercado': ['jumbo', 'bravo', 'sirena', 'supermercado', 'mercado', 'colmado', 'merkado', 'grocery', 'alimentos', 'comestibles'],
    'alimentacion_restaurantes': ['restaurante', 'restaurant', 'bistro', 'parrillada', 'comida', 'cena', 'almuerzo'],
    'alimentacion_comida_rapida': ['burger', 'pizza', 'kfc', 'mcdonald', 'subway', 'wendy', 'carls', 'comida rapida', 'fast food'],
    'transporte_gasolina': ['gasolina', 'gas station', 'shell', 'texaco', 'pdv', 'esso', 'fuel', 'combustible'],
    'transporte_publico': ['metro', 'omsa', 'bus', 'guagua', 'taxi', 'transportacion'],
    'transporte_uber': ['uber', 'lyft', 'indrive', 'taxi app', 'carro compartido'],
    'vivienda_alquiler': ['alquiler', 'renta', 'apartamento', 'inquilino', 'propietario'],
    'vivienda_servicios': ['edesur', 'agua potable', 'caaabo', 'servicios basicos', 'mantenimiento'],
    'servicios_telefono': ['claro', 'orange', 'altice', 'tropical', 'telecom', 'internet', 'cable', 'digicel'],
    'servicios_suscripciones': ['netflix', 'spotify', 'hbo', 'disney', 'amazon prime', 'youtube premium', 'suscripcion'],
    'salud_farmacia': ['farmacia', 'pharmacy', 'medicamentos', 'drogueria', 'farmatodo', 'la botica'],
    'salud_medico': ['doctor', 'medico', 'hospital', 'clinica', 'consulta', 'examen', 'laboratorio'],
    'entretenimiento_cine': ['cine', 'cinema', 'movies', 'ticket', 'boleto', 'entradas'],
    'entretenimiento_streaming': ['netflix', 'spotify', 'hbo', 'disney+', 'apple music', 'amazon prime video'],
    'shopping_ropa': ['ropa', 'clothes', 'zara', 'h&m', 'uniqlo', 'tienda de ropa', 'vestimenta'],
    'shopping_electronica': ['celular', 'iphone', 'samsung', 'elektra', 'tecnologia', 'gadget'],
    'educacion_cursos': ['curso', 'universidad', 'colegio', 'escuela', 'educacion', 'certificacion', 'bootcamp'],
    'familia_remesas': ['remesa', 'western union', 'money gram', 'transfer', 'envio familiar'],
    'ingreso_sueldo': ['sueldo', 'salario', 'pago', 'nomina', 'payroll', 'ingreso mensual'],
    'ingreso_freelance': ['freelance', 'contrato', 'proyecto', 'consultoria', 'servicio independiente'],
    'ingreso_remesas': ['remesa recibida', 'dinero enviado', 'familia', 'apoyo familiar'],
    'otros_impuestos': ['impuesto', 'tax', 'gobierno', 'dgi', 'interna', 'predial'],
    'otros_otros': []
};

// Datos iniciales (Mock Data)
let appData = {
    user: {
        name: 'Juan Diaz',
        monthlyIncome: 85000,
        profile: 'Premium'
    },
    transactions: [
        { id: 1, type: 'expense', description: 'Supermercado Bravo', amount: 4500, category: 'alimentacion_supermercado', date: '2026-01-04', account: 'banreservas' },
        { id: 2, type: 'expense', description: 'Pago Claro', amount: 1899, category: 'servicios_telefono', date: '2026-01-03', account: 'popular' },
        { id: 3, type: 'income', description: 'Sueldo Enero', amount: 75000, category: 'ingreso_sueldo', date: '2026-01-01', account: 'banreservas' },
        { id: 4, type: 'expense', description: 'Uber al trabajo', amount: 350, category: 'transporte_uber', date: '2026-01-03', account: 'bhd' },
        { id: 5, type: 'expense', description: 'Restaurante La Banqueta', amount: 2800, category: 'alimentacion_restaurantes', date: '2026-01-02', account: 'bhd' },
        { id: 6, type: 'expense', description: 'Gasolina Shell', amount: 2500, category: 'transporte_gasolina', date: '2026-01-02', account: 'banreservas' },
        { id: 7, type: 'income', description: 'Freelance App', amount: 10000, category: 'ingreso_freelance', date: '2026-01-02', account: 'popular' },
        { id: 8, type: 'expense', description: 'Netflix', amount: 899, category: 'entretenimiento_streaming', date: '2026-01-01', account: 'banreservas' },
        { id: 9, type: 'expense', description: 'Farmacia Cruz', amount: 1200, category: 'salud_farmacia', date: '2026-01-01', account: 'cash' },
        { id: 10, type: 'expense', description: 'Alquiler Enero', amount: 18000, category: 'vivienda_alquiler', date: '2026-01-01', account: 'banreservas' },
        { id: 11, type: 'expense', description: 'Remesa a familia', amount: 5000, category: 'familia_remesas', date: '2025-12-28', account: 'banreservas' },
        { id: 12, type: 'expense', description: 'Cine Agora', amount: 850, category: 'entretenimiento_cine', date: '2025-12-27', account: 'bhd' }
    ],
    budgetConfigs: [
        { id: 'alimentacion', name: 'Alimentacion', limit: 15000, color: '#FF9800' },
        { id: 'transporte', name: 'Transporte', limit: 5000, color: '#2196F3' },
        { id: 'servicios', name: 'Servicios', limit: 5000, color: '#9C27B0' },
        { id: 'entretenimiento', name: 'Entretenimiento', limit: 2000, color: '#FFC107' },
        { id: 'salud', name: 'Salud', limit: 3000, color: '#F44336' },
        { id: 'shopping', name: 'Shopping', limit: 4000, color: '#E91E63' }
    ],
    goals: [
        { id: 1, name: 'Vacaciones', target: 50000, current: 18500, deadline: '2026-06-01', icon: 'plane', color: '#2196F3' },
        { id: 2, name: 'Nuevo Celular', target: 25000, current: 22000, deadline: '2026-02-15', icon: 'electronics', color: '#E91E63' },
        { id: 3, name: 'Fondo de Emergencia', target: 100000, current: 45000, deadline: '2026-12-31', icon: 'savings', color: '#00A86B' }
    ]
};

// Gráfico de gastos
let expensesChart = null;

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadFromStorage();
    initApp();
    setupEventListeners();
});

function initApp() {
    loadDarkModePreference();
    generateRecurringTransactions();

    updateDashboard();
    renderTransactions();
    renderBudgets();
    renderGoals();
    renderRecommendations();
    initChart();
}

function generateRecurringTransactions() {
    const today = new Date();
    const recurring = appData.transactions.filter(t => t.isRecurring);

    recurring.forEach(template => {
        const lastGen = template.lastGenerated ? new Date(template.lastGenerated) : new Date(template.date);
        let shouldGenerate = false;

        switch (template.recurrencePattern) {
            case 'daily':
                shouldGenerate = (today - lastGen) >= 86400000; // 1 día
                break;
            case 'weekly':
                shouldGenerate = (today - lastGen) >= 604800000; // 7 días
                break;
            case 'biweekly':
                shouldGenerate = (today - lastGen) >= 1209600000; // 14 días
                break;
            case 'monthly':
                shouldGenerate = today.getMonth() !== lastGen.getMonth() || today.getFullYear() !== lastGen.getFullYear();
                break;
        }

        if (shouldGenerate) {
            const newTransaction = {
                ...template,
                id: Date.now() + Math.random(), // ID único
                date: today.toISOString().split('T')[0],
                lastGenerated: today.toISOString()
            };

            delete newTransaction.lastGenerated; // No duplicar en la nueva
            template.lastGenerated = today.toISOString(); // Actualizar plantilla

            appData.transactions.unshift(newTransaction);
        }
    });

    saveToStorage();
}

function loadFromStorage() {
    const saved = localStorage.getItem('finanzasrd_data');
    if (saved) {
        appData = JSON.parse(saved);

        // Migration: Remove legacy budgets array if it exists
        if (appData.budgets) {
            delete appData.budgets;
            saveToStorage();
        }

        // Ensure budgetConfigs exists for older data
        if (!appData.budgetConfigs) {
            appData.budgetConfigs = [
                { id: 'alimentacion', name: 'Alimentacion', limit: 15000, color: '#FF9800' },
                { id: 'transporte', name: 'Transporte', limit: 5000, color: '#2196F3' },
                { id: 'servicios', name: 'Servicios', limit: 5000, color: '#9C27B0' },
                { id: 'entretenimiento', name: 'Entretenimiento', limit: 2000, color: '#FFC107' },
                { id: 'salud', name: 'Salud', limit: 3000, color: '#F44336' },
                { id: 'shopping', name: 'Shopping', limit: 4000, color: '#E91E63' }
            ];
            saveToStorage();
        }
    } else {
        saveToStorage();
    }
}

function saveToStorage() {
    localStorage.setItem('finanzasrd_data', JSON.stringify(appData));
}

// ============================================
// DASHBOARD
// ============================================

function updateDashboard() {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyTransactions = appData.transactions.filter(t =>
        t.date.startsWith(currentMonth)
    );

    const totalIncome = monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : 0;

    // Calcular balance total (acumulado)
    const allTransactions = appData.transactions;
    const totalBalance = allTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0) -
        allTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

    document.getElementById('total-balance').textContent = formatCurrency(totalBalance);
    document.getElementById('total-income').textContent = formatCurrency(totalIncome);
    document.getElementById('total-expenses').textContent = formatCurrency(totalExpenses);
    document.getElementById('savings-rate').textContent = savingsRate + '%';
}

// ============================================
// GRÁFICO DE GASTOS
// ============================================

function initChart() {
    const ctx = document.getElementById('expensesChart');
    if (!ctx) return;

    const context = ctx.getContext('2d');

    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyExpenses = appData.transactions.filter(t =>
        t.type === 'expense' && t.date.startsWith(currentMonth)
    );

    // Agrupar por categoría
    const categoryTotals = {};
    monthlyExpenses.forEach(t => {
        const catInfo = CATEGORIES[t.category];
        if (catInfo) {
            const catName = catInfo.name.split(' - ')[0];
            categoryTotals[catName] = (categoryTotals[catName] || 0) + t.amount;
        }
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    const colors = labels.map((label, i) => {
        const baseColors = ['#003366', '#00A86B', '#FFD700', '#FF4444', '#9C27B0', '#2196F3', '#E91E63', '#FF9800'];
        return baseColors[i % baseColors.length];
    });

    expensesChart = new Chart(context, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        padding: 16,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: {
                            size: 12,
                            family: 'Inter'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: '#1A1A2E',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: '600'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function (context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${formatCurrency(context.parsed)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// ============================================
// TRANSACCIONES
// ============================================

function renderTransactions() {
    const container = document.getElementById('transaction-list');
    if (!container) return;

    const sortedTransactions = [...appData.transactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 8);

    container.innerHTML = sortedTransactions.map(t => {
        const catInfo = CATEGORIES[t.category] || { name: 'Otros', icon: 'fa-ellipsis-h', color: '#607D8B' };
        const catClass = t.type === 'income' ? 'income' :
            t.category.includes('alimentacion') ? 'food' :
                t.category.includes('transporte') ? 'transport' :
                    t.category.includes('servicio') ? 'services' :
                        t.category.includes('shopping') ? 'shopping' : 'other';

        return `
            <div class="transaction-item" style="position: relative;">
                ${t.isRecurring ? '<i class="fas fa-sync-alt" style="position: absolute; top: 8px; right: 8px; color: var(--secondary); font-size: 10px;" title="Recurrente"></i>' : ''}
                <div class="transaction-icon ${catClass}" style="background: ${catInfo.color}15; color: ${catInfo.color}">
                    <i class="fas ${catInfo.icon}"></i>
                </div>
                <div class="transaction-details">
                    <div class="transaction-name">${escapeHtml(t.description)}</div>
                    <div class="transaction-category">${catInfo.name}</div>
                </div>
                <div class="transaction-amount ${t.type === 'income' ? 'positive' : 'negative'}">
                    ${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}
                </div>
            </div>
        `;
    }).join('');
}

function addTransaction(transaction) {
    // Validar antes de agregar
    const errors = validateTransaction(transaction);
    if (errors.length > 0) {
        showToast(errors.join('. '), 'warning');
        return; // No agregar si hay errores
    }

    transaction.id = Date.now();
    appData.transactions.unshift(transaction);
    saveToStorage();
    updateDashboard();
    renderTransactions();
    updateChart();
    renderBudgets();
    renderRecommendations();

    // Update full view if needed
    if (typeof renderFullTransactions === 'function') renderFullTransactions();
    if (typeof renderFullBudgets === 'function') renderFullBudgets();

    showToast('Transaccion agregada correctamente', 'success');
}

function validateTransaction(transaction) {
    const errors = [];

    // Validar descripción
    if (!transaction.description || transaction.description.trim().length < 3) {
        errors.push('La descripción debe tener al menos 3 caracteres');
    }

    // Validar monto
    if (!transaction.amount || transaction.amount <= 0) {
        errors.push('El monto debe ser mayor a cero');
    }

    // Validar fecha no futura
    const transactionDate = new Date(transaction.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (transactionDate > today) {
        errors.push('La fecha no puede ser futura');
    }

    // Validar categoría existe
    if (transaction.type === 'expense' && !CATEGORIES[transaction.category]) {
        errors.push('Categoría inválida');
    }

    return errors;
}

function updateChart() {
    if (!expensesChart) return;

    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyExpenses = appData.transactions.filter(t =>
        t.type === 'expense' && t.date.startsWith(currentMonth)
    );

    const categoryTotals = {};
    monthlyExpenses.forEach(t => {
        const catInfo = CATEGORIES[t.category];
        if (catInfo) {
            const catName = catInfo.name.split(' - ')[0];
            categoryTotals[catName] = (categoryTotals[catName] || 0) + t.amount;
        }
    });

    expensesChart.data.labels = Object.keys(categoryTotals);
    expensesChart.data.datasets[0].data = Object.values(categoryTotals);
    expensesChart.update();
}

// ============================================
// PREDICCIÓN DE CATEGORÍA (IA SIMULADA)
// ============================================

function predictCategory() {
    const descriptionInput = document.getElementById('transaction-description');
    const predictionElement = document.getElementById('category-prediction');
    const suggestedElement = document.getElementById('suggested-category');
    const categorySelect = document.getElementById('transaction-category');

    if (!descriptionInput || !predictionElement || !suggestedElement || !categorySelect) return;

    const description = descriptionInput.value.toLowerCase();

    if (description.length < 3) {
        predictionElement.style.display = 'none';
        return;
    }

    // Buscar categoría basada en palabras clave
    let bestMatch = 'otros_otros';
    let maxScore = 0;

    for (const [category, keywords] of Object.entries(CATEGORY_PATTERNS)) {
        let score = 0;
        for (const keyword of keywords) {
            if (description.includes(keyword)) {
                score++;
            }
        }
        if (score > maxScore) {
            maxScore = score;
            bestMatch = category;
        }
    }

    if (maxScore > 0) {
        const catInfo = CATEGORIES[bestMatch];
        suggestedElement.textContent = catInfo ? catInfo.name : bestMatch;
        categorySelect.value = bestMatch;
        predictionElement.style.display = 'inline-flex';
    } else {
        predictionElement.style.display = 'none';
    }
}

// ============================================
// PRESUPUESTOS
// ============================================

function renderBudgets() {
    const container = document.getElementById('budget-list');
    if (!container) return;

    const currentMonth = new Date().toISOString().slice(0, 7);

    // Calcular gastos reales por categoría
    const monthlyExpenses = appData.transactions.filter(t =>
        t.type === 'expense' && t.date.startsWith(currentMonth)
    );

    const expenseByCategory = {};
    monthlyExpenses.forEach(t => {
        const catMain = t.category.split('_')[0];
        expenseByCategory[catMain] = (expenseByCategory[catMain] || 0) + t.amount;
    });

    // Use dynamic config
    const budgetConfigs = appData.budgetConfigs || [];

    container.innerHTML = budgetConfigs.map(config => {
        const spent = expenseByCategory[config.id] || 0;
        const percentage = Math.min((spent / config.limit) * 100, 100);
        const statusClass = percentage >= 90 ? 'red' : percentage >= 70 ? 'yellow' : 'green';

        return `
            <div class="budget-item">
                <div class="budget-header">
                    <span class="budget-category">${config.name}</span>
                    <span class="budget-values">${formatCurrency(spent)} / ${formatCurrency(config.limit)}</span>
                </div>
                <div class="budget-bar">
                    <div class="budget-fill ${statusClass}" style="width: ${percentage}%; background: ${config.color}"></div>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// METAS DE AHORRO
// ============================================

function renderGoals() {
    const container = document.getElementById('goals-list');
    if (!container) return;

    const iconMap = {
        'plane': 'fa-plane',
        'car': 'fa-car',
        'home': 'fa-home',
        'education': 'fa-book',
        'health': 'fa-heart',
        'gift': 'fa-gift',
        'electronics': 'fa-mobile-alt',
        'savings': 'fa-piggy-bank'
    };

    container.innerHTML = appData.goals.map(goal => {
        const percentage = Math.min((goal.current / goal.target) * 100, 100);
        const remaining = goal.target - goal.current;

        return `
            <div class="goal-item">
                <div class="goal-icon" style="background: ${goal.color}">
                    <i class="fas ${iconMap[goal.icon] || 'fa-bullseye'}"></i>
                </div>
                <div class="goal-details">
                    <div class="goal-name">${escapeHtml(goal.name)}</div>
                    <div class="goal-progress">${percentage.toFixed(0)}% completado - ${formatCurrency(remaining)} restante</div>
                </div>
                <div class="goal-amount">${formatCurrency(goal.current)}</div>
            </div>
        `;
    }).join('');
}

function addGoal(goal) {
    goal.id = Date.now();
    appData.goals.push(goal);
    saveToStorage();
    renderGoals();
    showToast('Meta creada correctamente', 'success');
}

// ============================================
// RECOMENDACIONES IA
// ============================================

function renderRecommendations() {
    const container = document.getElementById('ai-recommendations');
    if (!container) return;

    const recommendations = generateRecommendations();

    container.innerHTML = recommendations.map(rec => `
        <div class="recommendation-card">
            <div class="recommendation-header">
                <div class="recommendation-icon">
                    <i class="fas ${rec.icon}"></i>
                </div>
                <div class="recommendation-title">${rec.title}</div>
            </div>
            <div class="recommendation-text">${rec.message}</div>
            <button class="recommendation-action">${rec.action}</button>
        </div>
    `).join('');
}

function generateRecommendations() {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyExpenses = appData.transactions.filter(t =>
        t.type === 'expense' && t.date.startsWith(currentMonth)
    );

    const totalExpenses = monthlyExpenses.reduce((sum, t) => sum + t.amount, 0);
    const monthlyIncome = appData.user.monthlyIncome;
    const expenseRatio = totalExpenses / monthlyIncome;

    const recommendations = [];

    // Alerta de gastos elevados
    if (expenseRatio > 0.7) {
        recommendations.push({
            icon: 'fa-exclamation-triangle',
            title: 'Alerta de Presupuesto',
            message: `Has gastado el ${(expenseRatio * 100).toFixed(0)}% de tus ingresos este mes. Tus gastos en restaurantes han aumentado un 15% comparado con el mes anterior.`,
            action: 'Ver Detalles'
        });
    }

    // Oportunidad de ahorro
    const foodExpenses = monthlyExpenses
        .filter(t => t.category.includes('alimentacion'))
        .reduce((sum, t) => sum + t.amount, 0);

    if (foodExpenses > 8000) {
        recommendations.push({
            icon: 'fa-piggy-bank',
            title: 'Oportunidad de Ahorro',
            message: `Podrias ahorrar hasta RD$ 2,000 mensuales preparando comida en casa. Los gastos en restaurantes representan el 35% de tu presupuesto alimenticio.`,
            action: 'Ver Consejos'
        });
    }

    // Progreso de metas
    const activeGoals = appData.goals.filter(g => {
        const daysLeft = Math.ceil((new Date(g.deadline) - new Date()) / (1000 * 60 * 60 * 24));
        return daysLeft > 0 && daysLeft <= 90;
    });

    if (activeGoals.length > 0) {
        const goal = activeGoals[0];
        const percentage = (goal.current / goal.target) * 100;
        recommendations.push({
            icon: 'fa-rocket',
            title: 'Acelera tu Meta',
            message: `Tu meta "${goal.name}" esta al ${percentage.toFixed(0)}%. Aportando RD$ 1,000 adicionales, la alcanzarias 3 semanas antes.`,
            action: 'Aportar Ahora'
        });
    }

    // Recordatorio de servicios
    const subscriptions = monthlyExpenses.filter(t =>
        t.category.includes('servicio') && t.description.toLowerCase().includes('netflix')
    );

    if (subscriptions.length > 0) {
        recommendations.push({
            icon: 'fa-lightbulb',
            title: 'Optimiza tus Suscripciones',
            message: 'Revisa tus suscripciones activas. Netflix, Spotify y otros servicios cuestan RD$ 2,500/mes. Son todas necesarias?',
            action: 'Revisar Suscripciones'
        });
    }

    // Si no hay recomendaciones criticas
    if (recommendations.length === 0) {
        recommendations.push({
            icon: 'fa-check-circle',
            title: 'Excelente Gestion!',
            message: 'Tu gastos estan bien controlados este mes. Manten este ritmo y tu tasa de ahorro mejorara significativamente.',
            action: 'Ver Resumen'
        });
    }

    return recommendations;
}

// ============================================
// MODALES
// ============================================

function openTransactionModal() {
    const dateInput = document.getElementById('transaction-date');
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
    document.getElementById('transaction-modal').classList.add('active');
}

function openGoalModal() {
    const deadlineInput = document.getElementById('goal-deadline');
    if (deadlineInput) {
        deadlineInput.value = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    }
    document.getElementById('goal-modal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    if (modalId === 'transaction-modal') {
        const form = document.getElementById('transaction-form');
        if (form) form.reset();
        const prediction = document.getElementById('category-prediction');
        if (prediction) prediction.style.display = 'none';
    }
}

function toggleTransactionFields() {
    const type = document.getElementById('transaction-type').value;
    const categoryGroup = document.getElementById('category-group');
    if (categoryGroup) {
        categoryGroup.style.display = type === 'income' ? 'none' : 'block';
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Navegacion
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function () {
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            const page = this.dataset.page;
            switchView(page);
        });
    });

    // Formulario de transaccion
    const transactionForm = document.getElementById('transaction-form');
    if (transactionForm) {
        transactionForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const transaction = {
                type: document.getElementById('transaction-type').value,
                description: document.getElementById('transaction-description').value,
                amount: parseFloat(document.getElementById('transaction-amount').value),
                category: document.getElementById('transaction-category').value,
                date: document.getElementById('transaction-date').value,
                account: document.getElementById('transaction-account').value,
                isRecurring: document.getElementById('is-recurring')?.checked || false,
                recurrencePattern: document.getElementById('recurrence-pattern')?.value || null,
                lastGenerated: null
            };

            addTransaction(transaction);
            closeModal('transaction-modal');
        });
    }

    // Formulario de meta
    const goalForm = document.getElementById('goal-form');
    if (goalForm) {
        goalForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const iconSelect = document.getElementById('goal-icon');
            const colorSelect = ['#2196F3', '#E91E63', '#4CAF50', '#00BCD4', '#FF9800', '#9C27B0', '#00A86B', '#607D8B'];

            const goal = {
                name: document.getElementById('goal-name').value,
                target: parseFloat(document.getElementById('goal-target').value),
                current: parseFloat(document.getElementById('goal-current').value),
                deadline: document.getElementById('goal-deadline').value,
                icon: iconSelect.value,
                color: colorSelect[iconSelect.selectedIndex]
            };

            addGoal(goal);
            closeModal('goal-modal');
        });
    }

    // Formulario de presupuesto
    const budgetForm = document.getElementById('budget-form');
    if (budgetForm) {
        budgetForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const budgetId = document.getElementById('budget-id').value;
            const categoryId = document.getElementById('budget-category').value;
            const limit = parseFloat(document.getElementById('budget-limit').value);
            const color = document.getElementById('budget-color').value;

            // Validar
            if (isNaN(limit) || limit <= 0) {
                showToast('El límite debe ser mayor a cero', 'warning');
                return;
            }

            if (budgetId) {
                // Editar existente
                const budget = appData.budgetConfigs.find(b => b.id === budgetId);
                if (budget) {
                    budget.limit = limit;
                    budget.color = color;
                }
            } else {
                // Crear nuevo
                const categoryName = this.querySelector(`#budget-category option[value="${categoryId}"]`).textContent;

                // Verificar si ya existe
                const exists = appData.budgetConfigs.find(b => b.id === categoryId);
                if (exists) {
                    showToast('Ya existe un presupuesto para esta categoría', 'warning');
                    return;
                }

                appData.budgetConfigs.push({
                    id: categoryId,
                    name: categoryName,
                    limit: limit,
                    color: color
                });
            }

            saveToStorage();
            renderBudgets();
            if (typeof renderFullBudgets === 'function') renderFullBudgets();
            closeModal('budget-modal');
            showToast('Presupuesto guardado correctamente', 'success');
        });
    }

    // Cerrar modal al hacer click fuera
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });

    // Busqueda
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            const query = e.target.value.toLowerCase();
            if (query.length > 2) {
                const filtered = appData.transactions.filter(t =>
                    t.description.toLowerCase().includes(query)
                );
                renderFilteredTransactions(filtered);
            } else {
                renderTransactions();
            }
        });
    }

    // Busqueda en transacciones (Vista completa)
    const transactionSearch = document.getElementById('full-search-transactions');
    if (transactionSearch) {
        transactionSearch.addEventListener('input', () => {
            renderFullTransactions();
        });
    }
}

function renderFilteredTransactions(transactions) {
    const container = document.getElementById('transaction-list');
    if (!container) return;

    container.innerHTML = transactions.map(t => {
        const catInfo = CATEGORIES[t.category] || { name: 'Otros', icon: 'fa-ellipsis-h', color: '#607D8B' };
        const catClass = t.type === 'income' ? 'income' : 'other';

        return `
            <div class="transaction-item">
                <div class="transaction-icon ${catClass}" style="background: ${catInfo.color}15; color: ${catInfo.color}">
                    <i class="fas ${catInfo.icon}"></i>
                </div>
                <div class="transaction-details">
                    <div class="transaction-name">${escapeHtml(t.description)}</div>
                    <div class="transaction-category">${catInfo.name}</div>
                </div>
                <div class="transaction-amount ${t.type === 'income' ? 'positive' : 'negative'}">
                    ${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// UTILIDADES
// ============================================

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-DO', {
        style: 'currency',
        currency: 'DOP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: 'fa-check',
        warning: 'fa-exclamation',
        info: 'fa-info'
    };

    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${icons[type]}"></i>
        </div>
        <div class="toast-message">${escapeHtml(message)}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);

    // Actualizar icono
    const icon = document.querySelector('.dark-mode-toggle i');
    if (icon) {
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Re-renderizar gráfico con colores adaptados
    if (expensesChart) {
        expensesChart.options.plugins.legend.labels.color = isDark ? '#F4F7FA' : '#1A1A2E';
        expensesChart.update();
    }
}

function loadDarkModePreference() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
    }
}

function toggleRecurrenceOptions() {
    const checkbox = document.getElementById('is-recurring');
    const group = document.getElementById('recurrence-group');
    if (group) {
        group.style.display = checkbox.checked ? 'block' : 'none';
    }
}

// ============================================
// UTILIDADES DE EXPORTACIÓN
// ============================================

/**
 * Fuerza la descarga de un archivo con un nombre específico
 * @param {Blob} blob - El contenido del archivo
 * @param {string} fileName - El nombre deseado para el archivo
 */
async function triggerDownload(blob, fileName) {
    // Intentar usar la API moderna de Acceso al Sistema de Archivos
    if (window.showSaveFilePicker) {
        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: fileName,
                types: [{
                    description: 'Archivo',
                    accept: { [blob.type]: ['.' + fileName.split('.').pop()] },
                }],
            });
            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
            return;
        } catch (err) {
            // Usuario canceló o error, intentar fallback si no fue cancelación
            if (err.name !== 'AbortError') {
                console.warn('File System Access API falló, usando método legado:', err);
            } else {
                return; // Usuario canceló
            }
        }
    }

    // Fallback para navegadores antiguos o si falla lo anterior
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    // Pequeño delay para asegurar que el navegador registre el evento
    setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, 100);
}

// ============================================
// EXPORTACIÓN PDF INFOGRÁFICA
// ============================================

async function exportToPDFInfographic() {
    showToast('Generando reporte PDF profesional...', 'info');

    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Colores del tema
        const colors = {
            primary: '#003366',
            secondary: '#00A86B',
            accent: '#FFD700',
            text: '#1A1A2E',
            lightGray: '#F4F7FA',
            border: '#E5E7EB'
        };

        let yPosition = 20;

        // ============== ENCABEZADO ==============
        pdf.setFillColor(0, 51, 102);
        pdf.rect(0, 0, pageWidth, 45, 'F');

        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');
        pdf.text('FinanzasRD AI', pageWidth / 2, 20, { align: 'center' });

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Reporte Financiero de Inteligencia Financiera', pageWidth / 2, 28, { align: 'center' });

        const currentDate = new Date().toLocaleDateString('es-DO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        pdf.setFontSize(10);
        pdf.text(currentDate, pageWidth / 2, 36, { align: 'center' });

        yPosition = 55;

        // ============== DATOS DEL MES ==============
        const currentMonth = new Date().toISOString().slice(0, 7);
        const monthlyTransactions = appData.transactions.filter(t =>
            t.date && t.date.startsWith(currentMonth)
        );

        const totalIncome = monthlyTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = monthlyTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = totalIncome - totalExpenses;
        const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

        // Tarjetas
        const cards = [
            { label: 'Ingresos', value: formatCurrency(totalIncome), color: colors.secondary, x: 15 },
            { label: 'Gastos', value: formatCurrency(totalExpenses), color: '#FF4444', x: 75 },
            { label: 'Balance', value: formatCurrency(balance), color: colors.primary, x: 135 }
        ];

        cards.forEach(card => {
            pdf.setFillColor(244, 247, 250);
            pdf.roundedRect(card.x, yPosition, 50, 28, 3, 3, 'F');
            pdf.setDrawColor(card.color);
            pdf.setLineWidth(0.5);
            pdf.roundedRect(card.x, yPosition, 50, 28, 3, 3, 'S');

            pdf.setTextColor(card.color);
            pdf.setFontSize(13);
            pdf.setFont('helvetica', 'bold');
            pdf.text(card.value, card.x + 25, yPosition + 12, { align: 'center' });

            pdf.setTextColor(107, 114, 128);
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            pdf.text(card.label, card.x + 25, yPosition + 22, { align: 'center' });
        });

        yPosition += 40;

        // ============== TASA DE AHORRO ==============
        pdf.setFontSize(12);
        pdf.setTextColor(26, 26, 46);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Tasa de Ahorro Mensual', 15, yPosition);

        yPosition += 8;
        const barWidth = pageWidth - 30;
        const barHeight = 10;
        pdf.setFillColor(229, 231, 235);
        pdf.roundedRect(15, yPosition, barWidth, barHeight, 2, 2, 'F');

        const safeSavingsRate = Math.max(0, Math.min(100, parseFloat(savingsRate)));
        const fillWidth = (safeSavingsRate / 100) * barWidth;
        const progressColor = safeSavingsRate >= 20 ? colors.secondary : safeSavingsRate >= 10 ? '#FF9800' : '#FF4444';

        if (fillWidth > 0) {
            pdf.setFillColor(progressColor);
            pdf.roundedRect(15, yPosition, fillWidth, barHeight, 2, 2, 'F');
        }

        pdf.setFontSize(9);
        pdf.setTextColor(fillWidth > 20 ? 255 : 26, fillWidth > 20 ? 255 : 26, fillWidth > 20 ? 255 : 26);
        pdf.text(`${savingsRate}%`, 15 + Math.max(5, fillWidth - 12), yPosition + 7);

        yPosition += 25;

        // ============== GRÁFICO Y TOP ==============
        pdf.setFontSize(12);
        pdf.setTextColor(26, 26, 46);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Distribución de Egresos', 15, yPosition);

        yPosition += 5;
        const chartCanvas = document.getElementById('expensesChart');
        if (chartCanvas) {
            try {
                const chartImage = chartCanvas.toDataURL('image/png', 1.0);
                pdf.addImage(chartImage, 'PNG', 12, yPosition, 100, 75);
            } catch (e) {
                pdf.setFontSize(9);
                pdf.setTextColor(150);
                pdf.text('[Gráfico no disponible]', 30, yPosition + 20);
            }
        }

        // Top Categorías
        const categoryTotals = {};
        monthlyTransactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                const catName = CATEGORIES[t.category]?.name || 'Otros';
                categoryTotals[catName] = (categoryTotals[catName] || 0) + t.amount;
            });

        const topCategories = Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        let categoryY = yPosition + 15;
        pdf.setFontSize(10);
        pdf.setTextColor(26, 26, 46);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Top Gastos', 125, categoryY);
        categoryY += 10;

        topCategories.forEach(([cat, amount], index) => {
            const perc = totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(0) : 0;
            pdf.setFillColor(0, 51, 102);
            pdf.circle(128, categoryY - 1, 2.5, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(7);
            pdf.text(`${index + 1}`, 128, categoryY, { align: 'center' });

            pdf.setTextColor(26, 26, 46);
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            pdf.text(cat, 135, categoryY);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`${perc}%`, 185, categoryY, { align: 'right' });
            categoryY += 8;
        });

        yPosition += 85;

        // ============== PRESUPUESTOS ==============
        if (yPosition > pageHeight - 70) {
            pdf.addPage();
            yPosition = 20;
        }

        pdf.setFontSize(12);
        pdf.setTextColor(26, 26, 46);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Control de Presupuestos', 15, yPosition);

        yPosition += 10;
        const budgets = appData.budgetConfigs.slice(0, 5);
        budgets.forEach(config => {
            const spent = monthlyTransactions
                .filter(t => t.type === 'expense' && t.category.startsWith(config.id))
                .reduce((sum, t) => sum + t.amount, 0);

            const perc = Math.min(100, (spent / config.limit) * 100);

            pdf.setFontSize(9);
            pdf.setTextColor(26, 26, 46);
            pdf.setFont('helvetica', 'normal');
            pdf.text(config.name, 15, yPosition);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`${formatCurrency(spent)} de ${formatCurrency(config.limit)}`, 185, yPosition, { align: 'right' });

            yPosition += 4;
            pdf.setFillColor(240, 240, 240);
            pdf.rect(15, yPosition, pageWidth - 30, 4, 'F');
            pdf.setFillColor(config.color);
            pdf.rect(15, yPosition, (perc / 100) * (pageWidth - 30), 4, 'F');

            yPosition += 12;
        });

        // Pie de página
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        pdf.setFont('helvetica', 'italic');
        pdf.text('FinanzasRD AI - Reporte generado automáticamente para gestión inteligente.', pageWidth / 2, pageHeight - 10, { align: 'center' });

        // Guardar con forzado de nombre usando triggerDownload
        const timestamp = new Date().toISOString().split('T')[0];
        const finalFileName = `FinanzasRD_Reporte_${timestamp}.pdf`;

        const pdfBlob = pdf.output('blob');
        triggerDownload(pdfBlob, finalFileName);
        showToast('Reporte PDF descargado con éxito', 'success');

    } catch (error) {
        console.error('Error al generar PDF:', error);
        showToast('Error al generar el PDF: ' + error.message, 'error');
    }
}

// ============================================
// EXPORTACIÓN EXCEL PROFESIONAL
// ============================================

function exportToExcel() {
    showToast('Generando archivo Excel...', 'info');

    const workbook = XLSX.utils.book_new();
    const currentMonth = new Date().toISOString().slice(0, 7);

    // ============== HOJA 1: RESUMEN EJECUTIVO ==============
    const summaryData = generateSummarySheet(currentMonth);
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

    // Configurar anchos de columna
    summarySheet['!cols'] = [
        { wch: 25 },
        { wch: 20 },
        { wch: 15 }
    ];

    // Aplicar estilos (si la versión de XLSX lo soporta)
    summarySheet['!rows'] = [{ hpt: 25 }]; // Altura de primera fila

    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumen');

    // ============== HOJA 2: TRANSACCIONES ==============
    const transactionsData = generateTransactionsSheet();
    const transactionsSheet = XLSX.utils.aoa_to_sheet(transactionsData);

    transactionsSheet['!cols'] = [
        { wch: 12 },  // Fecha
        { wch: 30 },  // Descripción
        { wch: 20 },  // Categoría
        { wch: 15 },  // Monto
        { wch: 10 },  // Tipo
        { wch: 15 }   // Cuenta
    ];

    // Filtros automáticos
    transactionsSheet['!autofilter'] = { ref: `A1:F${transactionsData.length}` };

    XLSX.utils.book_append_sheet(workbook, transactionsSheet, 'Transacciones');

    // ============== HOJA 3: GASTOS POR CATEGORÍA ==============
    const categoryData = generateCategorySheet(currentMonth);
    const categorySheet = XLSX.utils.aoa_to_sheet(categoryData);

    categorySheet['!cols'] = [
        { wch: 25 },
        { wch: 15 },
        { wch: 12 }
    ];

    XLSX.utils.book_append_sheet(workbook, categorySheet, 'Por Categoría');

    // ============== HOJA 4: PRESUPUESTOS ==============
    const budgetData = generateBudgetSheet(currentMonth);
    const budgetSheet = XLSX.utils.aoa_to_sheet(budgetData);

    budgetSheet['!cols'] = [
        { wch: 20 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 12 }
    ];

    XLSX.utils.book_append_sheet(workbook, budgetSheet, 'Presupuestos');

    // ============== HOJA 5: METAS DE AHORRO ==============
    const goalsData = generateGoalsSheet();
    const goalsSheet = XLSX.utils.aoa_to_sheet(goalsData);

    goalsSheet['!cols'] = [
        { wch: 25 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 12 },
        { wch: 15 }
    ];

    XLSX.utils.book_append_sheet(workbook, goalsSheet, 'Metas de Ahorro');

    // Guardar archivo usando triggerDownload para asegurar el nombre
    const fileName = `FinanzasRD_${new Date().toISOString().slice(0, 10)}.xlsx`;
    const excelData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    triggerDownload(excelBlob, fileName);

    showToast('Archivo Excel descargado correctamente', 'success');
}

// Funciones auxiliares para generar cada hoja

function generateSummarySheet(currentMonth) {
    const monthlyTransactions = appData.transactions.filter(t =>
        t.date && t.date.startsWith(currentMonth)
    );

    const totalIncome = monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

    const monthName = new Date(currentMonth + '-01').toLocaleDateString('es-DO', { month: 'long', year: 'numeric' });

    return [
        ['FINANZASRD AI - REPORTE FINANCIERO'],
        ['Período:', monthName],
        ['Generado:', new Date().toLocaleString('es-DO')],
        [],
        ['RESUMEN EJECUTIVO'],
        ['Indicador', 'Valor', 'Detalle'],
        ['Ingresos Totales', totalIncome, formatCurrency(totalIncome)],
        ['Gastos Totales', totalExpenses, formatCurrency(totalExpenses)],
        ['Balance', balance, formatCurrency(balance)],
        ['Tasa de Ahorro', parseFloat(savingsRate), `${savingsRate}%`],
        ['Número de Transacciones', monthlyTransactions.length, ''],
        [],
        ['ANÁLISIS'],
        ['Gasto Promedio Diario', totalExpenses / 30, formatCurrency(totalExpenses / 30)],
        ['Ingreso Promedio Mensual', appData.user.monthlyIncome, formatCurrency(appData.user.monthlyIncome)],
        []
    ];
}

function generateTransactionsSheet() {
    const headers = ['Fecha', 'Descripción', 'Categoría', 'Monto', 'Tipo', 'Cuenta'];

    const rows = appData.transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map(t => [
            t.date,
            t.description,
            CATEGORIES[t.category]?.name || t.category,
            t.amount,
            t.type === 'income' ? 'Ingreso' : 'Gasto',
            t.account
        ]);

    return [headers, ...rows];
}

function generateCategorySheet(currentMonth) {
    const monthlyExpenses = appData.transactions.filter(t =>
        t.type === 'expense' && t.date && t.date.startsWith(currentMonth)
    );

    const categoryTotals = {};
    monthlyExpenses.forEach(t => {
        const catInfo = CATEGORIES[t.category];
        if (catInfo) {
            const catName = catInfo.name;
            categoryTotals[catName] = (categoryTotals[catName] || 0) + t.amount;
        }
    });

    const totalExpenses = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

    const headers = ['Categoría', 'Monto', 'Porcentaje'];

    const rows = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .map(([cat, amount]) => [
            cat,
            amount,
            `${totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(2) : 0}%`
        ]);

    return [
        ['GASTOS POR CATEGORÍA'],
        headers,
        ...rows,
        [],
        ['TOTAL', totalExpenses, '100%']
    ];
}

function generateBudgetSheet(currentMonth) {
    const monthlyExpenses = appData.transactions.filter(t =>
        t.type === 'expense' && t.date && t.date.startsWith(currentMonth)
    );

    const expenseByCategory = {};
    monthlyExpenses.forEach(t => {
        const catMain = t.category.split('_')[0];
        expenseByCategory[catMain] = (expenseByCategory[catMain] || 0) + t.amount;
    });

    const headers = ['Categoría', 'Límite', 'Gastado', 'Disponible', '% Usado'];

    const rows = appData.budgetConfigs.map(config => {
        const spent = expenseByCategory[config.id] || 0;
        const remaining = config.limit - spent;
        const percentage = ((spent / config.limit) * 100).toFixed(1);

        return [
            config.name,
            config.limit,
            spent,
            remaining,
            `${percentage}%`
        ];
    });

    return [
        ['ESTADO DE PRESUPUESTOS'],
        headers,
        ...rows
    ];
}

function generateGoalsSheet() {
    const headers = ['Meta', 'Objetivo', 'Ahorrado', 'Faltante', 'Progreso', 'Fecha Límite'];

    const rows = appData.goals.map(goal => {
        const remaining = goal.target - goal.current;
        const percentage = ((goal.current / goal.target) * 100).toFixed(1);

        return [
            goal.name,
            goal.target,
            goal.current,
            remaining,
            `${percentage}%`,
            goal.deadline
        ];
    });

    return [
        ['METAS DE AHORRO'],
        headers,
        ...rows
    ];
}

const API = {
    // Prediccion de categoria usando servidor ML
    async predictCategory(description) {
        try {
            const response = await fetch('/api/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ description })
            });
            return await response.json();
        } catch (error) {
            console.error('Error predicting category:', error);
            return null;
        }
    },

    // Obtener recomendaciones del motor IA
    async getRecommendations() {
        try {
            const response = await fetch('/api/recommendations');
            return await response.json();
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            return null;
        }
    },

    // Sincronizar con banco (demo)
    async syncBank(accountId) {
        try {
            const response = await fetch(`/api/sync/${accountId}`, {
                method: 'POST'
            });
            return await response.json();
        } catch (error) {
            console.error('Error syncing bank:', error);
            return null;
        }
    }
};

// ============================================
// VISTAS Y NAVEGACIÓN
// ============================================

function switchView(page) {
    // Ocultar todas las vistas
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));

    // Mostrar vista seleccionada
    const view = document.getElementById(`view-${page}`);
    if (view) {
        view.classList.add('active');
    } else {
        // Fallback a dashboard si no existe la vista
        document.getElementById('view-dashboard').classList.add('active');
    }

    // Actualizar titulo
    const titles = {
        'dashboard': 'Hola, Juan',
        'transactions': 'Historial de Transacciones',
        'budgets': 'Presupuestos Detallados',
        'goals': 'Metas de Ahorro',
        'insights': 'Insights IA',
        'accounts': 'Cuentas Bancarias'
    };

    const titleEl = document.querySelector('.header-title h1');
    if (titleEl) titleEl.textContent = titles[page] || 'FinanzasRD';

    const subtitleEl = document.querySelector('.header-title p');
    if (subtitleEl) {
        if (page === 'dashboard') subtitleEl.textContent = 'Aqui esta tu resumen financiero de hoy';
        else subtitleEl.textContent = 'Gestiona tus finanzas de manera inteligente';
    }

    // Renderizar contenido especifico
    if (page === 'transactions') renderFullTransactions();
    if (page === 'budgets') renderFullBudgets();
    if (page === 'goals') renderFullGoals();
    if (page === 'insights') renderFullRecommendations();
}

function renderFullTransactions() {
    const container = document.getElementById('full-transaction-list');
    if (!container) return;

    const query = document.getElementById('full-search-transactions')?.value.toLowerCase() || '';

    const sortedTransactions = [...appData.transactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    const filteredTransactions = sortedTransactions.filter(t => {
        const catName = (CATEGORIES[t.category]?.name || '').toLowerCase();
        const descMatch = t.description.toLowerCase().includes(query);
        const catMatch = catName.includes(query);
        return descMatch || catMatch;
    });

    container.innerHTML = filteredTransactions.map(t => {
        const catInfo = CATEGORIES[t.category] || { name: 'Otros', icon: 'fa-ellipsis-h', color: '#607D8B' };
        const catClass = t.type === 'income' ? 'income' :
            t.category.includes('alimentacion') ? 'food' :
                t.category.includes('transporte') ? 'transport' :
                    t.category.includes('servicio') ? 'services' :
                        t.category.includes('shopping') ? 'shopping' : 'other';

        return `
            <div class="transaction-item" style="position: relative;">
                ${t.isRecurring ? '<i class="fas fa-sync-alt" style="position: absolute; top: 8px; right: 8px; color: var(--secondary); font-size: 10px;" title="Recurrente"></i>' : ''}
                <div class="transaction-icon ${catClass}" style="background: ${catInfo.color}15; color: ${catInfo.color}">
                    <i class="fas ${catInfo.icon}"></i>
                </div>
                <div class="transaction-details">
                    <div class="transaction-name">${escapeHtml(t.description)}</div>
                    <div class="transaction-category">${catInfo.name}</div>
                    <div class="transaction-date" style="font-size: 11px; color: #999;">${t.date}</div>
                </div>
                <div class="transaction-amount ${t.type === 'income' ? 'positive' : 'negative'}">
                    ${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}
                </div>
            </div>
        `;
    }).join('');
}

function renderFullBudgets() {
    const container = document.getElementById('full-budget-list');
    if (!container) return;
    renderBudgetsToContainer(container);
}

function renderBudgetsToContainer(container) {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyExpenses = appData.transactions.filter(t =>
        t.type === 'expense' && t.date.startsWith(currentMonth)
    );

    const expenseByCategory = {};
    monthlyExpenses.forEach(t => {
        const catMain = t.category.split('_')[0];
        expenseByCategory[catMain] = (expenseByCategory[catMain] || 0) + t.amount;
    });

    const budgetConfigs = appData.budgetConfigs || [];

    if (budgetConfigs.length === 0) {
        container.innerHTML = `<div style="text-align: center; color: #666; padding: 20px;">No has configurado presupuestos aún. ¡Crea uno nuevo!</div>`;
        return;
    }

    container.innerHTML = budgetConfigs.map(config => {
        const spent = expenseByCategory[config.id] || 0;
        const percentage = Math.min((spent / config.limit) * 100, 100);
        const statusClass = percentage >= 90 ? 'red' : percentage >= 70 ? 'yellow' : 'green';

        return `
            <div class="budget-item" style="padding: 16px; background: #fff; border: 1px solid #eee; border-radius: 8px; margin-bottom: 12px; position: relative;">
                <div class="budget-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="budget-category" style="font-size: 16px; font-weight: 500;">${config.name}</span>
                        <i class="fas fa-edit" style="cursor: pointer; color: #aaa; font-size: 0.9em;" onclick="openBudgetModal('${config.id}')" title="Editar Presupuesto"></i>
                    </div>
                    <span class="budget-values" style="font-size: 14px; color: #666;">${formatCurrency(spent)} / ${formatCurrency(config.limit)}</span>
                </div>
                <div class="budget-bar" style="height: 12px;">
                    <div class="budget-fill ${statusClass}" style="width: ${percentage}%; background: ${config.color}"></div>
                </div>
                <div style="margin-top: 8px; font-size: 12px; color: #666;">
                    Restante: ${formatCurrency(config.limit - spent)}
                </div>
            </div>
        `;
    }).join('');
}

function renderFullGoals() {
    const container = document.getElementById('full-goals-list');
    if (!container) return;

    const iconMap = {
        'plane': 'fa-plane',
        'car': 'fa-car',
        'home': 'fa-home',
        'education': 'fa-book',
        'health': 'fa-heart',
        'gift': 'fa-gift',
        'electronics': 'fa-mobile-alt',
        'savings': 'fa-piggy-bank'
    };

    container.innerHTML = appData.goals.map(goal => {
        const percentage = Math.min((goal.current / goal.target) * 100, 100);
        const remaining = goal.target - goal.current;

        return `
            <div class="goal-item" style="background: #f9f9f9; padding: 20px;">
                <div class="goal-icon" style="background: ${goal.color}; width: 60px; height: 60px; font-size: 24px;">
                    <i class="fas ${iconMap[goal.icon] || 'fa-bullseye'}"></i>
                </div>
                <div class="goal-details">
                    <div class="goal-name" style="font-size: 18px;">${escapeHtml(goal.name)}</div>
                    <div class="goal-progress">
                        <div class="progress-bar-bg" style="height: 6px; background: #ddd; border-radius: 3px; margin: 8px 0; overflow: hidden;">
                            <div style="width: ${percentage}%; background: ${goal.color}; height: 100%;"></div>
                        </div>
                        ${percentage.toFixed(0)}% completado - ${formatCurrency(remaining)} para la meta
                    </div>
                    <div style="font-size: 12px; color: #888; margin-top: 4px;">Fecha limite: ${goal.deadline}</div>
                </div>
                <div class="goal-amount" style="font-size: 20px;">${formatCurrency(goal.current)}</div>
            </div>
        `;
    }).join('');
}

function renderFullRecommendations() {
    const container = document.getElementById('full-recommendations-list');
    if (!container) return;

    // Usamos la misma generacion
    const recommendations = generateRecommendations();

    container.innerHTML = recommendations.map(rec => `
        <div class="recommendation-card" style="margin-bottom: 24px;">
            <div class="recommendation-header">
                <div class="recommendation-icon">
                    <i class="fas ${rec.icon}"></i>
                </div>
                <div class="recommendation-title" style="font-size: 16px;">${rec.title}</div>
            </div>
            <div class="recommendation-text" style="font-size: 15px;">${rec.message}</div>
            <button class="recommendation-action" style="width: 100%; text-align: center; margin-top: 12px;">${rec.action}</button>
        </div>
    `).join('');
}

// ============================================
// GESTIÓN DE PRESUPUESTOS
// ============================================

function openBudgetModal(budgetId = null) {
    const modal = document.getElementById('budget-modal');
    const form = document.getElementById('budget-form');

    // Reset form
    form.reset();
    document.getElementById('budget-id').value = '';

    if (budgetId) {
        const budget = appData.budgetConfigs.find(b => b.id === budgetId);
        if (budget) {
            document.getElementById('budget-id').value = budget.id;
            document.getElementById('budget-category').value = budget.id;
            document.getElementById('budget-limit').value = budget.limit;
            document.getElementById('budget-color').value = budget.color;
        }
    }

    modal.classList.add('active');
}

// Exportar para uso global
window.FinanzasRD = {
    appData,
    CATEGORIES,
    addTransaction,
    addGoal,
    openBudgetModal,
    exportToPDFInfographic,
    exportToExcel,
    showToast,
    API
};
