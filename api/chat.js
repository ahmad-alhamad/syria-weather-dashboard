import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "No message provided" });

    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
      max_tokens: 200
    });

    console.log("OpenAI response:", response); // <-- this logs full API response

    const reply = response.choices?.[0]?.message?.content || null;

    if (!reply) {
      return res.status(500).json({ error: "Empty response from OpenAI" });
    }

    res.status(200).json({ reply });

  } catch (err) {
    console.error("OpenAI ERROR:", err);
    res.status(500).json({ error: "OpenAI request failed" });
  }
}
