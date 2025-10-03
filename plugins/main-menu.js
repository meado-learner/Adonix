let handler = async (m, { conn }) => {
  try {
    let botNameToShow = typeof global.botname === "string" ? global.botname : "Bot"
    let bannerUrl = global.banner

    if (!bannerUrl) {
      return conn.reply(m.chat, "No se ha configurado un banner para este bot.", m)
    }

    if (Array.isArray(bannerUrl)) bannerUrl = bannerUrl[0]
    if (typeof bannerUrl !== "string") bannerUrl = String(bannerUrl)

    let txt = `𝗛𝗼𝗹𝗮! 𝗦𝗼𝘆 *${botNameToShow}*`

    await conn.sendMessage(
      m.chat,
      { image: { url: bannerUrl }, caption: txt },
      { quoted: m }
    )

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, "Ha ocurrido un error al enviar el banner.", m)
  }
}

handler.command = ['help', 'menu']
export default handler
