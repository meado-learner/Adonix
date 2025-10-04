import { areJidsSameUser } from '@whiskeysockets/baileys'

const handler = async (m, { conn, command, participants, groupMetadata, isAdmin, isOwner }) => {
  if (!m.isGroup)
    return conn.sendMessage(m.chat, { text: '「✦」 Este comando solo puede usarse en grupos.' }, { quoted: fkontak })
  if (!isAdmin && !isOwner)
    return conn.sendMessage(m.chat, { text: '「✦」 Solo un administrador puede usar este comando.' }, { quoted: fkontak })

  const group = groupMetadata.id
  const isClose = groupMetadata.announce === true

  const fkontak = {
    key: { participants: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'fkontak' },
    message: {
      contactMessage: {
        displayName: '「✦」 GESTIÓN DE GRUPO',
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;Gestión;;;\nFN:Gestión de Grupo\nEND:VCARD`
      }
    }
  }

  if (command === 'abrir') {
    if (!isClose)
      return conn.sendMessage(m.chat, { text: '「✦」 El grupo ya está abierto.' }, { quoted: fkontak })

    await conn.groupSettingUpdate(group, 'not_announcement')
    const text = `「✦」 *El grupo ha sido abierto, todos pueden escribir nuevamente.*`
    await conn.sendMessage(group, { text, mentions: participants.map(v => v.id) }, { quoted: fkontak })
  }

  if (command === 'cerrar') {
    if (isClose)
      return conn.sendMessage(m.chat, { text: '「✦」 El grupo ya se encuentra cerrado.' }, { quoted: fkontak })

    await conn.groupSettingUpdate(group, 'announcement')
    const text = `「✦」 *El grupo ha sido cerrado temporalmente.*`
    await conn.sendMessage(group, { text, mentions: participants.map(v => v.id) }, { quoted: fkontak })
  }
}

handler.help = ['abrir', 'cerrar']
handler.tags = ['grupo']
handler.command = /^(abrir|cerrar)$/i
handler.admin = true
handler.group = true

export default handler