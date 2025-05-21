const fetch = require('node-fetch');

exports.handler = async function (event) {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  const BIN_ID = '682db4228960c979a59e6ca0';
  const API_KEY = '$2a$10$jBNLbaqO3TMANqDg8HAKyeXM6rhTCJkft28fsSJQPcElB56uOVhre';

  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': API_KEY
      }
    });

    const result = await response.json();
    const keys = Object.keys(result.record || {});

    return {
      statusCode: 200,
      body: JSON.stringify(keys)
    };
  } catch (err) {
    console.error("List presets failed:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Unknown error' })
    };
  }
};
