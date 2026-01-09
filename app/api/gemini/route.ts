import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.API_CONFIG_KEY || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

export async function POST(req: Request) {
    try {
        if (!apiKey) {
            // Debugging: List available keys (security safe, names only) to help diagnosis
            const availableEnvVars = Object.keys(process.env).filter(k => k.includes('KEY') || k.includes('API') || k.includes('GEMINI'));
            console.error("API Key missing. Available Env Vars:", availableEnvVars);

            return NextResponse.json(
                { error: `API Key not found on Server. Checked: GEMINI_API_KEY, GOOGLE_API_KEY. Visible Vars: ${availableEnvVars.join(', ') || 'NONE'}` },
                { status: 500 }
            );
        }

        const body = await req.json();
        const { message, context, systemInstruction } = body;

        // Use the provided systemInstruction or fall back to a default (though frontend should now provide it)
        const effectiveSystemPrompt = systemInstruction || `
            ERES: FinanzasRD AI, tu coach financiero.
            OBJETIVO: Ayudar al usuario.
        `;


        // Initialize Google Generative AI within the request handler (best practice)
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: effectiveSystemPrompt + `\nCONTEXTO ACTUAL DEL USUARIO: ${JSON.stringify(context)} ` }],
                },
                {
                    role: "model",
                    parts: [{ text: "Entendido. Soy FinanzasRD AI. Breve, directo y al grano. Manda la próxima." }],
                },
            ],
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const result = await chat.sendMessage(message);
        const response = result.response;
        const text = response.text();

        return NextResponse.json({ response: text });
    } catch (error: any) {
        console.error("Error calling Gemini API:", error);

        return NextResponse.json(
            { error: `FinanzasRD AI Error: ${error.message || 'Unknown error'} ` },
            { status: 500 }
        );
    }
}
