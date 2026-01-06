/**
 * ============================================
 * APLICACIÓN PRINCIPAL - FinanzasRD AI
 * Asistente Financiero con IA (Gemini)
 * ============================================
 */

// 1. CONFIGURACIÓN IA
const AI_CONFIG = {
    apiKey: 'AIzaSyArNrF0YNt2xFM0i3LZs41itJaGG18-t8Q',
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

// Datos iniciales (Fallback)
let appData = {
    user: { name: 'Juan Diaz', monthlyIncome: 85000, profile: 'Premium' },
    transactions: [],
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
// 2. LÓGICA DE NEGOCIO CON IA REAL
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
        // Limpiar markdown para obtener solo texto/json puro
        return text.replace(/```json/g, '').replace(/```/g, '').trim();
    } catch (error) {
        console.error("Error llamando a la IA:", error);
        return null;
    }
}

const API = {
    async predictCategory(description) {
        const categoriesList = Object.keys(CATEGORIES).map(k => `${k} (${CATEGORIES[k].name})`).join(', ');
        const prompt = `Actúa como clasificador financiero experto. Analiza la transacción: "${description}". Clasifícala estrictamente en UNA de las siguientes categorías IDs: [${categoriesList}]. Responde SOLAMENTE con el ID de la categoría (ej: 'alimentacion_supermercado'). Si no estás seguro, usa 'otros_otros'. No des explicaciones, solo el ID.`;

        const categoryId = await callGeminiAI(prompt);
        if (categoryId && CATEGORIES[categoryId.trim()]) {
            return { category: categoryId.trim(), confidence: 0.9 };
        }
        return { category: 'otros_otros', confidence: 0.5 };
    },
    async getRecommendations() {
        const currentMonth = new Date().toISOString().slice(0, 7);
        const txs = appData.transactions.filter(t => t.date.startsWith(currentMonth));
        const ing = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const gas = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

        const prompt = `Actúa como un asesor financiero dominicano sarcástico pero útil. Datos del mes: Ingresos RDS$${ing}, Gastos RDS$${gas}. 
        Analiza estos datos y genera 3 consejos financieros prácticos y directos.
        Responde ESTRICTAMENTE con un array JSON válido de objetos con este formato: 
        [{"icon": "fa-icono", "title": "Título corto", "message": "Consejo sarcástico pero útil (máx 15 palabras)", "action": "Texto Botón"}].
        No incluyas markdown, solo el JSON raw.`;

        try {
            const jsonString = await callGeminiAI(prompt);
            return jsonString ? JSON.parse(jsonString) : null;
        } catch (e) {
            console.warn("Error parsing AI response", e);
            return null;
        }
    },
    async syncBank(accountId) { return { success: true }; }
};

// ============================================
// 3. DISEÑO DE GRÁFICO "FINTECH PREMIUM"
// ============================================

function initChart() {
    const ctx = document.getElementById('expensesChart');
    if (!ctx) return;

    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyExpenses = appData.transactions.filter(t => t.type === 'expense' && t.date.startsWith(currentMonth));
    const categoryTotals = {};

    if (monthlyExpenses.length === 0) {
        // Mostrar gráfico vacío o estado inicial si no hay gastos
        if (expensesChart) expensesChart.destroy();
        return;
    }

    monthlyExpenses.forEach(t => {
        const catInfo = CATEGORIES[t.category];
        if (catInfo) {
            const label = catInfo.name.split(' - ')[0];
            categoryTotals[label] = (categoryTotals[label] || 0) + t.amount;
        }
    });

    // Colores con Gradientes Verticales Modernos
    const chartDefinitions = [
        ['#4facfe', '#00f2fe'], // Blue Cyan
        ['#43e97b', '#38f9d7'], // Mint Green
        ['#fa709a', '#fee140'], // Pink Yellow
        ['#667eea', '#764ba2'], // Lavender Purple
        ['#8fd3f4', '#84fab0'], // Soft Blue
        ['#fccb90', '#d57eeb'], // Sunset
        ['#e0c3fc', '#8ec5fc']  // Soft Violet
    ];

    const ctx2d = ctx.getContext('2d');

    const getGradient = (ctx, chartArea, start, end) => {
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, start);
        gradient.addColorStop(1, end);
        return gradient;
    };

    // Plugin Texto Central (Total Gastos)
    const centerTextPlugin = {
        id: 'centerText',
        afterDraw: (chart) => {
            const { width, height, ctx } = chart;
            ctx.save();

            const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const formattedTotal = new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP', maximumFractionDigits: 0 }).format(total); // Sin decimales

            // Etiqueta "Gastos"
            ctx.font = "500 12px 'Inter', sans-serif";
            ctx.fillStyle = "#94a3b8"; // Slate 400
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            ctx.fillText("Gastos", width / 2, height / 2 - 5);

            // Monto Total
            ctx.font = "700 22px 'Inter', sans-serif";
            ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#f8fafc' : '#1e293b';
            ctx.textBaseline = "top";
            ctx.fillText(formattedTotal, width / 2, height / 2 + 5);

            ctx.restore();
        }
    };

    // Plugin Fondo Blanco para Exportación
    const whiteBackgroundPlugin = {
        id: 'customCanvasBackgroundColor',
        beforeDraw: (chart) => {
            const { ctx } = chart;
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        }
    };

    if (expensesChart) expensesChart.destroy();

    expensesChart = new Chart(ctx2d, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
                data: Object.values(categoryTotals),
                backgroundColor: function (context) {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return null;
                    // Asignar gradiente cíclicamente
                    const colorIndex = context.dataIndex % chartDefinitions.length;
                    const c = chartDefinitions[colorIndex];
                    return getGradient(ctx, chartArea, c[0], c[1]);
                },
                hoverOffset: 8,
                borderRadius: 20,
                borderWidth: 0,
                spacing: 4
            }]
        },
        plugins: [whiteBackgroundPlugin, centerTextPlugin],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '80%', // Dona fina
            layout: { padding: 10 },
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        bubbleRadius: 4,
                        font: { family: "'Inter', sans-serif", size: 12 },
                        color: document.body.classList.contains('dark-mode') ? '#cbd5e1' : '#64748b'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    padding: 12,
                    cornerRadius: 8,
                    titleFont: { family: "'Inter', sans-serif" },
                    callbacks: {
                        label: function (context) {
                            const val = new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(context.raw);
                            return ` ${context.label}: ${val}`;
                        }
                    }
                }
            }
        }
    });
}

// ============================================
// 4. FUNCIONALIDAD GENERAL Y EXPORTACIÓN
// ============================================

const startApp = () => {
    try {
        setupEventListeners();
        loadFromStorage();
        initApp();
    } catch (e) {
        console.error("Initialization error:", e);
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
} else {
    startApp();
}

// Inicialización Extendida
function initApp() {
    loadDarkModePreference();
    updateDashboard();
    renderTransactions();
    renderBudgets();
    renderGoals();
    renderRecommendations();
    renderEducation();
    initChart();

    // Chequear Onboarding
    if (!appData.user.onboardingCompleted) {
        showOnboarding();
    } else {
        // Solo si ya terminó onboarding, mostramos notificaciones proactivas
        setTimeout(checkNotifications, 2000); // Pequeño delay para no abrumar al inicio
    }
}

// --- Notification System ---
function showToast(title, message, type = 'info', actionText = null, actionCallback = null) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const iconMap = {
        'alert': 'fa-exclamation-circle text-red-500',
        'success': 'fa-check-circle text-green-500',
        'warning': 'fa-bell text-yellow-500',
        'info': 'fa-info-circle text-blue-500'
    };

    // Icono correspondiente (hack simple de clases)
    const iconClass = iconMap[type] || iconMap['info'];

    toast.innerHTML = `
        <div class="toast-close" onclick="this.parentElement.remove()">&times;</div>
        <div class="toast-header">
            <i class="fas ${iconClass.split(' ')[0]}" style="color:var(--${type === 'alert' ? 'danger' : (type === 'success' ? 'success' : 'primary')})"></i>
            <span>${title}</span>
        </div>
        <div class="toast-body">${message}</div>
        ${actionText ? `<div class="toast-action"><button class="toast-btn">${actionText}</button></div>` : ''}
    `;

    container.appendChild(toast);

    // Animar entrada
    requestAnimationFrame(() => toast.classList.add('active'));

    // Configurar acción
    if (actionText && actionCallback) {
        toast.querySelector('.toast-btn').addEventListener('click', () => {
            actionCallback();
            toast.remove();
        });
    }

    // Auto cerrar después de 8 segundos
    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 300);
        }
    }, 8000);
}

