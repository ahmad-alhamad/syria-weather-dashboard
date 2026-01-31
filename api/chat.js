import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: message
    });

    const reply =
      response.output_text ||
      response.output?.[0]?.content?.[0]?.text ||
      null;

    if (!reply) {
      return res.status(500).json({ error: "Empty response from OpenAI" });
    }

    res.status(200).json({ reply });
  } catch (err) {
    console.error("OpenAI ERROR:", err);
    res.status(500).json({ error: "OpenAI request failed" });
  }
}
