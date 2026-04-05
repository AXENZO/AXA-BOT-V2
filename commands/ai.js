const axios = require("axios");

module.exports = {
  name: "ai",
  execute: async ({ reply, args }) => {
    if (!args.length) return reply("❌ Ask something, e.g., .ai hello");

    const prompt = args.join(" ");

    try {
      const res = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "meta-llama/Llama-3.1-8B-Instruct",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 500
        },
        {
          headers: {
            "Authorization": "Bearer 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",
            "Content-Type": "application/json"
          }
        }
      );

      const text = res.data.choices?.[0]?.message?.content || "❌ No response";
      reply(text);
    } catch (err) {
      console.log("❌ OpenRouter AI error:", err.response?.data || err.message);
      reply("❌ Failed to get AI response");
    }
  }
};