function checkNotifications() {
    const txs = appData.transactions;
    const currentMonth = new Date().toISOString().slice(0, 7);

    // 1. ALERTA DE PRESUPUESTO
    appData.budgetConfigs.forEach(b => {
        const spent = txs.filter(t => t.type === 'expense' && t.category.startsWith(b.id) && t.date.startsWith(currentMonth)).reduce((s, t) => s + t.amount, 0);
        const pct = spent / b.limit;

        if (pct >= 0.9 && pct < 1.0) { // Alerta al 90%
            showToast(
                '⚠️ Alerta de presupuesto',
                `Ya usaste el ${Math.round(pct * 100)}% de tu presupuesto de ${b.name}. Te quedan RD$${formatCurrency(b.limit - spent)} disponibles.`,
                'warning',
                'Revisar Gastos',
                () => navigateTo('dashboard')
            );
        }
    });

    // 2. FELICITACIÓN (Meta de Ahorro)
    appData.goals.forEach(g => {
        if (g.current >= g.target && !g.completedNotified) {
            showToast(
                '🎉 ¡Excelente!',
                `Alcanzaste tu meta "${g.name}". ¡Felicidades! 🎊 ¿Quieres celebrar viendo tu progreso?`,
                'success',
                'Ver Metas',
                () => navigateTo('goals')
            );
            g.completedNotified = true; // Flag temporal en memoria (o guardar en storage si queremos persistencia real)
        }
    });

    // 4. RECORDATORIO AMABLE (Inactividad)
    if (txs.length > 0) {
        const lastTxDate = new Date(txs[0].date); // Asume ordenados
        const today = new Date();
        const diffDays = Math.floor((today - lastTxDate) / (1000 * 60 * 60 * 24));

        if (diffDays > 3) {
            showToast(
                '📅 Recordatorio friendly',
                `Han pasado ${diffDays} días desde tu último registro. No hay presión, pero ¿retomamos hoy?`,
                'info',
                'Registrar Gasto',
                () => openTransactionModal('expense')
            );
        }
    }

    // 6. LLAMADA A ACCIÓN (Random proactiva si no hay otros avisos graves)
    // Simple lógica de "dado" (1 de cada 5 veces al iniciar)
    if (Math.random() > 0.8) {
        showToast(
            '🚀 Tu momento',
            `Tu coach tiene un nuevo análisis listo para ti que podría ahorrarte dinero este mes.`,
            'info',
            'Ver Análisis',
            () => { navigateTo('dashboard'); renderRecommendations(); }
        );
    }
}

// --- Onboarding Logic ---
function showOnboarding() {
    let modal = document.getElementById('onboarding-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'onboarding-modal';
        modal.className = 'modal active';
        modal.style.zIndex = '10000'; // Encima de todo
        document.body.appendChild(modal);
    }

    let step = 1;
    const userAnswers = {};

    const renderStep = () => {
        let content = '';

        // PASO 1: BIENVENIDA
        if (step === 1) {
            content = `
                <div class="text-center">
                    <h1 style="color:var(--primary); font-size:2.5em; margin-bottom:10px;">🎉</h1>
                    <h2 style="margin-bottom:20px;">¡Bienvenido/a a FinanzasRD AI!</h2>
                    <p style="font-size:1.1rem; line-height:1.6; color:var(--text-secondary); margin-bottom:20px;">
                        "El ahorro no es privación, es paz. No estamos aquí para decirte que no gastes, 
                        sino para ayudarte a gastar mejor y ahorrar estratégicamente."
                    </p>
                    <p style="margin-bottom:30px;">
                        Te ayudamos a organizar tus finanzas con métodos probados, 
                        adaptados a la realidad dominicana 🇩🇴.
                    </p>
                    <button class="btn btn-primary" onclick="window.nextOnboardingStep()">Comenzar mi viaje 🚀</button>
                </div>
            `;
        }

        // PASO 2: PERFIL (5 Preguntas)
        else if (step === 2) {
            content = `
                <h3>📋 Configuración Rápida</h3>
                <form id="onboarding-form" style="text-align:left; margin-top:20px;">
                    <div class="form-group">
                        <label>1. Ingresos mensuales aprox:</label>
                        <select id="q1" class="form-input">
                            <option value="low">Menos de RD$25,000</option>
                            <option value="mid" selected>RD$25,000 - RD$50,000</option>
                            <option value="high">RD$50,000 - RD$100,000</option>
                            <option value="ultra">Más de RD$100,000</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>2. ¿Recibes remesas?</label>
                        <select id="q2" class="form-input">
                            <option value="no">No</option>
                            <option value="yes">Sí</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>3. ¿Estado de Ahorros?</label>
                        <select id="q3" class="form-input">
                            <option value="none">No tengo nada aún</option>
                            <option value="building">Estoy construyendo (1-2 meses)</option>
                            <option value="solid">Tengo mi meta (3+ meses)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>4. ¿Tienes deudas de consumo activas?</label>
                        <select id="q4" class="form-input">
                            <option value="yes_high">Sí, me preocupan</option>
                            <option value="yes_low">Sí, pero pequeñas</option>
                            <option value="no">No, estoy limpio</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>5. Meta Principal:</label>
                        <select id="q5" class="form-input">
                            <option value="emergency">Fondo de Emergencia</option>
                            <option value="debt">Salir de Deudas</option>
                            <option value="invest">Comenzar a Invertir</option>
                        </select>
                    </div>
                    <button type="button" class="btn btn-primary" style="width:100%; margin-top:10px;" onclick="window.saveOnboardingData()">Analizar mi perfil 🧠</button>
                </form>
            `;
        }

        // PASO 3: RUTA RECOMENDADA
        else if (step === 3) {
            // Lógica simple de ruta
            let routeTitle = "";
            let routeDesc = "";
            let routeIcon = "";

            const debt = userAnswers.q4;
            const savings = userAnswers.q3;

            if (debt === 'yes_high') {
                routeTitle = "RUTA A: OPERACIÓN LIBERTAD";
                routeDesc = "Detectamos deudas de consumo. Tu prioridad absoluta será eliminar el 'impuesto a la impaciencia' usando el método Avalancha/Bola de Nieve.";
                routeIcon = "⛓️‍💥";
            } else if (savings === 'none') {
                routeTitle = "RUTA B: CONSTRUCCIÓN DE SEGURIDAD";
                routeDesc = "Sin fondo de emergencia, cualquier imprevisto es crisis. Nos enfocaremos en juntar tus primeros 3 meses de gastos.";
                routeIcon = "🛡️";
            } else {
                routeTitle = "RUTA C: CRECIMIENTO E INVERSIÓN";
                routeDesc = "Tienes bases sólidas. Es hora de optimizar tu flujo de caja y empezar a invertir en el mercado de valores RD.";
                routeIcon = "📈";
            }

            content = `
                <div class="text-center">
                    <h1 style="font-size:3em;">${routeIcon}</h1>
                    <h3 style="color:var(--primary); margin-top:10px;">${routeTitle}</h3>
                    <p style="font-size:1.1rem; margin:20px 0;">${routeDesc}</p>
                    
                    <div style="background:#f8fafc; padding:15px; border-radius:10px; text-align:left; margin-bottom:20px;">
                        <strong>🏁 TUS PRIMEROS PASOS:</strong>
                        <ul style="margin-top:10px; padding-left:20px;">
                            <li>✅ Tu perfil ha sido configurado en el cerebro de FinanzasRD AI.</li>
                            <li>✅ Hemos activado los módulos de ${debt.includes('yes') ? 'Deudas' : 'Inversión'} y Educación.</li>
                            <li>👉 Toca "Finalizar" para ver tu Dashboard personalizado.</li>
                        </ul>
                    </div>

                    <p style="font-style:italic; color:var(--text-secondary);">
                        "El primer paso hacia tus finanzas ya lo diste al venir aquí. Ahora sigues acompañado/a. Vamos."
                    </p>
                    
                    <button class="btn btn-primary" onclick="window.finishOnboarding()">¡A darle! 💪</button>
                </div>
            `;
        }

        modal.innerHTML = `
            <div class="modal-content" style="max-width:500px;">
                ${content}
            </div>
        `;
    };

    // Funciones globales para navegación del wizard
    window.nextOnboardingStep = () => { step++; renderStep(); };

    window.saveOnboardingData = () => {
        userAnswers.q1 = document.getElementById('q1').value;
        userAnswers.q2 = document.getElementById('q2').value;
        userAnswers.q3 = document.getElementById('q3').value;
        userAnswers.q4 = document.getElementById('q4').value;
        userAnswers.q5 = document.getElementById('q5').value;

        // Guardar en appData
        appData.user.profile = userAnswers.q3 === 'none' ? 'Constructor' : (userAnswers.q4.includes('yes') ? 'Guerrero Anti-Deuda' : 'Inversionista');

        // Logica para llenar datos simulados si el usuario dice "Si" a deudas
        if (userAnswers.q4.includes('yes') && appData.debts.length === 0) {
            appData.debts = [
                { id: 1, name: 'Tarjeta Crédito', balance: 45000, rate: 60, minPayment: 2500, type: 'consumption' }
            ];
        } else if (userAnswers.q4 === 'no') {
            appData.debts = []; // Limpiar deudas si dice que no tiene
        }

        step++;
        renderStep();
    };

    window.finishOnboarding = () => {
        appData.user.onboardingCompleted = true;
        saveToStorage();
        modal.remove();
        initApp(); // Recargar para aplicar cambios de perfil
    };

    renderStep();
}

