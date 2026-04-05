const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} = require("@whiskeysockets/baileys");

const readline = require("readline");
const pino = require("pino");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session");

  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    logger: pino({ level: "silent" }),
    auth: state,
    browser: ["Ubuntu", "Chrome", "120.0.0"],
    version
  });

  // ✅ FIX: correct auth check
  if (!state.creds.registered) {
    rl.question("📱 Enter your WhatsApp number (with country code, no +): ", async (num) => {
      let phone = num.replace(/[^0-9]/g, "");

      try {
        const code = await sock.requestPairingCode(phone);
        console.log("\n✅ Your Pairing Code:", code);
        console.log("👉 Enter this code in WhatsApp → Linked Devices → Link with phone number");
      } catch (err) {
        console.log("❌ Pairing failed:", err.message);
      }
    });
  }

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

      console.log("❌ Connection closed. Reconnecting...", shouldReconnect);

      if (shouldReconnect) startBot();
    } else if (connection === "open") {
      console.log("✅ Bot connected successfully!");
    }
  });

  // ✅ Add message listener (optional but useful)
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text;

    const from = msg.key.remoteJid;

    console.log("📩 Message:", text);

    if (text === "hi") {
      await sock.sendMessage(from, { text: "Hello 👋" });
    }
  });
}

startBot();