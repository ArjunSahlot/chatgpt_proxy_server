import { Configuration, OpenAIApi } from 'openai';
import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;
const config = new Configuration({
      apiKey: process.env.PAWANKRD_KEY,
      basePath: "https://api.pawan.krd/v1",
    })
app.use(cors());
app.use(express.json());


app.post('/webchatgpt', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const openai = new OpenAIApi(config);

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ "role": "user", "content": prompt }],
      temperature: 0.7,
    })

    const answer = response.data.choices[0].message.content;
    res.status(200).json({ answer });
  } catch (error) {
    console.error(JSON.stringify(error.response.data));
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
