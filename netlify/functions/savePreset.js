
const fetch = require('node-fetch');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { name, data } = JSON.parse(event.body);
    const BIN_ID = '682db4228960c979a59e6ca0';
    const API_KEY = '$2a$10$jBNLbaqO3TMANqDg8HAKyeXM6rhTCJkft28fsSJQPcElB56uOVhre';

    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY
      },
      body: JSON.stringify({ [name]: data })
    });

    const text = await response.text();
    console.log("RESPONSE STATUS:", response.status);
    console.log("RESPONSE HEADERS:", JSON.stringify(Object.fromEntries(response.headers)));
    console.log("RESPONSE BODY:", text);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Preset '${name}' saved.`,
        debug: text
      })
    };
  } catch (err) {
    console.error("Save preset failed:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Unknown error' })
    };
  }
};
