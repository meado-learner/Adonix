const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(
      m.chat,
      `> Por favor, proporciona el nombre del canal de YouTube.\n\n*Ejemplo:*\n${usedPrefix}${command} MrBeast`,
      m
    )
  }

  const username = text.trim().replace('@', '')
  const apiUrl = `https://apiadonix.kozow.com/stalk/youtube?apikey=Adofreekey&user=${encodeURIComponent(username)}`

  await m.react('🕓')

  try {
    const response = await fetch(apiUrl)
    const data = await response.json()

    if (!data.status || !data.data) {
      throw new Error('No se encontró el canal de YouTube')
    }

    const { channelData, videos } = data.data
    
    let message = `「✦」 Información de *${channelData.username}*\n\n`
    message += `> ✐ Suscriptores » *${channelData.subscriberCount}*\n`
    message += `> ⴵ Contenido Familiar » *${channelData.isFamilySafe ? 'Sí' : 'No'}*\n`
    message += `> 🜸 Link » ${channelData.channelUrl}\n\n`

    if (channelData.description) {
      const shortDesc = channelData.description.length > 150 
        ? channelData.description.substring(0, 150) + '...' 
        : channelData.description
      message += `> ✰ Descripción » *${shortDesc.replace(/\n/g, ' ')}*\n\n`
    }

    if (videos && videos.length > 0) {
      message += `*✜ Últimos Videos:*\n\n`
      videos.slice(0, 5).forEach((video, index) => {
        message += `${index + 1}. *${video.title}*\n`
        message += `> ✿ Duración » *${video.duration}*\n`
        message += `> ❏ Vistas » *${video.viewCount}*\n`
        message += `> ☆ Publicado » *${video.publishedTime}*\n`
        message += `> 🜸 Link » https://www.youtube.com${video.navigationUrl}\n\n`
      })
    }

    message += ``

    await conn.sendFile(
      m.chat,
      channelData.avatarUrl,
      'avatar.jpg',
      message,
      m
    )

    await m.react('✅')
  } catch (e) {
    console.error('Error al buscar canal de YouTube:', e)
    await m.react('❌')
    conn.reply(
      m.chat,
      `❀ *Error de Búsqueda*\n\n> No se pudo encontrar información del canal de YouTube.\n> Verifica que el nombre de usuario sea correcto.\n\n*Detalles:*\n\`\`\`${e.message}\`\`\``,
      m
    )
  }
}

handler.help = ['ytstalk']
handler.tags = ['stalks']
handler.command = ['ytstalk', 'youtubestalk', 'ytstalker', 'ytinfo']

export default handler
