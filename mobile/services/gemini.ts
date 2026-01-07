
import { GoogleGenerativeAI } from "@google/generative-ai";

// WARNING: In production, API keys should not be hardcoded in the frontend.
// For this MVP demo, we are using the key provided in the test script.
const API_KEY = "AIzaSyArNrF0YNt2xFM0i3LZs41itJaGG18-t8Q";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateCoachResponse(userMessage: string, context: any) {
    try {
        const prompt = `
            Eres FinanzasRD AI, un experto coach financiero personal para usuarios en República Dominicana.
            Tu tono es motivador, directo y profesional pero cercano.
            Usa emojis ocasionalmente.
            La moneda es el Peso Dominicano (RD$).
            
            Contexto del usuario:
            ${JSON.stringify(context)}

            Pregunta del usuario:
            "${userMessage}"

            Responde brevemente (máximo 3 oraciones principales) dando un consejo accionable.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini API Error:", error);

        // Fallback Simulation for Web Demo (CORS bypass)
        const lowerMsg = userMessage.toLowerCase();
        let fallbackResponse = "¡Hola! Estoy en 'Modo Demo Web' (por restricciones del navegador). En tu celular funcionaré con mi cerebro real. 🧠\n\n";

        if (lowerMsg.includes('ahorro') || lowerMsg.includes('ahorrar')) {
            fallbackResponse += "Para mejorar tus ahorros, te sugiero la regla 50/30/20. Destina el 20% de tus ingresos a tu Fondo de Emergencia. Dado que tu ingreso es RD$" + context.totalIncome + ", deberías guardar unos RD$" + (context.totalIncome * 0.2) + " al mes.";
        } else if (lowerMsg.includes('gasto') || lowerMsg.includes('dinero')) {
            if (context.recentTransactions && context.recentTransactions.length > 0) {
                const lastTx = context.recentTransactions[0];
                fallbackResponse += `Veo que tu último movimiento fue en ${lastTx.category} por RD$${lastTx.amount}. Intenta reducir gastos hormiga esta semana.`;
            } else {
                fallbackResponse += "Es importante registrar tus gastos diarios para identificar fugas de dinero. ¡Empieza hoy mismo!";
            }
        } else {
            fallbackResponse += "Recuerda: El primer paso para la libertad financiera es gastar menos de lo que ganas. ¿Te gustaría analizar tu presupuesto?";
        }

        return fallbackResponse;
    }
}
