import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.API_CONFIG_KEY || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

export async function POST(req: Request) {
    try {
        if (!apiKey) {
            return NextResponse.json(
                { error: `API Key not found.` },
                { status: 500 }
            );
        }

        const body = await req.json();
        const { message, context, systemInstruction, history } = body;

        // 1. Prepare System Prompt (Personality)
        const effectiveSystemPrompt = systemInstruction || `
            ERES: FinanzasRD AI, tu coach financiero.
            OBJETIVO: Ayudar al usuario.
        `;

        // 2. Initialize Model with System Instruction (CRITICAL for persistence)
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp",
            systemInstruction: effectiveSystemPrompt + `\nCONTEXTO ACTUAL (MANTENER DURANTE TODA LA SESIÓN): ${JSON.stringify(context)}`
        });

        // 3. Prepare Chat History
        // The 'history' array from frontend includes the current user message at the end.
        // We need to separate it: history for initialization, current message for generation.
        let validHistory: any[] = [];
        let currentMessage = message;

        if (history && Array.isArray(history) && history.length > 0) {
            // Remove the last item (should be the current user message) to avoid duplication if passed in header
            // Actually, frontend sends [...history, userMsg]. So:
            const previousMessages = history.slice(0, -1);
            currentMessage = history[history.length - 1].parts[0].text;

            validHistory = previousMessages.map((msg: any) => ({
                role: msg.role,
                parts: msg.parts
            }));
        }

        // 4. Start Chat with History
        const chat = model.startChat({
            history: validHistory,
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        // 5. Send Message using the persisted session
        const result = await chat.sendMessage(currentMessage);
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