// -- Utilidades UI --

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(amount);
}

function triggerDownload(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// -- Funciones de Exportación Restauradas --

async function exportToPDFInfographic() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Header
    doc.setFillColor(0, 51, 102); // Navy Blue
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("FinanzasRD AI - Reporte Financiero", 105, 25, null, null, "center");

    // Datos Generales
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(12);
    doc.text(`Fecha de Reporte: ${new Date().toLocaleDateString()}`, 20, 50);

    let yPos = 60;

    // Agregar Gráfico
    const canvas = document.getElementById('expensesChart');
    if (canvas) {
        const imgData = canvas.toDataURL("image/png");
        doc.addImage(imgData, 'PNG', 40, yPos, 130, 80);
        yPos += 90;
    }

    // Tabla de Transacciones (Simplificada)
    doc.setFontSize(16);
    doc.setTextColor(0, 51, 102);
    doc.text("Últimas Transacciones", 20, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    appData.transactions.slice(0, 5).forEach((t, i) => {
        const line = `${t.date} - ${t.description} (${t.category}) | ${formatCurrency(t.amount)}`;
        doc.text(line, 20, yPos + (i * 8));
    });

    const fileName = `FinanzasRD_Reporte_${new Date().toISOString().slice(0, 10)}.pdf`;

    // Usar FileSystem API si está disponible, sino fallback
    if (window.showSaveFilePicker) {
        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: fileName,
                types: [{ description: 'PDF File', accept: { 'application/pdf': ['.pdf'] } }]
            });
            const writable = await handle.createWritable();
            await writable.write(doc.output('blob'));
            await writable.close();
        } catch (err) {
            doc.save(fileName); // Fallback si cancela o error
        }
    } else {
        doc.save(fileName);
    }
}

function exportToExcel() {
    const data = appData.transactions.map(t => ({
        Fecha: t.date,
        Tipo: t.type === 'income' ? 'Ingreso' : 'Gasto',
        Descripción: t.description,
        Categoría: CATEGORIES[t.category]?.name || t.category,
        Monto: t.amount,
        Cuenta: t.account
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transacciones");

    const fileName = `FinanzasRD_Data_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
}

// -- UI Interaction Helpers --

function toggleSidebar() { document.getElementById('sidebar')?.classList.toggle('active'); }
function toggleDarkMode() { document.body.classList.toggle('dark-mode'); }
function openTransactionModal() { document.getElementById('transaction-modal')?.classList.add('active'); }
function openGoalModal() { document.getElementById('goal-modal')?.classList.add('active'); }
function openBudgetModal() { /* Implementar si necesario */ }
function closeModal(id) { document.getElementById(id)?.classList.remove('active'); }

// Modal Genérico para Detalles (Markdown/HTML Support)
function showDetailModal(title, content) {
    let modal = document.getElementById('detail-modal');
    if (!modal) {
        // Crear modal dinámicamente si no existe
        modal = document.createElement('div');
        modal.id = 'detail-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <h3 id="detail-modal-title" style="margin-bottom: 15px; color: var(--primary);"></h3>
                <div id="detail-modal-body" style="line-height: 1.6; color: var(--text-secondary);"></div>
                <div class="form-actions" style="margin-top: 20px;">
                    <button class="btn btn-secondary" onclick="closeModal('detail-modal')">Cerrar</button>
                    <!-- <button class="btn btn-primary" onclick="exportToPDFInfographic()">Exportar PDF</button> --> 
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    document.getElementById('detail-modal-title').textContent = title;
    document.getElementById('detail-modal-body').innerHTML = content;
    modal.classList.add('active');
}

window.showDetailModal = showDetailModal;

function navigateTo(pageId) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.page === pageId));
    document.querySelectorAll('.view-section').forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active');
    });
    const target = document.getElementById(`view-${pageId}`);
    if (target) {
        target.style.display = 'block';
        setTimeout(() => target.classList.add('active'), 10);
    }
    if (window.innerWidth <= 768) toggleSidebar();
}

// -- Data & Listeners --

function loadFromStorage() {
    const saved = localStorage.getItem('finanzasrd_data');
    if (saved) {
        appData = JSON.parse(saved);
        // Migración simple para asegurar campos nuevos
        if (!appData.debts) appData.debts = [];
        if (!appData.education) appData.education = { day: 1 };
        if (!appData.user) appData.user = { name: 'Cliente', profile: 'Ahorrador' };
    } else {
        // Datos iniciales de prueba
        appData = {
            user: { name: 'Carlos', profile: 'Empleado Privado' },
            transactions: [
                { id: 1, type: 'expense', description: 'Compra Supermercado', amount: 4500, category: 'alimentacion_supermercado', date: new Date().toISOString().slice(0, 10) },
                { id: 2, type: 'income', description: 'Nómina', amount: 85000, category: 'ingreso_sueldo', date: new Date().toISOString().slice(0, 10) }
            ],
            budgetConfigs: [],
            goals: [],
            debts: [
                { id: 1, name: 'Tarjeta Crédito', balance: 55000, rate: 60, minPayment: 3000, type: 'consumption' },
                { id: 2, name: 'Préstamo Personal', balance: 120000, rate: 22, minPayment: 4500, type: 'consumption' }
            ],
            education: { day: 1 }
        };
        saveToStorage();
    }
}
function saveToStorage() { localStorage.setItem('finanzasrd_data', JSON.stringify(appData)); }
function loadDarkModePreference() { if (localStorage.getItem('finanzasrd_dark_mode') === 'true') document.body.classList.add('dark-mode'); }

function setupEventListeners() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.addEventListener('click', (e) => {
            const item = e.target.closest('.nav-item');
            if (item) navigateTo(item.dataset.page);
        });
    }

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
        alert("Transacción Guardada");
    });

    // IA Listener
    document.getElementById('transaction-description')?.addEventListener('blur', predictCategory);
}

// -- Renderers --

function updateDashboard() {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const txs = appData.transactions.filter(t => t.date.startsWith(currentMonth));
    const ing = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const gas = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = formatCurrency(val); };
    setVal('total-balance', ing - gas);
    setVal('total-income', ing);
    setVal('total-expenses', gas);
}

function renderTransactions() {
    const list = [...appData.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    const createHTML = (t) => {
        const cat = CATEGORIES[t.category] || { name: 'Otros', icon: 'fa-question', color: '#666' };
        return `<div class="transaction-item">
            <div class="transaction-icon" style="color:${cat.color}"><i class="fas ${cat.icon}"></i></div>
            <div class="transaction-details"><div class="transaction-name">${t.description}</div><div class="transaction-category">${cat.name}</div></div>
            <div class="transaction-amount ${t.type}">${formatCurrency(t.amount)}</div>
        </div>`;
    };

    const dashList = document.getElementById('transaction-list');
    if (dashList) dashList.innerHTML = list.slice(0, 5).map(createHTML).join('');

    const fullList = document.getElementById('full-transaction-list');
    if (fullList) fullList.innerHTML = list.length ? list.map(createHTML).join('') : '<p class="text-center p-4">No hay transacciones</p>';
}

function renderBudgets() {
    const html = appData.budgetConfigs.map(b => {
        const spent = appData.transactions.filter(t => t.type === 'expense' && t.category.startsWith(b.id)).reduce((s, t) => s + t.amount, 0);
        const pct = Math.min((spent / b.limit) * 100, 100);
        return `<div class="budget-item"><div class="budget-info"><span style="color:${b.color}">${b.name}</span><span>${formatCurrency(spent)} / ${formatCurrency(b.limit)}</span></div>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%; background:${b.color}"></div></div></div>`;
    }).join('');

    ['budget-list', 'full-budget-list'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html || '<p>No hay presupuestos</p>';
    });
}

