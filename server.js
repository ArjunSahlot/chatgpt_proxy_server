import { Configuration, OpenAIApi } from 'openai';
import express from 'express';
import cors from 'cors';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

fetch('https://api.pawan.krd/resetip', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': process.env.PAWANKRD_KEY
  }
}).catch((error) => { console.log(error) });

const config = new Configuration({
  apiKey: process.env.PAWANKRD_KEY,
  basePath: "https://api.pawan.krd/v1",
})
const openai = new OpenAIApi(config);

app.post('/pawanchatgpt', async (req, res) => {
  try {
    const messages = req.body.messages;

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: req.body.temperature || 0.7,
    })

    const answer = response.data.choices[0].message.content;
    res.status(200).json({ answer });
  } catch (error) {
    console.error(JSON.stringify(error.response.data));
    res.status(500).json({ error: error.message });
  }
});

app.post('/webchatgpt', async (req, res) => {
  try {
    const messages = req.body.messages;
    const token = req.body.token;
    const model = req.body.model;
    const cookie = req.body.cookie;

    const response = await fetch(`https://chat.openai.com/backend-api/conversation`, {
      method: 'POST',
      // mode: 'no-cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(cookie && { Cookie: cookie }),
      },
      body: JSON.stringify({
        action: 'next',
        // conversation_id: session.conversationId,
        messages: messages,
        model: model || 'text-davinci-002-render-sha',
        timezone_offset_min: new Date().getTimezoneOffset(),
        variant_purpose: 'none',
        history_and_training_disabled: true,
      })
    });

    console.log(response);
    const answer = response.data.choices[0].message.content;
    res.status(200).json({ answer });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
