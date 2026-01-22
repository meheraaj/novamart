const axios = require('axios');

const baseURL = 'http://localhost:5000/api/auth';
const testUser = {
    name: 'Test Admin',
    email: `test_admin_${Date.now()}@example.com`,
    password: 'password123',
    role: 'admin'
};

async function testAuth() {
    try {
        console.log('1. Testing Registration...');
        console.log(`Sending:`, testUser);
        const regRes = await axios.post(`${baseURL}/register`, testUser);
        console.log(`Registration Status: ${regRes.status}`);
        console.log(`Registration Data:`, regRes.data);

        console.log('\n2. Testing Login...');
        const loginRes = await axios.post(`${baseURL}/login`, {
            email: testUser.email,
            password: testUser.password
        });
        console.log(`Login Status: ${loginRes.status}`);
        console.log(`Login Token Present:`, !!loginRes.data.accessToken);
        console.log(`Login Role:`, loginRes.data.role);

        if (loginRes.data.role !== 'admin') {
            console.error('ERROR: User was not created as admin!');
        } else {
            console.log('SUCCESS: Authenticated as Admin.');
        }

    } catch (error) {
        console.error('FAILED:', error.response ? error.response.data : error.message);
    }
}

testAuth();