function renderGoals() {
    const html = appData.goals.map(g => {
        const pct = Math.min((g.current / g.target) * 100, 100);
        return `<div class="goal-card">
            <div class="goal-icon" style="color:${g.color}; background:${g.color}20"><i class="fas fa-${g.icon}"></i></div>
            <div class="goal-progress" style="width:100%"><h4>${g.name}</h4><div class="progress-bar"><div class="progress-fill" style="width:${pct}%; background:${g.color}"></div></div>
            <div class="goal-stats"><span>${formatCurrency(g.current)}</span><span>${Math.round(pct)}%</span></div></div>
        </div>`;
    }).join('');

    ['goals-list', 'full-goals-list'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html || '<p>No hay metas</p>';
    });
}

// Nueva función de Educación Financiera
async function renderEducation() {
    // Inyectar contenedor si no existe
    let eduContainer = document.getElementById('education-section');
    if (!eduContainer) {
        const dashView = document.getElementById('view-dashboard');
        if (dashView) {
            eduContainer = document.createElement('div');
            eduContainer.id = 'education-section';
            eduContainer.className = 'dashboard-card';
            eduContainer.style.marginTop = '20px';
            eduContainer.style.borderLeft = '4px solid #8b5cf6'; // Morado educativo
            // Insertar antes del final del dashboard
            dashView.appendChild(eduContainer);
        }
    }

    if (!eduContainer) return;

    eduContainer.innerHTML = '<div class="text-center p-4"><i class="fas fa-graduation-cap fa-spin"></i> Preparando la clase de hoy...</div>';

    // Obtener lección del día
    const currentDay = appData.education?.day || 1;
    const lesson = await API.getFinancialLesson(currentDay);

    if (lesson) {
        eduContainer.innerHTML = `
            <div class="education-header" style="display:flex; align-items:center; justify-content:space-between; margin-bottom:15px;">
                <h3 style="margin:0; color:#4b5563;"><i class="fas fa-chalkboard-teacher"></i> Escuela FinanzasRD</h3>
                <span style="background:#8b5cf6; color:white; padding:4px 10px; border-radius:15px; font-size:0.8em;">Día ${currentDay}/21</span>
            </div>
            <div class="lesson-content">
                <h4 style="color:#1f2937; margin-bottom:10px;">${lesson.title}</h4>
                <p style="color:#4b5563; font-style:italic; margin-bottom:15px;">"${lesson.question}"</p>
                <button class="btn btn-sm btn-primary" onclick="showDetailModal('${lesson.title}', '${lesson.content.replace(/'/g, "\\'")}')">
                    <i class="fas fa-book-open"></i> Tomar Lección
                </button>
            </div>
        `;
    }
}

async function renderRecommendations() {
    const container = document.getElementById('ai-recommendations');
    const fullContainer = document.getElementById('full-recommendations-list');
    if (!container) return;

    container.innerHTML = '<div class="text-center p-4"><i class="fas fa-spinner fa-spin"></i> Coach Unificado analizando tu salario...</div>';

    const recs = await API.getRecommendations();
    // Preparar el HTML seguro para escaparse de inyecciones simples
    // Pero asumiendo que Gemini devuelve HTML confiable para tablas

    // Función global para abrir detalles (necesita estar en window scope o usar event delegation)
    window.handleRecAction = (index) => {
        if (!recs || !recs[index]) return;
        const r = recs[index];
        showDetailModal(r.title, r.detail || r.message);
    };

    const html = (recs && recs.length) ? recs.map((r, i) => `
        <div class="recommendation-card" onclick="handleRecAction(${i})" style="cursor: pointer; transition: transform 0.2s;">
            <div class="recommendation-header"><i class="fas ${r.icon}"></i> <b>${r.title}</b></div>
            <p style="font-size: 0.9rem; margin-top: 5px;">${r.message}</p>
            <div style="margin-top: 10px; font-size: 0.8rem; color: var(--primary); font-weight: 500;">
                <i class="fas fa-eye"></i> Ver Desglose
            </div>
        </div>`).join('') : '<p>Todo bajo control.</p>';

    container.innerHTML = html;
    if (fullContainer) fullContainer.innerHTML = html;
}

// Exportar globalmente
window.toggleSidebar = toggleSidebar;
window.toggleDarkMode = toggleDarkMode;
window.openTransactionModal = openTransactionModal;
window.closeModal = closeModal;
window.predictCategory = API.predictCategory; // Exponer vía API obj
window.exportToPDFInfographic = exportToPDFInfographic;
window.exportToExcel = exportToExcel;
window.navigateTo = navigateTo;
window.openGoalModal = openGoalModal;
window.openBudgetModal = openBudgetModal;

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

