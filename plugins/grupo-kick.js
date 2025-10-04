import { areJidsSameUser } from '@whiskeysockets/baileys'

const handler = async (m, { conn, args, participants, isAdmin, isOwner }) => {
  if (!m.isGroup) return
  if (!isAdmin && !isOwner) return

  const users = m.mentionedJid && m.mentionedJid.length > 0
    ? m.mentionedJid
    : m.quoted
      ? [m.quoted.sender]
      : args.length > 0
        ? [args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net']
        : []

  if (users.length === 0) {
    return conn.sendMessage(
      m.chat,
      { text: '「✦」 Uso correcto: responde al mensaje del usuario o menciona su número. Ejemplo:\n.kick @usuario' },
      { quoted: m }
    )
  }

  for (let user of users) {
    const isBot = areJidsSameUser(user, conn.user.jid)
    const isAdminTarget = participants.find(p => areJidsSameUser(p.id, user))?.admin
    if (isBot || isAdminTarget) continue
    try {
      await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
    } catch (err) { }
  }

  await conn.sendMessage(m.chat, { text: '🥾', mentions: users }, { quoted: m })
}

handler.help = ['kick @usuario']
handler.tags = ['grupo']
handler.command = /^kick$/i
handler.admin = true
handler.group = true

export default handler