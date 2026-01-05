/**
 * ============================================
 * APLICACIÓN PRINCIPAL - FinanzasRD AI
 * Asistente Financiero con IA (Gemini)
 * ============================================
 */
// CONFIGURACIÓN IA
const AI_CONFIG = {
    apiKey: 'AlzaSyArNrF0YNt2xFM0i3LZs41itJaGG18-t8Q', // Clave insertada
    model: 'gemini-1.5-flash'
};

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

// Datos iniciales
let appData = {
    user: {
        name: 'Juan Diaz',
        monthlyIncome: 85000,
        profile: 'Premium'
    },
    transactions: [
        { id: 1, type: 'expense', description: 'Supermercado Bravo', amount: 4500, category: 'alimentacion_supermercado', date: '2026-01-04', account: 'banreservas' },
        { id: 2, type: 'income', description: 'Sueldo Enero', amount: 75000, category: 'ingreso_sueldo', date: '2026-01-01', account: 'banreservas' }
    ],
    budgetConfigs: [
        { id: 'alimentacion', name: 'Alimentacion', limit: 15000, color: '#FF9800' },
        { id: 'transporte', name: 'Transporte', limit: 5000, color: '#2196F3' }
    ],
    goals: [
        { id: 1, name: 'Vacaciones', target: 50000, current: 18500, deadline: '2026-06-01', icon: 'plane', color: '#2196F3' }
    ]
};

let expensesChart = null;

// ============================================
// FUNCIONES AUXILIARES IA
// ============================================

