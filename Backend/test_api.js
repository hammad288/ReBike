const axios = require('axios');

const testApi = async () => {
    try {
        const res = await axios.get('http://localhost:5000/api/bikes/approved?limit=1');
        console.log('API Response:', JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.error('API Error:', err.message);
    }
};

testApi();
