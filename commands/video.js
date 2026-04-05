const yts = require("yt-search")

module.exports = {
  name: "video",
  execute: async ({ sock, from, args, reply }) => {
    if (!args[0]) return reply("❌ Enter video name")

    const query = args.join(" ")
    const search = await yts(query)
    const video = search.videos[0]

    if (!video) return reply("❌ Not found")

    await sock.sendMessage(from, {
      video: { url: video.url },
      caption: video.title
    })
  }
}