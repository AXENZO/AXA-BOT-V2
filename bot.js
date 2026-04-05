/* AxA WhatsApp Bot */

const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} = require("@whiskeysockets/baileys")

const pino = require("pino")
const fs = require("fs")
const path = require("path")
const { emojis, doReact } = require("./commands/areact")

// 📦 LOAD COMMANDS
const commands = {}

const commandsPath = path.join(__dirname, "commands")

if (!fs.existsSync(commandsPath)) {
  console.log("❌ commands folder not found!")
} else {
  const files = fs.readdirSync(commandsPath)

  files.forEach(file => {
    if (!file.endsWith(".js")) return

    const filePath = path.join(commandsPath, file)
    console.log("📦 Loading:", filePath)

    const cmd = require(filePath)

    if (cmd.name && cmd.execute) {
      commands[cmd.name.toLowerCase()] = cmd
    } else {
      console.log("❌ Invalid command:", file)
    }
  })
}

console.log("✅ Loaded commands:", Object.keys(commands))

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session")
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    logger: pino({ level: "silent" }),
    auth: state,
    version,
    browser: ["AxA-MD", "Chrome", "1.0.0"]
  })

  sock.ev.on("creds.update", saveCreds)

  // 🔌 CONNECTION
  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "open") {
      console.log("✅ Bot connected!")
    } else if (connection === "close") {
      console.log("❌ Connection closed, reconnecting...")
      startBot()
    }
  })

  // 📩 MESSAGE HANDLER
  sock.ev.on("messages.upsert", async ({ messages }) => {
    try {
      const msg = messages[0]
      if (!msg.message) return

      const from = msg.key.remoteJid

    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
    await doReact(randomEmoji, msg, sock)

      const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text

      if (!text) return

      const body = text.trim()
      const commandText = body.toLowerCase()

      console.log("📩 Received:", body)

      const prefix = "."

      // =========================
      // ⚡ COMMAND SYSTEM
      // =========================
if (body.trim().startsWith(prefix)) {
  const args = body.slice(1).trim().split(/\s+/)
  const cmdName = args.shift().toLowerCase()

  console.log("⚡ Command:", cmdName)
  console.log("📦 Available:", Object.keys(commands))

  const cmd = commands[cmdName]

  if (cmd) {
    try {
      await cmd.execute({
        sock,
        msg,
        from,
        args,
        text: body,
        reply: (text) => sock.sendMessage(from, { text })
      })
    } catch (err) {
      console.log("❌ Command error:", err)
      await sock.sendMessage(from, { text: "❌ Command failed" })
    }
  } else {
    console.log("❌ Not found:", cmdName)
    await sock.sendMessage(from, { text: "❌ Unknown command" })
  }

  return
}

      // =========================
      // 📂 AUTO FILE SYSTEM
      // =========================
      const clean = commandText.replace(/\s+/g, "_")

      const audioPath = path.join(__dirname, "uploads", `${clean}.mp3`)
      const stickerPath = path.join(__dirname, "sticker", `${clean}.webp`)

      // 🎵 AUDIO
      if (fs.existsSync(audioPath)) {
        await sock.sendMessage(from, {
          audio: fs.readFileSync(audioPath),
          mimetype: "audio/mpeg",
          ptt: false
        })
        return
      }

      // 🧩 STICKER
      if (fs.existsSync(stickerPath)) {
        await sock.sendMessage(from, {
          sticker: fs.readFileSync(stickerPath)
        })
        return
      }

      // =========================
      // 🔥 DEFAULT
      // =========================
      if (commandText === "hi") {
        await sock.sendMessage(from, { text: "👋 Hello!" })
      }

      if (commandText === "ping") {
        await sock.sendMessage(from, { text: "🏓 pong!" })
      }

    } catch (err) {
      console.log("❌ Error:", err)
    }
  })
}

startBot()