async function callGeminiAI(prompt) {
    if (!AI_CONFIG.apiKey) {
        console.warn("Falta API Key");
        return null;
    }
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${AI_CONFIG.model}:generateContent?key=${AI_CONFIG.apiKey}`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        if (data.error) {
            console.error("Error API:", data.error);
            return null;
        }
        const text = data.candidates[0].content.parts[0].text;
        return text.replace(/```json/g, '').replace(/```/g, '').trim();
    } catch (error) {
        console.error("Error llamando a la IA:", error);
        return null;
    }
}

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
    updateDashboard();
    renderTransactions();
    renderBudgets();
    renderGoals();
    renderRecommendations();
    // Carga inicial (puede ser cacheada o vacía)
    initChart();
}

function loadFromStorage() {
    const saved = localStorage.getItem('finanzasrd_data');
    if (saved) appData = JSON.parse(saved);
}

function saveToStorage() {
    localStorage.setItem('finanzasrd_data', JSON.stringify(appData));
}

// ============================================
// LÓGICA PRINCIPAL (API REEMPLAZADA CON IA)
// ============================================

const API = {
    async predictCategory(description) {
        const categoriesList = Object.keys(CATEGORIES).map(k => `${k} (${CATEGORIES[k].name})`).join(', ');
        const prompt = `Actúa como clasificador financiero en RD. Transacción: "${description}". Clasifica estrictamente en UNA categoría ID de esta lista: [${categoriesList}]. Responde SOLO con el ID. Si dudas, usa 'otros_otros'.`;

        const categoryId = await callGeminiAI(prompt);
        if (categoryId && CATEGORIES[categoryId.trim()]) {
            return { category: categoryId.trim(), confidence: 0.9 };
        }
        return null;
    },
    async getRecommendations() {
        const currentMonth = new Date().toISOString().slice(0, 7);
        const txs = appData.transactions.filter(t => t.date.startsWith(currentMonth));
        const totalIngresos = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const totalGastos = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

        const prompt = `Actúa como asesor financiero sarcástico en RD. Datos mes: Ingresos ${totalIngresos}, Gastos ${totalGastos}. Genera un JSON estricto con 3 recomendaciones. Estructura array de objetos: [{"icon": "fa-icono", "title": "Titulo", "message": "Consejo corto", "action": "Boton"}]. Responde SOLO JSON.`;

        try {
            const jsonString = await callGeminiAI(prompt);
            return jsonString ? JSON.parse(jsonString) : null;
        } catch (e) {
            return null;
        }
    },
    async syncBank(accountId) { return { success: true }; }
};

// ============================================
// GRÁFICOS Y PDF (CORREGIDO)
// ============================================

function initChart() {
    const ctx = document.getElementById('expensesChart');
    if (!ctx) return;

    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyExpenses = appData.transactions.filter(t => t.type === 'expense' && t.date.startsWith(currentMonth));
    const categoryTotals = {};
    monthlyExpenses.forEach(t => {
        const catInfo = CATEGORIES[t.category];
        if (catInfo) categoryTotals[catInfo.name.split(' - ')[0]] = (categoryTotals[catInfo.name.split(' - ')[0]] || 0) + t.amount;
    });

    // Plugin fondo blanco para PDF
    const whiteBackgroundPlugin = {
        id: 'customCanvasBackgroundColor',
        beforeDraw: (chart, args, options) => {
            const { ctx } = chart;
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        }
    };
    if (expensesChart) expensesChart.destroy();
    expensesChart = new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
                data: Object.values(categoryTotals),
                backgroundColor: ['#003366', '#00A86B', '#FFD700', '#FF4444', '#9C27B0'],
                borderWidth: 0
            }]
        },
        plugins: [whiteBackgroundPlugin],
        options: { responsive: true, cutout: '65%' }
    });
}

// ============================================
// RESTO DE FUNCIONES UI (Simplificadas para funcionar)
// ============================================

function updateDashboard() {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const txs = appData.transactions.filter(t => t.date.startsWith(currentMonth));
    const ing = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const gas = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    const balanceEl = document.getElementById('total-balance');
    if (balanceEl) balanceEl.textContent = formatCurrency(ing - gas);

    const incomeEl = document.getElementById('total-income');
    if (incomeEl) incomeEl.textContent = formatCurrency(ing);

    const expenseEl = document.getElementById('total-expenses');
    if (expenseEl) expenseEl.textContent = formatCurrency(gas);
}

function renderTransactions() {
    const container = document.getElementById('transaction-list');
    if (!container) return;
    const list = [...appData.transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);
    container.innerHTML = list.map(t => {
        const cat = CATEGORIES[t.category] || { name: 'Otros', icon: 'fa-question', color: '#666' };
        return `<div class="transaction-item">
                    <div class="transaction-icon" style="color:${cat.color}"><i class="fas ${cat.icon}"></i></div>
                    <div class="transaction-details">
                        <div class="transaction-name">${t.description}</div>
                        <div class="transaction-category">${cat.name}</div>
                    </div>
                    <div class="transaction-amount ${t.type}">${formatCurrency(t.amount)}</div>
                </div>`;
    }).join('');
}

async function predictCategory() {
    const desc = document.getElementById('transaction-description').value;
    const predEl = document.getElementById('category-prediction');
    if (!predEl) return;
    if (desc.length < 3) return;

    predEl.style.display = 'flex';
    predEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analizando...';

    const result = await API.predictCategory(desc);
    if (result) {
        document.getElementById('transaction-category').value = result.category;
        predEl.innerHTML = `<i class="fas fa-robot"></i> Sugerencia: <strong>${CATEGORIES[result.category].name}</strong>`;
    } else {
        predEl.style.display = 'none';
    }
}

async function renderRecommendations() {
    const container = document.getElementById('ai-recommendations');
    if (!container) return;
    container.innerHTML = '<div style="text-align:center; padding: 20px;"><i class="fas fa-spinner fa-spin"></i> Consultando a tu asesor IA...</div>';

    const recs = await API.getRecommendations();
    if (recs && recs.length > 0) {
        container.innerHTML = recs.map(r => `
            <div class="recommendation-card">
                <div class="recommendation-header">
                    <i class="fas ${r.icon}"></i> <b>${r.title}</b>
                </div>
                <p>${r.message}</p>
                ${r.action ? `<button class="btn-sm">${r.action}</button>` : ''}
            </div>
        `).join('');
    } else {
        container.innerHTML = '<p>Sin recomendaciones por ahora.</p>';
    }
}

function renderBudgets() {
    /* Lógica de presupuestos existente o simplificada */
}
function renderGoals() {
    /* Lógica de metas existente o simplificada */
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(amount);
}

function toggleSidebar() {
    const sb = document.getElementById('sidebar');
    if (sb) sb.classList.toggle('active');
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

function openTransactionModal() {
    const modal = document.getElementById('transaction-modal');
    if (modal) modal.classList.add('active');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
}

// Función para navegar entre páginas
function navigateTo(pageId) {
    // Actualizar menú activo
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === pageId);
    });

    // Ocultar todas las vistas
    document.querySelectorAll('.view-section').forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active');
    });

    // Mostrar vista seleccionada
    const targetView = document.getElementById(`view-${pageId}`);
    if (targetView) {
        targetView.style.display = 'block';
        setTimeout(() => targetView.classList.add('active'), 10);
    }

    // En móvil, cerrar sidebar al navegar
    if (window.innerWidth <= 768) {
        toggleSidebar();
    }
}

// Listeners básicos
function setupEventListeners() {
    // Navegación Sidebar
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            navigateTo(page);
        });
    });

    document.getElementById('transaction-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const t = {
            id: Date.now(),
            type: document.getElementById('transaction-type').value,
            description: document.getElementById('transaction-description').value,
            amount: parseFloat(document.getElementById('transaction-amount').value),
            category: document.getElementById('transaction-category').value,
            date: document.getElementById('transaction-date').value,
            account: 'banreservas'
        };
        appData.transactions.unshift(t);
        saveToStorage();
        initApp();
        closeModal('transaction-modal');
        alert("Guardado!");
    });

    document.getElementById('transaction-description')?.addEventListener('blur', predictCategory);
}

// Exportar funciones globales
window.toggleSidebar = toggleSidebar;
window.toggleDarkMode = toggleDarkMode;
window.openTransactionModal = openTransactionModal;
window.closeModal = closeModal;
window.predictCategory = predictCategory;
window.navigateTo = navigateTo;
