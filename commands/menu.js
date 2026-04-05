const axios = require("axios")

module.exports = {
  name: "menu",
  execute: async ({ sock, from, reply }) => {
    try {
      const images = [
        "https://i.imgur.com/iykTPED.jpeg"
      ]

      const img = images[Math.floor(Math.random() * images.length)]

      const res = await axios.get(img, { responseType: "arraybuffer" })

      await sock.sendMessage(from, {
        image: Buffer.from(res.data),
        mimetype: "image/jpeg",
        caption: `⛦━━━━━MrAXENZO━━━━━⛦

𝐀𝐗𝐀 『📑』- ᴀʟʟ〘𝗠𝗘𝗡𝗨〙
■□■□■□■□■□■□■□■□■□■□

♕ *Media Commands* ♕
.owner
.play <name>
.video <link>
.insta <link>
.yt <query>
.show <name>
.gif
.tomp3
.say <text>
.img <text>
.trt <lang>
.wiki <text>
.lyric <text>
.covid <code>
.weather <city>
.removebg
.ocr
.wallpaper

♟ *Fun Commands* ♟
.joke
.meme
.quote
.ss <url>
.changesay
.trumpsay
.compliment
.bitly <link>
.dict
.zodiac <sign>
.qr <text>
.movie <name>
.anime <name>

♝ *Sticker Commands* ♝
.sticker
.photo
.attp <text>

═══ AXA BOT BY AXENZO ═══`
      })

    } catch (err) {
      console.log("❌ Menu error:", err)
      reply("❌ Failed to load menu")
    }
  }
}