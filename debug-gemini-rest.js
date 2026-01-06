const https = require('https');

const apiKey = "AIzaSyArNrF0YNt2xFM0i3LZs41itJaGG18-t8Q";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log("Querying:", url.replace(apiKey, "xxx"));

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log("Status Code:", res.statusCode);
        try {
            const json = JSON.parse(data);
            if (json.models) {
                console.log("Available Models:");
                json.models.forEach(m => console.log(`- ${m.name}`));
            } else {
                console.log("Error Payload:", JSON.stringify(json, null, 2));
            }
        } catch (e) {
            console.log("Raw Body:", data);
        }
    });
}).on("error", (err) => {
    console.log("Error:", err.message);
});