const startApp = () => {
    // Configurar listeners primero para garantizar navegación
    try {
        setupEventListeners();
    } catch (e) {
        console.error("Error setting up listeners:", e);
    }

    try {
        loadFromStorage();
        initApp();
    } catch (e) {
        console.error("Critical app error:", e);
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
} else {
    startApp();
}

function initApp() {
    try { loadDarkModePreference(); } catch (e) { console.warn("Dark mode init failed", e); }
    try { updateDashboard(); } catch (e) { console.warn("Dashboard init failed", e); }
    try { renderTransactions(); } catch (e) { console.warn("Tx init failed", e); }
    try { renderBudgets(); } catch (e) { console.warn("Budgets init failed", e); }
    try { renderGoals(); } catch (e) { console.warn("Goals init failed", e); }
    try { renderRecommendations(); } catch (e) { console.warn("Recs init failed", e); }
    try { initChart(); } catch (e) { console.warn("Chart init failed", e); }
}

function loadDarkModePreference() {
    const isDark = localStorage.getItem('finanzasrd_dark_mode') === 'true';
    if (isDark) document.body.classList.add('dark-mode');
}

// --- Contexto Unificado ---
function buildUserContext() {
    const today = new Date();
    const currentMonth = today.toISOString().slice(0, 7);
    const txs = appData.transactions;
    const monthTxs = txs.filter(t => t.date.startsWith(currentMonth));

    // 1. Perfil Básico
    const profile = {
        name: appData.user.name,
        income: monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
        profileType: appData.user.profile,
        remittances: appData.user.remittances || false
    };

    // 2. Desglose Gastos
    const expenses = {};
    monthTxs.filter(t => t.type === 'expense').forEach(t => {
        const cat = CATEGORIES[t.category]?.name || 'Otros';
        expenses[cat] = (expenses[cat] || 0) + t.amount;
    });
    const totalExpenses = Object.values(expenses).reduce((a, b) => a + b, 0);

    // 3. Salud Financiera
    const totalSaved = appData.goals.reduce((s, g) => s + g.current, 0);
    const monthsCovered = totalSaved / (totalExpenses || 1);
    const savingsRate = profile.income > 0 ? ((profile.income - totalExpenses) / profile.income) * 100 : 0;

    // 4. Deudas
    const debts = appData.debts || [];
    const totalDebt = debts.reduce((s, d) => s + d.balance, 0);

    // 5. Comportamiento
    const behavior = {
        userSince: appData.user.accountCreated || today.toISOString(),
        streak: appData.user.streak || 1,
        lastInteraction: appData.user.lastInteraction || today.toISOString()
    };

    return `
    [PERFIL BÁSICO]
    • Nombre: ${profile.name}
    • Ingresos Mes: RD$${formatCurrency(profile.income)}
    • Perfil: ${profile.profileType}
    • Recibe Remesas: ${profile.remittances ? 'SÍ' : 'NO'}

    [BALANCE ACTUAL]
    • Efectivo Disp (Est): RD$${formatCurrency(profile.income - totalExpenses)}
    • Ahorro Total: RD$${formatCurrency(totalSaved)}
    • Deuda Total: RD$${formatCurrency(totalDebt)}

    [GASTOS ESTE MES (Top 5)]
    ${Object.entries(expenses).sort(([, a], [, b]) => b - a).slice(0, 5).map(([k, v]) => `- ${k}: RD$${formatCurrency(v)}`).join('\n')}
    • Total Gastos: RD$${formatCurrency(totalExpenses)}

    [SALUD FINANCIERA]
    • Fondo Emergencia: ${monthsCovered.toFixed(1)} meses cubiertos
    • Tasa Ahorro: ${savingsRate.toFixed(1)}%

    [COMPORTAMIENTO]
    • Usuario desde: ${behavior.userSince.slice(0, 10)}
    • Racha Actual: ${behavior.streak} días
    `;
}

function loadFromStorage() {
    const saved = localStorage.getItem('finanzasrd_data');
    if (saved) {
        appData = JSON.parse(saved);
        if (!appData.debts) appData.debts = [];
        if (!appData.education) appData.education = { day: 1 };
        if (!appData.recurring) appData.recurring = [];

        // Migración User
        if (!appData.user) appData.user = { name: 'Cliente', profile: 'Ahorrador' };
        if (appData.user.onboardingCompleted === undefined) appData.user.onboardingCompleted = false;
        if (appData.user.remittances === undefined) appData.user.remittances = false;
        if (appData.user.streak === undefined) appData.user.streak = 1;
        if (appData.user.accountCreated === undefined) appData.user.accountCreated = new Date().toISOString();

        // Actualizar Streak si es nuevo día
        const lastLogin = appData.user.lastInteraction ? new Date(appData.user.lastInteraction).toDateString() : null;
        const today = new Date().toDateString();
        if (lastLogin !== today) {
            appData.user.streak = (appData.user.streak || 0) + 1;
            appData.user.lastInteraction = new Date().toISOString();
            saveToStorage();
        }

    } else {
        const today = new Date().toISOString();
        appData = {
            user: {
                name: 'Carlos',
                profile: 'Empleado Privado',
                onboardingCompleted: false,
                remittances: false,
                streak: 1,
                accountCreated: today,
                lastInteraction: today
            },
            transactions: [
                { id: 1, type: 'expense', description: 'Compra Supermercado', amount: 4500, category: 'alimentacion_supermercado', date: today.slice(0, 10) },
                { id: 2, type: 'income', description: 'Nómina', amount: 85000, category: 'ingreso_sueldo', date: today.slice(0, 10) }
            ],
            budgetConfigs: [],
            goals: [],
            debts: [
                { id: 1, name: 'Tarjeta Crédito', balance: 55000, rate: 60, minPayment: 3000, type: 'consumption' },
                { id: 2, name: 'Préstamo Personal', balance: 120000, rate: 22, minPayment: 4500, type: 'consumption' }
            ],
            recurring: [
                { name: 'Alquiler', amount: 15000, type: 'expense', day: 5 },
                { name: 'Internet', amount: 2000, type: 'expense', day: 10 },
                { name: 'Nómina Q1', amount: 42500, type: 'income', day: 15 },
                { name: 'Nómina Q2', amount: 42500, type: 'income', day: 30 }
            ],
            education: { day: 1 }
        };
        saveToStorage();
    }
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
        const prompt = `Actúa como clasificador financiero experto. Analiza la transacción: "${description}". Clasifícala estrictamente en UNA de las siguientes categorías IDs: [${categoriesList}]. Responde SOLAMENTE con el ID de la categoría (ej: 'alimentacion_supermercado'). Si no estás seguro, usa 'otros_otros'. No des explicaciones, solo el ID.`;

        const categoryId = await callGeminiAI(prompt);
        if (categoryId && CATEGORIES[categoryId.trim()]) {
            return { category: categoryId.trim(), confidence: 0.9 };
        }
        return { category: 'otros_otros', confidence: 0.5 };
    },

    async getFinancialLesson(day) {
        // ... (Lesson Logic preserved) ...
        const prompt = `
        Eres el "Profesor Financiero" de FinanzasRD AI.
        Curso: "Inversión en RD: De Ahorrador a Inversionista en 21 Días".
        Lección Actual: DÍA ${day}.
        GENERA EL CONTENIDO PARA EL DÍA ${day}.
        SI ES DÍA 1, USA ESTE CONTENIDO EXACTO:
        Tema: "Conceptos Básicos de Fondos de Inversión"
        Pregunta: "¿Sabías que en RD puedes invertir desde RD$500?"
        Contenido HTML: Explicación de qué es un fondo, Tipos (Mercado Dinero, Renta Fija, Variable) en RD, Recordatorio Números Verdes (Inversión es Techo, no Cimiento) y Tarea (Investigar un fondo en Banreservas/Popular).
        FORMATO JSON RESPUESTA: { "day": ${day}, "title": "...", "question": "...", "content": "HTML..." }
        Responde SOLO JSON RAW.
        `;
        try {
            const jsonString = await callGeminiAI(prompt);
            return jsonString ? JSON.parse(jsonString) : null;
        } catch (e) { return null; }
    },

    // Extensión de API para soportar TODOS los módulos con Contexto Unificado
    async getRecommendations() {
        const userContext = buildUserContext(); // <--- NUEVO: Contexto Rico

        // --- DETECCIÓN PREVIA (Subs, Flow, Debts) ---
        // (Reutilizando variables locales para lógica de reglas duras)
        const currentMonth = new Date().toISOString().slice(0, 7);
        const txs = appData.transactions.filter(t => t.date.startsWith(currentMonth));
        const ing = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const gas = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

        const debts = window.appData.debts || [];
        const totalSaved = window.appData.goals.reduce((sum, g) => sum + g.current, 0);

        // Subs Logic
        const subKeywords = ['netflix', 'spotify', 'disney', 'hbo', 'youtube', 'prime', 'apple', 'gym', 'patreon'];
        const subs = appData.transactions.filter(t => t.type === 'expense' && subKeywords.some(k => t.description.toLowerCase().includes(k)));
        const totalSubs = subs.reduce((s, t) => s + t.amount, 0);
        const subsList = [...new Set(subs.map(t => t.description))].join(', ');

        // Flow Logic (Simplified for prompt context injection above)
        const recurring = window.appData.recurring || [];
        // [Logic preserved in memory but simplified for prompt to avoid huge string duplication, 
        // relying on the AI to interpret the "Balance Actual" and "Gastos" from context]

        const systemPrompt = `
    Eres el "Coach Financiero Unificado" de FinanzasRD AI, un asistente especializado en finanzas personales para República Dominicana 🇩🇴.
    
    ## TU IDENTIDAD (Números Verdes + Planifestord)
    - **Tono:** Empático, firme, cercano pero profesional. Motivas como un coach ("¡Vamos!", "Tu paz vale más").
    - **Filosofía:** "Números Verdes" (Priorizar solvencia y flujo de caja).
    - **Estilo:** Educativo. Cada interacción enseña algo. Celebras logros.
    
    ## REGLAS DE ORO
    1. **Primero los números:** Basa todo en el CONTEXTO DEL USUARIO provisto.
    2. **Contexto RD:** Usa precios y realidad dominicana (Inflación, salarios ~25k, cultura del "fiao").
    3. **Acción 24h:** Cada consejo debe tener un "Próximo Paso Hoy".
    
    ## ESTRUCTURA DE ANÁLISIS (Mental)
    1. Diagnóstico: ¿Cubre gastos fijos? (Solvencia).
    2. Número Verde: Diferencia Ingresos - Compromisos.
    3. Recomendación: ¿Deuda? (Bola Nieve). ¿Sin Ahorro? (Fondo Emergencia).

    ## CONTEXTO ACTUAL DEL USUARIO:
    ${userContext}
    
    [DATOS DETECTADOS]
    • Suscripciones: ${subsList || 'Ninguna'} (Total: RD$${formatCurrency(totalSubs)})
    • Pagos Recurrentes: ${recurring.length}
    • Proyección Flujo: ${forecast.map(f => `${f.week}: ${f.balance}`).join(' | ')}

    ## TU TAREA: Generar Plan de Acción (JSON)
    Genera un JSON con 3 tarjetas prioritarias.
    
    IMPORTANTE: El campo "detail" DEBE contener tu respuesta completa y rica en formato HTML, siguiendo tu estructura de "Diagnóstico -> Número Verde -> Recomendación -> Próximo Paso". Usa emojis y negritas <b>.

    ESTRUCTURA JSON REQUERIDA:
    [
        { 
            "icon": "fa-...", 
            "title": "TÍTULO (Ej: Auditoría Salud)", 
            "message": "Resumen corto (1-2 lineas) para la tarjeta.", 
            "detail": "<h3>📊 Diagnóstico</h3><p>...</p><h3>💚 Tu Número Verde</h3><p>...</p><h3>🚀 Próximo Paso Hoy</h3><p>...</p>" 
        },
        ...
    ]
    
    Responde SOLO JSON RAW.
    `;

        try {
            const jsonString = await callGeminiAI(systemPrompt);
            return jsonString ? JSON.parse(jsonString) : null;
        } catch (e) { return null; }
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

    // Colores base para gradientes (Inicio, Fin)
    const chartColors = [
        ['#4facfe', '#00f2fe'], // Azul Cyan
        ['#43e97b', '#38f9d7'], // Verde Menta
        ['#fa709a', '#fee140'], // Rosa Amarillo
        ['#667eea', '#764ba2'], // Lavanda Purple
        ['#ff9a9e', '#fecfef'], // Pastel Pink
        ['#a18cd1', '#fbc2eb'], // Purple Pink
        ['#8fd3f4', '#84fab0']  // Blue Green
    ];

    const ctx2d = ctx.getContext('2d');

    // Generador de gradientes verticales
    const getGradient = (ctx, chartArea, colorStart, colorEnd) => {
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, colorStart);
        gradient.addColorStop(1, colorEnd);
        return gradient;
    };

    // Plugin Texto Central (Corregido para Z-Index)
    const centerTextPlugin = {
        id: 'centerText',
        afterDraw: (chart) => {
            const { width, height, ctx } = chart;
            ctx.restore();

            const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const formattedTotal = formatCurrency(total).split('.')[0];

            // Texto "Gastos"
            ctx.font = "500 12px 'Inter', sans-serif";
            ctx.fillStyle = "#94a3b8";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("Gastos", width / 2, height / 2 - 12);

            // Texto Monto
            ctx.font = "700 20px 'Inter', sans-serif";
            ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#ffffff' : '#1e293b';
            ctx.fillText(formattedTotal, width / 2, height / 2 + 14);
            ctx.save();
        }
    };

    // Plugin fondo blanco para PDF (Mantenido)
    const whiteBackgroundPlugin = {
        id: 'customCanvasBackgroundColor',
        beforeDraw: (chart) => {
            const { ctx } = chart;
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        }
    };

    if (expensesChart) expensesChart.destroy();

    expensesChart = new Chart(ctx2d, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
                data: Object.values(categoryTotals),
                backgroundColor: function (context) {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return null; // Esperar a que se dibuje el área

                    // Mapear colores a gradientes
                    return chartColors.map(c => getGradient(ctx, chartArea, c[0], c[1]));
                },
                hoverOffset: 8, // Reducido para evitar superposición
                borderRadius: 20, // Bordes muy redondeados
                borderWidth: 0,
                spacing: 3 // Espacio entre secciones
            }]
        },
        plugins: [whiteBackgroundPlugin, centerTextPlugin],
        options: {
            responsive: true,
            cutout: '75%', // Anillo más balanceado
            maintainAspectRatio: false,
            layout: {
                padding: 10
            },
            plugins: {
                legend: {
                    position: 'right', // Leyenda a la derecha
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        boxWidth: 8,
                        padding: 15,
                        font: {
                            family: "'Inter', sans-serif",
                            size: 11
                        },
                        color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#64748b'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function (context) {
                            return ` ${context.label}: ${formatCurrency(context.raw)}`;
                        }
                    }
                }
            }
        }
    });

}

