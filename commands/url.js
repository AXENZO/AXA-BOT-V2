
const axios = require("axios");
const FormData = require("form-data"); // <-- important!
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

const IMGBB_API_KEY = "bd1392e73765f3d56c723de632e66ad1"; // get free key from https://api.imgbb.com/

module.exports = {
  name: "url",
  execute: async ({ sock, msg, reply }) => {
    try {
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      if (!quoted?.imageMessage) return reply("❌ Reply to an image to get its URL");

      // Download image content
      const stream = await downloadContentFromMessage(quoted.imageMessage, "image");
      let buffer = Buffer.from([]);
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }

      // Upload to imgbb
      const form = new FormData();
      form.append("image", buffer.toString("base64")); // imgbb needs base64
      form.append("name", "uploaded_image");

      const res = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, form, {
        headers: form.getHeaders(),
      });

      if (res.data && res.data.data && res.data.data.url) {
        reply(`🌐 Uploaded: ${res.data.data.url}`);
      } else {
        reply("❌ Failed to get image URL");
      }
    } catch (err) {
      console.error("❌ URL command error:", err.message);
      reply("❌ Failed to upload image");
    }
  },
};