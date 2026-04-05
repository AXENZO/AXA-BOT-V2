const axios = require("axios")

module.exports = {
  name: "joke",
  execute: async ({ reply }) => {
    const res = await axios.get("https://official-joke-api.appspot.com/random_joke")
    reply(`${res.data.setup}\n😂 ${res.data.punchline}`)
  }
}