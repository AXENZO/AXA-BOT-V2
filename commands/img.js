module.exports = {
  name: "img",
  execute: async ({ sock, from, args, reply }) => {
    if (!args[0]) return reply("❌ Enter search term")

    const query = args.join(" ")
    const url = `https://source.unsplash.com/800x600/?${query}`

    await sock.sendMessage(from, {
      image: { url },
      caption: `🖼 ${query}`
    })
  }
}