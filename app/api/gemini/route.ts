import { NextResponse } from "next/server";

const apiKey = process.env.API_CONFIG_KEY || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export async function POST(req: Request) {
    try {
        if (!apiKey) {
            console.error("API Key missing");
            return NextResponse.json(
                { error: "API Key not configured on server" },
                { status: 500 }
            );
        }

        const body = await req.json();
        const { message, context } = body;

        const systemPrompt = `
        Eres "FinanzasRD AI", un coach financiero dominicano experto, sarcástico pero motivador (Estilo "Planifestord").
        Tu misión es ayudar al usuario a mejorar su salud financiera usando la metodología de "Números Verdes".
        
        CONTEXTO DEL USUARIO:
        ${JSON.stringify(context)}
        
        INSTRUCCIONES:
        - Responde corto y directo (max 3 párrafos).
        - Usa jerga dominicana moderada ("cuarto", "clavo", "serrucho").
        - Si detectas gastos hormiga, sé duro.
        - Si detectas logros, celebra.
        - Prioriza: Fondo Emergencia > Deudas Consumo > Inversión.
        
        PREGUNTA DEL USUARIO: "${message}"
        `;

        // Direct REST API Call using Experimental Model to bypass potential rate limits on main channel
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: systemPrompt }]
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Gemini REST API Error:", errorData);
            throw new Error(`Gemini API Error: ${response.statusText}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No pude generar una respuesta.";

        return NextResponse.json({ response: text });
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return NextResponse.json(
            { error: "Failed to generate response" },
            { status: 500 }
        );
    }
}
