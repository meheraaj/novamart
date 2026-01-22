const fs = require('fs');

async function testApi() {
    try {
        const token = fs.readFileSync('token.txt', 'utf8').trim();
        console.log("Using token:", token.substring(0, 20) + "...");

        const response = await fetch('http://127.0.0.1:5000/api/users', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Status:", response.status);
        if (response.ok) {
            const data = await response.json();
            console.log("Data:", JSON.stringify(data, null, 2));
        } else {
            const text = await response.text();
            console.log("Error Response:", text);
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
}

testApi();
