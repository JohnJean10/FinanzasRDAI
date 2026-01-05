# FinanzasRD AI

**Asistente Financiero con IA para República Dominicana**

Una aplicación web completa para gestionar finanzas personales, con características de inteligencia artificial para categorización automática de transacciones y recomendaciones personalizadas.

## Características

- **Dashboard Financiero**: Visualiza tu balance, ingresos, gastos y tasa de ahorro en tiempo real
- **Categorización Automática IA**: Predice la categoría de transacciones basándose en la descripción
- **Gestión de Transacciones**: Registro de ingresos y gastos con categorías específicas para RD
- **Presupuestos por Categoría**: Controla tus gastos con límites y alertas visuales
- **Metas de Ahorro**: Define y seguimiento de objetivos financieros
- **Recomendaciones Personalizadas**: Consejos inteligentes basados en tu comportamiento financiero
- **Gráficos Interactivos**: Visualización de gastos por categoría usando Chart.js
- **Diseño Responsivo**: Funciona en desktop y dispositivos móviles

## Estructura del Proyecto

```
finanzasrd-ai/
├── index.html          # Archivo principal HTML
├── css/
│   └── styles.css      # Estilos de la aplicación
├── js/
│   └── app.js          # Lógica de la aplicación
├── assets/             # Recursos estáticos (imágenes, etc.)
├── docs/               # Documentación
└── package.json        # Configuración del proyecto
```

## Instalación y Desarrollo

### Requisitos Previos
- Node.js 16+ 
- npm o yarn
- Un editor de código (VS Code recomendado)

### Iniciar Desarrollo

1. **Clonar o descargar el proyecto**

2. **Instalar dependencias** (para desarrollo local):
```bash
npm install
```

3. **Iniciar servidor de desarrollo**:
```bash
npm start
```

4. **Abrir en navegador**:
```
http://localhost:3000
```

## Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos con variables CSS y diseño responsivo
- **JavaScript (ES6+)** - Lógica de la aplicación
- **Chart.js** - Gráficos interactivos
- **FontAwesome** - Iconos
- **Google Fonts** - Tipografía (Inter)

## Categorías Soportadas

### Alimentación
- Supermercado (Jumbo, Bravo, Sirena, etc.)
- Restaurantes
- Comida Rápida

### Transporte
- Gasolina
- Transporte Público (Metro, OMSA)
- Uber/Metro

### Vivienda
- Alquiler
- Servicios del Hogar (Edesur, etc.)

### Servicios
- Teléfono/Internet (Claro, Orange, Altice)
- Suscripciones (Netflix, Spotify, etc.)

### Salud
- Farmacia
- Médico

### Entretenimiento
- Cine/Eventos
- Streaming

### Shopping
- Ropa
- Electrónica

### Familia
- Remesas

## Integración con Backend

El archivo `js/app.js` incluye un objeto `API` preparado para conectar con un backend:

```javascript
// Predicción de categoría usando servidor ML
await FinanzasRD.API.predictCategory(description);

// Obtener recomendaciones del motor IA
await FinanzasRD.API.getRecommendations();

// Sincronizar con banco
await FinanzasRD.API.syncBank(accountId);
```

## Personalización

### Colores del Tema
Edita las variables CSS en `css/styles.css`:

```css
:root {
    --primary: #003366;      // Color principal
    --secondary: #00A86B;    // Color de éxito/ahorro
    --accent: #FFD700;       // Color de acento
    --danger: #FF4444;       // Color de alerta
    --background: #F4F7FA;   // Color de fondo
}
```

### Categorías
Agrega o modifica categorías en `js/app.js`:

```javascript
const CATEGORIES = {
    'nueva_categoria': { 
        name: 'Nueva Categoria', 
        icon: 'fa-icono', 
        color: '#HEXCOLOR' 
    }
};

const CATEGORY_PATTERNS = {
    'nueva_categoria': ['palabra1', 'palabra2', 'palabra3']
};
```

## Datos y Persistencia

Los datos se guardan automáticamente en `localStorage` del navegador:
- Transacciones
- Metas de ahorro
- Preferencias del usuario

Para borrar todos los datos:
```javascript
localStorage.removeItem('finanzasrd_data');
```

## Próximos Pasos (para continuar desarrollo)

1. **Backend con NestJS**: Implementar API REST completa
2. **Machine Learning**: Conectar con modelos Python para predicción de categorías
3. **Autenticación**: Sistema de usuarios con JWT
4. **Integración Bancaria**: Conectar con APIs de bancos dominicanos
5. **Notificaciones Push**: Alertas en tiempo real
6. **App Móvil**: Versión con Flutter

## Licencia

MIT License - feel free to use and modify for your projects.

---

Desarrollado con ❤️ para República Dominicana
