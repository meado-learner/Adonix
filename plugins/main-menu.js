import moment from "moment-timezone"
import fs from "fs"
import axios from "axios"

let handler = async (m, { conn, usedPrefix }) => {
  try {
  
    let menu = {}
    for (let plugin of Object.values(global.plugins)) {
      if (!plugin || !plugin.help) continue
      let taglist = plugin.tags || []
      for (let tag of taglist) {
        if (!menu[tag]) menu[tag] = []
        menu[tag].push(plugin)
      }
    }

    
    let uptimeSec = process.uptime()
    let hours = Math.floor(uptimeSec / 3600)
    let minutes = Math.floor((uptimeSec % 3600) / 60)
    let seconds = Math.floor(uptimeSec % 60)
    let uptimeStr = `${hours}h ${minutes}m ${seconds}s`

    //-
    let botNameToShow = global.botname || "Bot"
    let bannerUrl = global.banner
    if (!bannerUrl) {
      return conn.reply(m.chat, "No se ha configurado un banner para este bot.", m)
    }
    if (Array.isArray(bannerUrl)) bannerUrl = bannerUrl[0]
    bannerUrl = String(bannerUrl)

    
    const response = await axios.get(bannerUrl, { responseType: 'arraybuffer' })
    const buffer = Buffer.from(response.data, 'binary')

    let rolBot = conn.user.jid === global.conn.user.jid ? 'Principal 🅥' : 'Sub-Bot 🅑'

    let txt = `𝗛𝗼𝗹𝗮! 𝗦𝗼𝘆 *${botNameToShow}* (${rolBot})
> ❏ 𝖠𝖼𝗍𝗂𝗏𝗂𝖽𝖺𝖽: ${uptimeStr}
> ☁︎︎ 𝖡𝖺𝗂𝗅𝖾𝗒𝗌: 𝖬𝗎𝗅𝗍𝗂 𝖣𝖾𝗏𝗂𝖼𝖾
\n`

    for (let tag in menu) {
      txt += `> ┃✜ *${tag.toUpperCase()}*\n\n`
      for (let plugin of menu[tag]) {
        if (!Array.isArray(plugin.help)) continue
        for (let cmd of plugin.help) {
          if (Array.isArray(cmd)) cmd = cmd[0]
          txt += `> ┃⏤͟͟͞͞ ⊹ *${usedPrefix + String(cmd)}*\n`
        }
      }
      txt += `> ┗╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍\n\n`
    }

    await conn.sendMessage(
      m.chat,
      { image: buffer, caption: txt },
      { quoted: m }
    )

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, "Ha ocurrido un error al enviar el menú.", m)
  }
}

handler.command = ['help', 'menu']
export default handler
