// api/submitForm.js

const fetch = require('node-fetch');

module.exports = async function (req, res) {
  if (req.method === 'POST') {
    const { name, email } = req.body;

    // Forward the request to the Google Apps Script URL
    const scriptResponse = await fetch('https://script.google.com/a/proemial.ai/macros/s/AKfycbxvMJigU-ItXTaz85I0oIN-Zu4wVmBOYz_j_tlS6npe/dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email }),
    });

    // Get the response from the Google Apps Script server
    const scriptData = await scriptResponse.json();

    // Send the response from the serverless function to the client
    res.status(scriptResponse.status).json(scriptData);
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};