// ============================================
// RESTO DE FUNCIONES UI (Simplificadas para funcionar)
// ============================================

// ============================================
// 5. VIEW CONTROLLERS (Manejo de Vistas)
// ============================================

function navigateTo(pageId) {
    // 1. Actualizar Menú
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === pageId);
    });

    // 2. Actualizar Secciones
    document.querySelectorAll('.view-section').forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });

    const target = document.getElementById(`view-${pageId}`);
    if (target) {
        target.style.display = 'block';
        setTimeout(() => target.classList.add('active'), 10);

        // 3. Ejecutar lógica específica de la vista
        if (pageId === 'dashboard') updateDashboard();
        else if (pageId === 'transactions') renderTransactions();
        else if (pageId === 'coach') renderCoachView();
        else if (pageId === 'planning') renderPlanningView();
        else if (pageId === 'debts') renderDebtsView();
        else if (pageId === 'reports') renderReportsView();
    }

    if (window.innerWidth <= 768) {
        document.getElementById('sidebar')?.classList.remove('active'); // Close sidebar on mobile
    }
}

// ============================================
// 6. DASHBOARD MODULE (Lógica Específica)
// ============================================

function calculatePeriodStats(year, month) {
    const period = `${year}-${String(month).padStart(2, '0')}`;
    const txs = appData.transactions.filter(t => t.date.startsWith(period));

    const income = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    return {
        income,
        expenses,
        cashFlow: income - expenses,
        savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0
    };
}

function updateDashboard() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    const prevDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const prevYear = prevDate.getFullYear();
    const prevMonth = prevDate.getMonth() + 1;

    // 1. Calcular Stats Actuales y Anteriores
    const currentStats = calculatePeriodStats(currentYear, currentMonth);
    const prevStats = calculatePeriodStats(prevYear, prevMonth);

    // 2. Calcular Balance Total (Acumulado Histórico)
    const totalBalance = appData.transactions.reduce((acc, t) => {
        return t.type === 'income' ? acc + t.amount : acc - t.amount;
    }, 0);

    // 3. Renderizar KPIs con Variaciones
    renderKPI('total-balance', totalBalance, null, true); // Balance Accumulado
    renderKPI('total-income', currentStats.income, prevStats.income);
    renderKPI('total-expenses', currentStats.expenses, prevStats.expenses, false); // False = Menos es mejor
    renderKPI('savings-rate', currentStats.savingsRate, prevStats.savingsRate, true, true); // true = porcentaje

    // 4. Renderizar Gráficos y Widgets
    initChart(); // Gráfico de Dona (Gastos por Categoría)
    renderTrendChart(); // Nuevo Gráfico de Línea (6 meses)
    renderInsightWidget(); // Insight del Día
}

function renderKPI(elementId, currentValue, prevValue, higherIsBetter = true, isPercentage = false) {
    const el = document.getElementById(elementId);
    if (!el) return;

    // Formatear Valor
    el.innerText = isPercentage
        ? `${Math.round(currentValue)}%`
        : formatCurrency(currentValue);

    // Calcular Variación y Trend (Si hay dato previo)
    if (prevValue !== null && prevValue !== undefined) {
        const card = el.closest('.stat-card');
        if (!card) return;

        let diff = currentValue - prevValue;
        let pctChange = prevValue !== 0 ? (diff / prevValue) * 100 : 0;

        let isGood = higherIsBetter ? diff >= 0 : diff <= 0;

        const trendEl = card.querySelector('.stat-trend');
        if (trendEl) {
            trendEl.className = `stat-trend ${isGood ? 'up' : 'down'}`;
            trendEl.innerHTML = `
                <i class="fas fa-arrow-${diff >= 0 ? 'up' : 'down'}"></i>
                <span>${Math.abs(Math.round(pctChange))}%</span>
            `;
            if (!isGood) trendEl.style.color = 'var(--danger)';
            else trendEl.style.color = 'var(--success)';
        }
    }
}

