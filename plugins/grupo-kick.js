import { areJidsSameUser } from '@whiskeysockets/baileys'

const handler = async (m, { conn, args, participants, isAdmin, isOwner }) => {
  if (!m.isGroup) return
  if (!isAdmin && !isOwner) return

  let users = []

  if (m.mentionedJid && m.mentionedJid.length > 0) {
    users = m.mentionedJid
  } else if (m.quoted) {
    users = [m.quoted.sender]
  } else if (args.length > 0) {
    const jid = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    users = [jid]
  }

  if (users.length === 0) {
    return conn.sendMessage(
      m.chat,
      { text: '「✦」 Uso correcto: responde al mensaje del usuario o menciona su número. Ejemplo:\n.kick @usuario' },
      { quoted: m }
    )
  }

  let kicked = []

  for (let user of users) {
    const isBot = areJidsSameUser(user, conn.user.jid)
    const target = participants.find(p => areJidsSameUser(p.id, user))
    const isAdminTarget = target?.admin

    if (isBot || isAdminTarget) continue

    try {
      await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
      kicked.push(user)
    } catch (err) { }
  }

  if (kicked.length === 0) {
    return conn.sendMessage(
      m.chat,
      { text: '「✦」 No se pudo expulsar a nadie. Verifica si los usuarios son válidos o no son administradores.' },
      { quoted: m }
    )
  }

  await conn.sendMessage(m.chat, { text: '🥾', mentions: kicked }, { quoted: m })
}

handler.help = ['kick @usuario']
handler.tags = ['grupo']
handler.command = /^kick$/i
handler.admin = true
handler.group = true

export default handler