import OpenAI from "openai";

export const aiChat = async (req, res) => {
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_KEY });

    const userMsg = req.body.message;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Bạn là trợ lý AI thân thiện." },
        { role: "user", content: userMsg }
      ],
    });

    res.json({
      reply: response.choices[0].message.content
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
