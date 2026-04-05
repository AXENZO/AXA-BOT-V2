const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

module.exports = {
  name: "sticker",
  execute: async ({ sock, msg, from, reply }) => {
    try {
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

      if (!quoted || !quoted.imageMessage) {
        return reply("❌ Reply to an image");
      }

      reply("⏳ Creating sticker...");

      // Download image stream
      const stream = await downloadContentFromMessage(quoted.imageMessage, "image");

      let buffer = Buffer.from([]);
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }

      // Send as sticker
      await sock.sendMessage(from, {
        sticker: buffer
      });

    } catch (err) {
      console.log("❌ sticker error:", err);
      reply("❌ Failed to create sticker");
    }
  }
};