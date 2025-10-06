import moment from "moment-timezone"
import fetch from "node-fetch"

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

    let botNameToShow = typeof global.botname === "string" ? global.botname : "Bot"
    let bannerUrl = global.banner
    if (!bannerUrl) return conn.reply(m.chat, "⚠️ No se ha configurado un banner para este bot.", m)
    if (Array.isArray(bannerUrl)) bannerUrl = bannerUrl[0]
    if (typeof bannerUrl !== "string") bannerUrl = String(bannerUrl)

    let rolBot = conn.user.jid === global.conn.user.jid ? 'Principal 🅥' : 'Sub-Bot 🅑'

    let txt = `☆ ¡𝐇𝐨𝐥𝐚! 𝐒𝐨𝐲 *${botNameToShow}* (${rolBot})
╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┈┈┈    
╎ ❏ 𝖠𝖼𝗍𝗂𝗏𝗂𝖽𝖺𝖽: ${uptimeStr}
╎ ☁︎︎ 𝖡𝖺𝗂𝗅𝖾𝗒𝗌: 𝖬𝗎𝗅𝗍𝗂 𝖣𝖾𝗏𝗂𝖼𝖾
╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
\n`

    for (let tag in menu) {
      txt += `> ┃✜ *${tag.toUpperCase()}*\n`
      for (let plugin of menu[tag]) {
        if (!Array.isArray(plugin.help)) continue
        for (let cmd of plugin.help) {
          if (Array.isArray(cmd)) cmd = cmd[0]
          if (!cmd) continue
          txt += `> ┃⏤͟͟͞͞ ❏ *${usedPrefix + String(cmd)}*\n`
        }
      }
      txt += `> ┗╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍\n\n`
    }

    let thumbnailBuffer
    try {
      const res = await fetch(bannerUrl)
      thumbnailBuffer = await res.buffer()
    } catch {
      thumbnailBuffer = null
    }


    if (thumbnailBuffer) {
      await conn.sendMessage(
        m.chat,
        {
          image: thumbnailBuffer,
          caption: txt,
          mentions: [m.sender]
        },
        { quoted: m }
      )
    } else {
      
      await conn.sendMessage(
        m.chat,
        {
          text: txt,
          mentions: [m.sender]
        },
        { quoted: m }
      )
    }

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, "Ha ocurrido un error al enviar el menú.", m)
  }
}

handler.command = ['help', 'menu']
export default handler
