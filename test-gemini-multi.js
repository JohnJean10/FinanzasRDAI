const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
    const apiKey = "AIzaSyArNrF0YNt2xFM0i3LZs41itJaGG18-t8Q";
    const genAI = new GoogleGenerativeAI(apiKey);

    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro", "gemini-pro"];

    console.log("Testing models with key starting:", apiKey.substring(0, 5));

    for (const modelName of models) {
        console.log(`\nTesting model: ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hi");
            const response = await result.response;
            console.log(`✅ SUCCESS with ${modelName}! Response:`, response.text());
            return; // Stop on first success
        } catch (error) {
            console.error(`❌ FAILED ${modelName}:`, error.message.split('\n')[0]);
        }
    }
    console.log("\nAll models failed.");
}

test();
