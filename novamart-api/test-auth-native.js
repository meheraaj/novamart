const http = require('http');

const testUser = {
    name: 'Test Admin',
    email: `test_admin_${Date.now()}@example.com`,
    password: 'password123',
    role: 'admin'
};

function makeRequest(path, method, body) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(body);
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth' + path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = http.request(options, (res) => {
            let responseData = '';
            res.on('data', chunk => responseData += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        status: res.statusCode,
                        data: JSON.parse(responseData)
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        data: responseData
                    });
                }
            });
        });

        req.on('error', error => {
            reject(error);
        });

        req.write(data);
        req.end();
    });
}

(async () => {
    try {
        console.log('1. Testing Registration...');
        console.log(`Sending: ${testUser.email}`);
        const regRes = await makeRequest('/register', 'POST', testUser);
        console.log(`Registration Status: ${regRes.status}`);

        if (regRes.status !== 201) {
            console.error('Registration Failed:', regRes.data);
            return;
        }

        console.log('\n2. Testing Login...');
        const loginRes = await makeRequest('/login', 'POST', {
            email: testUser.email,
            password: testUser.password
        });
        console.log(`Login Status: ${loginRes.status}`);
        console.log(`Login Token Present:`, !!loginRes.data.accessToken);

        if (loginRes.data.role !== 'admin') {
            console.error('ERROR: User was not created as admin!');
        } else {
            console.log('SUCCESS: Authenticated as Admin.');
        }

    } catch (e) {
        console.error('Test script error:', e);
    }
})();
