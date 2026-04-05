const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

module.exports = {
  name: "toimg",
  execute: async ({ sock, msg, from, reply }) => {
    try {
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

      if (!quoted?.stickerMessage) {
        return reply("❌ Reply to a sticker");
      }

      // Download sticker stream
      const stream = await downloadContentFromMessage(quoted.stickerMessage, "sticker");

      let buffer = Buffer.from([]);
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }

      // Send as image (WhatsApp auto converts webp → image)
      await sock.sendMessage(from, {
        image: buffer,
        caption: "🖼 Converted to image"
      });

    } catch (err) {
      console.log("❌ toimg error:", err);
      reply("❌ Failed to convert sticker");
    }
  }
};