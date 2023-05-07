import { Configuration, OpenAIApi } from "openai";
import express from "express";
import cors from "cors";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

fetch("https://api.pawan.krd/resetip", {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		Authorization: `Bearer ${process.env.PAWANKRD_KEY}`,
	},
}).catch((error) => {
	console.log(error);
});

const config = new Configuration({
	apiKey: process.env.PAWANKRD_KEY,
	basePath: "https://api.pawan.krd/v1",
});
const openai = new OpenAIApi(config);

app.post("/pawanchatgpt", async (req, res) => {
	try {
		const messages = req.body.messages;

		const response = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: messages,
			temperature: req.body.temperature || 0.7,
		});

		const answer = response.data.choices[0].message.content;
		res.status(200).json({ answer });
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.error(error);
		console.error(JSON.stringify(error.response.data));
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port http://localhost:${PORT}`);
});
