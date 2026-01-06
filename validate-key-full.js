const https = require('https');

const apiKey = "AIzaSyA9uH0k48x-GCxLP_860_pnWMcGOjuSqYc";

// Models to test in order of preference/likelihood
const modelsToTest = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-exp",
    "gemini-2.0-flash-lite-preview-02-05"
];

function testModel(modelName) {
    return new Promise((resolve) => {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const data = JSON.stringify({
            contents: [{ parts: [{ text: "Hi" }] }]
        });

        const req = https.request(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                resolve({
                    model: modelName,
                    status: res.statusCode,
                    headers: res.headers,
                    body: body.substring(0, 200) // First 200 chars
                });
            });
        });

        req.on('error', (e) => resolve({ model: modelName, error: e.message }));
        req.write(data);
        req.end();
    });
}

async function run() {
    console.log(`Checking API Key: ${apiKey.substring(0, 10)}...`);

    for (const model of modelsToTest) {
        console.log(`\nTesting ${model}...`);
        const result = await testModel(model);
        console.log(`Status: ${result.status}`);
        if (result.status === 200) {
            console.log("✅ SUCCESS! This model works.");
            console.log("Response sample:", result.body);
            // Assuming this is the best one if it works
            process.exit(0);
        } else {
            console.log("❌ Failed.");
            if (result.status === 429) console.log("Reason: RATE LIMIT EXCEEDED (Quota)");
            if (result.status === 404) console.log("Reason: Model not found for this key");
            if (result.status === 400) console.log("Reason: Bad Request (Key issues?)");
            console.log("Details:", result.body);
        }
    }
}

run();
