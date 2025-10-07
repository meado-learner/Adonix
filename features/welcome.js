import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  try {
    if (!m.messageStubType || !m.isGroup) return true;

    const chat = global.db.data?.chats?.[m.chat] || {}
    const user = m.messageStubParameters?.[0] || m.sender

    const fkontak = { 
      key: { 
        participants: "0@s.whatsapp.net", 
        remoteJid: "status@broadcast", 
        fromMe: false, 
        id: "Halo" 
      }, 
      message: { 
        contactMessage: { 
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${user.split('@')[0]}:${user.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` 
        }
      }, 
      participant: "0@s.whatsapp.net"
    };

    let pp = await conn.profilePictureUrl(user, 'image').catch(_ => 'https://files.catbox.moe/p2eq60.jpg')
    let img = await (await fetch(pp)).buffer()

    let groupSize = participants.length
    if (m.messageStubType === 27) groupSize++
    else if (m.messageStubType === 28 || m.messageStubType === 32) groupSize--

    
    if (chat.welcome && m.messageStubType === 27) {
      const bienvenida = `𝗕𝗶𝗲𝗻𝘃𝗲𝗻𝗶𝗱𝗼(a) @${user.split('@')[0]}
☆ Esperamos que tu participación en este *grupo* sea constructiva y respetuosa.
✎ Puedes usar *#help* para ver todos los comandos disponibles.
〄╏ 𝗔𝗣𝗜:
https://apiadonix.kozow.com`
      await conn.sendMessage(m.chat, { image: img, caption: bienvenida, mentions: [user] }, { quoted: fkontak })
    }

    
    if (chat.welcome && (m.messageStubType === 28 || m.messageStubType === 32)) {
      const bye = `@${user.split('@')[0]} 𝗦𝗲 𝗵𝗮 𝗿𝗲𝘁𝗶𝗿𝗮𝗱𝗼 𝗱𝗲𝗹 𝐆𝐫𝐮𝐩𝐨
「❏」 Actualmente, el grupo cuenta con *${groupSize}* miembros.
✎ Puedes usar *#help* para ver todos los comandos disponibles.
〄╏ 𝗔𝗣𝗜:
https://apiadonix.kozow.com`
      await conn.sendMessage(m.chat, { image: img, caption: bye, mentions: [user] }, { quoted: fkontak })
    }

  } catch (err) {
    console.error('Error en welcome plugin:', err)
  }
}