// Gráfico de Tendencias (6 Meses)
let trendChartInstance = null; // Global instance tracker
function renderTrendChart() {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;

    // Destruir instancia previa si existe
    if (trendChartInstance) {
        trendChartInstance.destroy();
    }

    const labels = [];
    const incomeData = [];
    const expenseData = [];

    const today = new Date();
    for (let i = 5; i >= 0; i--) { // Last 6 months including current
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        labels.push(date.toLocaleString('es-DO', { month: 'short', year: '2-digit' }));

        const stats = calculatePeriodStats(year, month);
        incomeData.push(stats.income);
        expenseData.push(stats.expenses);
    }

    trendChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Ingresos',
                    data: incomeData,
                    borderColor: '#43e97b', // Verde Menta
                    backgroundColor: 'rgba(67, 233, 123, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                },
                {
                    label: 'Gastos',
                    data: expenseData,
                    borderColor: '#fa709a', // Rosa
                    backgroundColor: 'rgba(250, 112, 154, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function renderKPI(elementId, currentValue, prevValue, higherIsBetter = true, isPercentage = false) {
    const el = document.getElementById(elementId);
    if (!el) return;

    // Formatear Valor
    el.innerText = isPercentage
        ? `${Math.round(currentValue)}%`
        : formatCurrency(currentValue);

    // Calcular Variación y Trend (Si hay dato previo)
    if (prevValue !== null && prevValue !== undefined) {
        const card = el.closest('.stat-card');
        if (!card) return;

        let diff = currentValue - prevValue;
        let pctChange = prevValue !== 0 ? (diff / prevValue) * 100 : 0;

        // Ajustar lógica de "Mejor/Peor"
        // Si higherIsBetter=false (ej: Gastos), un aumento (diff > 0) es malo (red)
        let isGood = higherIsBetter ? diff >= 0 : diff <= 0;

        const trendEl = card.querySelector('.stat-trend');
        if (trendEl) {
            trendEl.className = `stat-trend ${isGood ? 'up' : 'down'}`; // up/down visual style classes
            trendEl.innerHTML = `
                <i class="fas fa-arrow-${diff >= 0 ? 'up' : 'down'}"></i>
                <span>${Math.abs(Math.round(pctChange))}%</span>
            `;
            // Color hack: .up usually green, .down usually red in CSS. 
            // We might need to override based on isGood logic if CSS is rigid.
            // Asumiendo que CSS tiene .stat-trend.up { color: green } y .down { color: red }
            // Si el resultado es "malo" pero la flecha es arriba (ej: subieron gastos),
            // necesitamos que sea roja.
            if (!isGood) trendEl.style.color = 'var(--danger)';
            else trendEl.style.color = 'var(--success)';
        }
    }
}

// Gráfico de Tendencias (6 Meses)
function renderTrendChart() {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;

    if (trendChartInstance) {
        trendChartInstance.destroy();
    }

    const labels = [];
    const incomeData = [];
    const expenseData = [];

    const today = new Date();
    for (let i = 5; i >= 0; i--) { // Last 6 months including current
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        labels.push(date.toLocaleString('es-DO', { month: 'short', year: '2-digit' }));

        const stats = calculatePeriodStats(year, month);
        incomeData.push(stats.income);
        expenseData.push(stats.expenses);
    }

    trendChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Ingresos',
                    data: incomeData,
                    borderColor: '#43e97b', // Verde Menta
                    backgroundColor: 'rgba(67, 233, 123, 0.2)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 3,
                    pointHoverRadius: 6
                },
                {
                    label: 'Gastos',
                    data: expenseData,
                    borderColor: '#fa709a', // Rosa
                    backgroundColor: 'rgba(250, 112, 154, 0.2)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 3,
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            family: "'Inter', sans-serif",
                            size: 12
                        },
                        color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#64748b'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function (context) {
                            return ` ${context.dataset.label}: ${formatCurrency(context.raw)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: document.body.classList.contains('dark-mode') ? '#94a3b8' : '#64748b'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                    },
                    ticks: {
                        callback: function (value) {
                            return formatCurrency(value);
                        },
                        color: document.body.classList.contains('dark-mode') ? '#94a3b8' : '#64748b'
                    }
                }
            }
        }
    });
}

// Widget Insight del Día (Mock Simplificado o Real)
async function renderInsightWidget() {
    const container = document.getElementById('ai-recommendations');
    if (!container) return;

    // Si ya tenemos recomendaciones cacheadas recientes, usarlas
    let recs = appData.latestRecommendations;

    // Si no hay o son viejas (ej: de otro día), llamar IA (Simulado por ahora para velocidad)
    if (!recs || recs.length === 0) {
        // Fallback rápido
        container.innerHTML = `
           <div class="insight-card">
               <div class="insight-icon"><i class="fas fa-lightbulb"></i></div>
               <div class="insight-content">
                   <h4>Insight del Día</h4>
                   <p>Tu gasto en "Comida Rápida" bajó un 10% vs el mes pasado. ¡Sigue así!</p>
               </div>
           </div>
       `;
    } else {
        // Renderizar la primera recomendación como "Insight Principal"
        const r = recs[0];
        container.innerHTML = `
           <div class="insight-card" onclick="window.showDetailModal('${r.title}', '${r.detail.replace(/'/g, "\\'")}')">
               <div class="insight-icon"><i class="fas ${r.icon}"></i></div>
               <div class="insight-content">
                   <h4>${r.title}</h4>
                   <p>${r.message}</p>
               </div>
               <i class="fas fa-chevron-right" style="color:#ccc;"></i>
           </div>
       `;
    }
}

// ============================================
// 7. COACH AI VIEW & CHAT MODULE
// ============================================

function renderCoachView() {
    // 1. Populate Sidebar Stats
    renderCoachSidebar();

    // 2. Populate Quick Actions based on context
    renderQuickActions();

    // 3. Scroll Chat
    const chatContainer = document.getElementById('chat-messages');
    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;

    // 4. Update Header Status
    // (Optional: Could show 'Online' or 'Thinking...')
}

function renderCoachSidebar() {
    const today = new Date();
    const stats = calculatePeriodStats(today.getFullYear(), today.getMonth() + 1);

    // Stats Basics
    document.getElementById('coach-income').textContent = formatCurrency(stats.income);
    document.getElementById('coach-expenses').textContent = formatCurrency(stats.expenses);
    const balEl = document.getElementById('coach-balance');
    balEl.textContent = formatCurrency(stats.cashFlow);
    balEl.style.color = stats.cashFlow >= 0 ? 'var(--success)' : 'var(--danger)';

    // Numero Verde (Ingresos - Gastos Fijos - Ahorro Meta)
    // Simplificación MVP: Ingresos - Gastos Totales
    // TODO: Refinar con logica real de "Numeros Verdes"
    document.getElementById('coach-green-number').textContent = formatCurrency(Math.max(0, stats.cashFlow));

    // Sugerencias Dinámicas
    const suggestionsList = document.getElementById('coach-suggestions');
    if (suggestionsList) {
        let items = [];

        if (stats.expenses > stats.income * 0.8) {
            items.push({ icon: 'fa-exclamation-triangle', text: 'Gastos altos este mes', action: 'Analizar Gastos' });
        }
        if (appData.debts.length > 0) {
            items.push({ icon: 'fa-link', text: 'Tienes deudas activas', action: 'Revisar Deudas' });
        }

        suggestionsList.innerHTML = items.map(item => `
            <div class="suggestion-card" onclick="setInputAndSend('${item.action}')" style="background:white; padding:10px; border-radius:8px; margin-bottom:10px; border:1px solid #e2e8f0; cursor:pointer; transition:transform 0.2s;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <i class="fas ${item.icon}" style="color:var(--primary);"></i>
                    <span style="font-size:0.9rem;">${item.text}</span>
                </div>
            </div>
        `).join('');
    }
}

function renderQuickActions() {
    const panel = document.getElementById('quick-actions-panel');
    if (!panel) return;

    let actions = [
        "💰 Balance General",
        "📉 Mis Gastos",
        "🎯 Progreso Metas"
    ];

    if (appData.debts.length > 0) actions.push("⛓️‍💥 Estado Deudas");

    panel.innerHTML = actions.map(act => `
        <button onclick="setInputAndSend('${act}')" style="background:#f1f5f9; border:none; padding:8px 15px; border-radius:20px; font-size:0.85rem; color:var(--text-secondary); cursor:pointer; transition:background 0.2s;">
            ${act}
        </button>
    `).join('');
}

function setInputAndSend(text) {
    const input = document.getElementById('chat-input');
    if (input) {
        input.value = text;
        sendChatMessage();
    }
}

async function sendChatMessage() {
    const inputEl = document.getElementById('chat-input');
    const message = inputEl.value.trim();
    if (!message) return;

    // 1. Mostrar mensaje usuario
    appendMessage(message, 'user');
    inputEl.value = '';

    // 2. Loading
    const loadingId = appendMessage('...', 'ai', true);

    // 3. Contexto
    const context = buildUserContext();

    // 4. Prompt
    const systemPrompt = `
        Eres "FinanzasRD AI", coach financiero dominicano (Estilo Planifestord).
        
        DATOS USUARIO:
        ${JSON.stringify(context)}
        
        INSTRUCCIONES:
        - Si preguntan por 'Balance General', resume ingresos vs gastos.
        - Si preguntan por 'Deudas', analiza su lista de deudas.
        - Sé empático pero directo.
        
        PREGUNTA: "${message}"
    `;

    // 5. API Call
    const response = await callGeminiAI(systemPrompt);

    removeMessage(loadingId);

    if (response) {
        appendMessage(response, 'ai');
        // Actualizar datos por si la IA sugirió cambios (simulado)
        renderCoachSidebar();
    } else {
        appendMessage('Error de conexión. Intenta de nuevo.', 'ai');
    }
}

function buildUserContext() {
    const today = new Date();
    const currentStats = calculatePeriodStats(today.getFullYear(), today.getMonth() + 1);

    return {
        profile: appData.user,
        currentMonth: {
            income: currentStats.income,
            expenses: currentStats.expenses,
            balance: currentStats.cashFlow,
            savingsRate: currentStats.savingsRate.toFixed(1) + '%'
        },
        debts: appData.debts || [],
        goals: appData.goals || [],
        recentTransactions: appData.transactions.slice(0, 5)
    };
}

function appendMessage(text, sender, isLoading = false) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender} ${isLoading ? 'loading-msg' : ''}`;
    msgDiv.id = isLoading ? `msg-${Date.now()}` : '';

    // Styles Base
    msgDiv.style.marginBottom = '15px';
    msgDiv.style.display = 'flex';
    msgDiv.style.flexDirection = 'column';
    msgDiv.style.alignItems = sender === 'user' ? 'flex-end' : 'flex-start';

    const bubbleStyle = sender === 'user'
        ? 'background: #e2e8f0; color: #1e293b; border-radius: 15px 15px 0 15px;'
        : 'background: #d1fae5; color: #064e3b; border-radius: 15px 15px 15px 0;'; // Emerald green 100

    let content = text;
    if (isLoading) {
        content = '<i class="fas fa-ellipsis-h fa-beat-fade"></i> Coach escribiendo...';
    } else {
        // Markdown parsing simple
        content = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
    }

    const time = new Date().toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' });

    msgDiv.innerHTML = `
        <div class="msg-bubble" style="padding: 12px 18px; max-width: 80%; ${bubbleStyle} box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
            ${content}
        </div>
        <div class="msg-meta" style="font-size: 0.7rem; color: #94a3b8; margin-top: 5px; margin-left: 5px;">
            ${isLoading ? '' : time}
        </div>
    `;

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;

    return msgDiv.id;
}

