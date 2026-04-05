const emojis = [ '💘','💝','💖','💗','💓','💞','💕','💟','❣️','❤️','🔥','💯','😂','😍','🥰','😎','🤖','👀','👍','🙏','🎉' ]; // keep it shorter for stability

// pick random emoji
function getRandomEmoji() {
  return emojis[Math.floor(Math.random() * emojis.length)];
}

async function doReact(emoji, mek, sock) {
  try {
    const react = {
      react: {
        text: emoji,
        key: mek.key,
      },
    };

    await sock.sendMessage(mek.key.remoteJid, react);
  } catch (error) {
    console.error('Error sending auto reaction:', error);
  }
}

module.exports = { emojis, doReact }