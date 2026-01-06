const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
    const apiKey = "AIzaSyArNrF0YNt2xFM0i3LZs41itJaGG18-t8Q"; // Hardcoded for test
    console.log("Testing API Key starting with:", apiKey.substring(0, 5));

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Say 'Hello from Gemini'");
        const response = await result.response;
        const text = response.text();
        console.log("Success! Response:", text);
    } catch (error) {
        console.error("Test failed:", error.message);
    }
}

test();