function removeMessage(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

// Enter Key Listener for Chat
document.getElementById('chat-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChatMessage();
});
// ============================================
// 8. PLANNING VIEW MODULE
// ============================================

function renderPlanningView() {
    renderEmergencyFund();
    renderGoals(); // Renders to #full-goals-list
    renderBudgets(); // Renders to #full-budget-list
}

function renderEmergencyFund() {
    const container = document.getElementById('emergency-widget');
    const labelMonths = document.getElementById('emergency-months');
    if (!container) return;

    // 1. Calcular Gastos Mensuales Promedio (Estimado simple: mes actual)
    const today = new Date();
    const stats = calculatePeriodStats(today.getFullYear(), today.getMonth() + 1);
    const monthlyExpenses = stats.expenses > 0 ? stats.expenses : 45000; // Fallback si no hay gastos aún

    // 2. Calcular Ahorros Disponibles (Suma de balances de Metas + "Caja" simulada)
    // Nota: En una app real, esto vendría de cuentas bancarias. Aquí usamos el acumulado.
    const totalSavings = appData.goals.reduce((sum, g) => sum + g.current, 0);

    // 3. Calcular Runway (Meses de Libertad)
    const months = totalSavings / monthlyExpenses;
    const monthsFormatted = months.toFixed(1);

    // 4. Actualizar UI
    if (labelMonths) labelMonths.textContent = `${monthsFormatted} Meses`;

    // 5. Determinar Status y Mensaje
    let statusColor = '#ef4444'; // Rojo
    let statusIcon = 'fa-exclamation-triangle';
    let statusMsg = "Estás en zona de peligro. Tu prioridad #1 debe ser juntar 1 mes de gastos.";
    let progress = (months / 6) * 100; // Meta estándar de 6 meses

    if (months >= 1 && months < 3) {
        statusColor = '#f59e0b'; // Naranja
        statusIcon = 'fa-shield-alt';
        statusMsg = "Buen inicio. Tienes cobertura básica, pero busca llegar a 3 meses.";
    } else if (months >= 3 && months < 6) {
        statusColor = '#10b981'; // Verde
        statusIcon = 'fa-check-circle';
        statusMsg = "¡Estás protegido! Tienes un colchón sólido para imprevistos.";
    } else if (months >= 6) {
        statusColor = '#3b82f6'; // Azul
        statusIcon = 'fa-medal';
        statusMsg = "¡Nivel Experto! Tu seguridad financiera es envidiable.";
        progress = 100;
    }

    container.innerHTML = `
        <div style="display:flex; align-items:center; gap:15px;">
            <div style="font-size:2.5rem; color:${statusColor};">
                <i class="fas ${statusIcon}"></i>
            </div>
            <div>
                <h4 style="margin:0; color:${statusColor};">${statusMsg.split('.')[0]}</h4>
                <p style="margin:5px 0 0; font-size:0.9rem; color:#64748b;">${statusMsg.split('.')[1] || ''}</p>
            </div>
        </div>
        <div style="margin-top:15px;">
            <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:5px;">
                <span>Progreso (Meta: 6 Meses)</span>
                <span>${Math.min(months, 6).toFixed(1)} / 6.0</span>
            </div>
            <div class="progress-bar-bg" style="height:10px; background:#e2e8f0; border-radius:5px;">
                <div style="width:${Math.min(progress, 100)}%; background:${statusColor}; height:100%; border-radius:5px; transition: width 0.5s;"></div>
            </div>
            <div class="recommendation-chip" style="margin-top:15px; background:${statusColor}15; color:${statusColor}; padding:8px 12px; border-radius:15px; display:inline-block; font-size:0.85rem;">
                <i class="fas fa-coins"></i> Ahorro Total Disponible: ${formatCurrency(totalSavings)}
            </div>
        </div>
    `;
}
function renderDebtsView() { console.log("Render Debts"); }
function renderReportsView() { console.log("Render Reports"); }


function renderTransactions() {
    const list = [...appData.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Dashboard Recent Transactions
    const dashContainer = document.getElementById('transaction-list');
    if (dashContainer) {
        dashContainer.innerHTML = list.slice(0, 5).map(t => createTransactionHTML(t)).join('');
    }

    // Full Transactions List
    const fullContainer = document.getElementById('full-transaction-list');
    if (fullContainer) {
        fullContainer.innerHTML = list.length ? list.map(t => createTransactionHTML(t)).join('') : '<p style="text-align:center; padding:2rem; color: #888;">No hay transacciones registradas.</p>';
    }
}

function createTransactionHTML(t) {
    const cat = CATEGORIES[t.category] || { name: 'Otros', icon: 'fa-question', color: '#666' };
    return `<div class="transaction-item">
                <div class="transaction-icon" style="color:${cat.color}"><i class="fas ${cat.icon}"></i></div>
                <div class="transaction-details">
                    <div class="transaction-name">${t.description}</div>
                    <div class="transaction-category">${cat.name}</div>
                </div>
                <div class="transaction-amount ${t.type}">${formatCurrency(t.amount)}</div>
            </div>`;
}

function renderBudgets() {
    const dashContainer = document.getElementById('budget-list');
    const fullContainer = document.getElementById('full-budget-list');

    const html = appData.budgetConfigs.map(b => {
        // Calculate spent amount for this category
        const currentMonth = new Date().toISOString().slice(0, 7);
        const spent = appData.transactions
            .filter(t => t.type === 'expense' && t.category.startsWith(b.id) && t.date.startsWith(currentMonth))
            .reduce((s, t) => s + t.amount, 0);
        const percent = Math.min((spent / b.limit) * 100, 100);

        return `<div class="budget-item">
            <div class="budget-info">
                <span class="budget-name" style="color: ${b.color}">${b.name}</span>
                <span class="budget-amount">${formatCurrency(spent)} / ${formatCurrency(b.limit)}</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percent}%; background-color: ${b.color}"></div>
            </div>
        </div>`;
    }).join('');

    if (dashContainer) dashContainer.innerHTML = html || '<p class="empty-state">No hay presupuestos</p>';
    if (fullContainer) fullContainer.innerHTML = html || '<p class="empty-state">No hay presupuestos definidos</p>';
}

function renderGoals() {
    const dashContainer = document.getElementById('goals-list');
    const fullContainer = document.getElementById('full-goals-list');

    const html = appData.goals.map(g => {
        const percent = Math.min((g.current / g.target) * 100, 100);
        return `<div class="goal-card">
            <div class="goal-info">
                <div class="goal-icon" style="background: ${g.color}20; color: ${g.color}">
                    <i class="fas fa-${g.icon || 'star'}"></i>
                </div>
                <div>
                    <h4>${g.name}</h4>
                    <p>Meta: ${formatCurrency(g.target)}</p>
                </div>
            </div>
            <div class="goal-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percent}%; background-color: ${g.color}"></div>
                </div>
                <div class="goal-stats">
                    <span>${formatCurrency(g.current)} ahorrado</span>
                    <span>${Math.round(percent)}%</span>
                </div>
            </div>
        </div>`;
    }).join('');

    if (dashContainer) dashContainer.innerHTML = html || '<p class="empty-state">Sin metas activas</p>';
    if (fullContainer) fullContainer.innerHTML = html || '<p class="empty-state">Define una nueva meta para comenzar</p>';
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
    // Navegación Sidebar (Delegación de eventos)
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.addEventListener('click', (e) => {
            const item = e.target.closest('.nav-item');
            if (item) {
                const page = item.dataset.page;
                navigateTo(page);
            }
        });
    }

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
