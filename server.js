const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/webchatgpt', async (req, res) => {
  try {
    const question = req.body.question;
    const token = req.body.token;
    const cookie = req.body.cookie;

    const url = 'https://chat.openai.com/backend-api/conversation';

    const requestBody = {
      model: 'text-davinci-002-render-sha',
      messages: [{ "role": "user", "content": question }],
      temperature: 0.7,
      action: 'next',
      timezone_offset_min: new Date().getTimezoneOffset(),
      variant_purpose: 'none',
      history_and_training_disabled: true,
    };

    console.log(token);
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(cookie && { Cookie: cookie })
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    const answer = result.choices && result.choices[0] && result.choices[0].text.trim();

    res.status(200).json({ answer });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
