const yts = require("yt-search")
const { exec } = require("child_process")
const fs = require("fs")

module.exports = {
  name: "play",
  execute: async ({ sock, from, args, reply }) => {
    if (!args[0]) return reply("❌ Enter song name")

    const query = args.join(" ")
    const search = await yts(query)
    const video = search.videos[0]

    if (!video) return reply("❌ Not found")

    reply(`🎵 Downloading: ${video.title}`)

    const file = `${Date.now()}.mp3` // unique filename

  const command = `yt-dlp -x --audio-format mp3 --js-runtime=node --ffmpeg-location "C:\\Users\\Axe\\Downloads\\ffmpeg-master-latest-win64-gpl-shared\\ffmpeg-master-latest-win64-gpl-shared\\bin" -o "${file}" "${video.url}"`

    exec(command, async (err) => {
      if (err) {
        console.log(err)
        return reply("❌ Download failed")
      }

      await sock.sendMessage(from, {
        audio: fs.readFileSync(file),
        mimetype: "audio/mpeg"
      })

      fs.unlinkSync(file)
    })
  }
}