import ws from 'ws'

const handler = async (m, { conn }) => {
  const subBots = [
    ...new Set([
      ...global.conns
        .filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED)
        .map((conn) => conn.user.jid)
    ])
  ]
  
  if (global.conn?.user?.jid && !subBots.includes(global.conn.user.jid)) {
    subBots.push(global.conn.user.jid)
  }
  
  const chat = global.db.data.chats[m.chat]
  const mentionedJid = await m.mentionedJid
  const who = mentionedJid[0] ? mentionedJid[0] : m.quoted ? await m.quoted.sender : false
  
  if (!who) {
    return conn.reply(
      m.chat, 
      `❀ *Error de Selección*\n\n> Por favor, menciona o responde a un mensaje del Socket que deseas establecer como Bot principal del grupo.`, 
      m
    )
  }
  
  if (!subBots.includes(who)) {
    return conn.reply(
      m.chat, 
      `❀ *Socket No Válido*\n\n> El usuario mencionado no es un Socket activo de *${botname}*.\n> Verifica que el bot esté conectado correctamente.`, 
      m
    )
  }
  
  if (chat.primaryBot === who) {
    return conn.reply(
      m.chat, 
      `❀ *Bot Primario Actual*\n\n> @${who.split`@`[0]} ya está establecido como Bot primario en este grupo.\n> No es necesario realizar cambios.`, 
      m, 
      { mentions: [who] }
    )
  }
  
  try {
    chat.primaryBot = who
    
    conn.reply(
      m.chat, 
      `❀ *Bot Primario Actualizado*\n\n> Se ha establecido exitosamente a @${who.split`@`[0]} como Bot primario de este grupo.\n\n*Nota:* Todos los comandos ejecutados en este grupo ahora serán procesados por @${who.split`@`[0]}.`, 
      m, 
      { mentions: [who] }
    )
  } catch (e) {
    console.error('Error al establecer Bot primario:', e)
    conn.reply(
      m.chat, 
      `❀ *Error del Sistema*\n\n> Se ha producido un problema al intentar establecer el Bot primario.\n> Usa *${usedPrefix}report* para informar este error.\n\n*Detalles:*\n\`\`\`${e.message}\`\`\``, 
      m
    )
  }
}

handler.help = ['setprimary']
handler.tags = ['grupo']
handler.command = ['setprimary', 'botprimario', 'primarybot']
handler.group = true
handler.admin = true

export default handler
