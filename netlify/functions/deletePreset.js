const fetch = require('node-fetch');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  const BIN_ID = '682db4228960c979a59e6ca0';
  const API_KEY = '$2a$10$jBNLbaqO3TMANqDg8HAKyeXM6rhTCJkft28fsSJQPcElB56uOVhre';

  try {
    const { name } = JSON.parse(event.body);
    if (!name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing preset name' })
      };
    }

    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': API_KEY
      }
    });

    const json = await response.json();
    const data = json.record;
    if (!(name in data)) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Preset not found' })
      };
    }

    delete data[name];

    const putRes = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY
      },
      body: JSON.stringify(data)
    });

    const result = await putRes.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Preset '${name}' deleted`, result })
    };
  } catch (err) {
    console.error("Delete preset failed:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Unknown error' })
    };
  }
};
