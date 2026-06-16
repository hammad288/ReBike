require('dotenv').config();
const axios = require('axios');

const testSMS = async () => {
  const phone = '6355117661'; // admin phone
  const key = process.env.FAST2SMS_API_KEY;

  console.log('API Key:', key ? `${key.slice(0,8)}...` : 'MISSING!');
  console.log('Sending test SMS to:', phone);

  try {
    const response = await axios.post(
      'https://www.fast2sms.com/dev/bulkV2',
      {
        route: 'q',
        message: 'ReBike Test: SMS service is working!',
        language: 'english',
        flash: 0,
        numbers: phone,
      },
      {
        headers: {
          authorization: key,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );
    console.log('✅ Response:', JSON.stringify(response.data, null, 2));
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error('Response data:', JSON.stringify(err.response?.data, null, 2));
    console.error('Status:', err.response?.status);
  }
};

testSMS();
