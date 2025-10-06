import yts from 'yt-search'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `「✦」 *INGRESA LO QUE QUIERAS BUSCAR*\n\n> ❍ Ejemplo » *${usedPrefix + command} Peso Pluma*`
  
  try {
    let wait = await m.reply('「❀」 *BUSCANDO EN YOUTUBE...*')
    
    let search = await yts(text)
    let videos = search.videos.slice(0, 6)

    if (videos.length === 0) {
      await conn.sendMessage(m.chat, { 
        text: `「☆」 *NO SE ENCONTRARON RESULTADOS*\n\n> ❍ Búsqueda » *${text}*` 
      }, { quoted: m })
      return
    }

    let resultsText = `「✿」 *RESULTADOS DE YOUTUBE*\n\n`
    resultsText += `> ❍ Búsqueda » *${text}*\n`
    resultsText += `> ❐ Encontrados » *${videos.length} videos*\n\n`
    resultsText += `❐━━━━━━━━━━━━━━━━━━❏\n\n`

    videos.forEach((video, index) => {
      resultsText += `「✦」 *${video.title}*\n\n`
      resultsText += `> ❍ Canal » *${video.author.name}*\n`
      resultsText += `> ❐ Vistas » *${video.views}*\n`
      resultsText += `> ❀ Duración » *${video.timestamp}*\n`
      resultsText += `> ❖ Publicado » *${video.ago}*\n`
      resultsText += `> ➣ Link » ${video.url}\n\n`
      resultsText += `❐──────────────────❏\n\n`
    })

    resultsText += `「✦」 *INSTRUCCIONES*\n\n`
    resultsText += `> ❍ Audio » *${usedPrefix}play <url>*\n`
    resultsText += `> ❐ Video » *${usedPrefix}play2 <url>*`

    await conn.sendMessage(m.chat, {
      text: resultsText,
      contextInfo: {
        externalAdReply: {
          title: `» YouTube Search`,
          body: `❀ ${videos.length} resultados • ✦ ${text.substring(0, 20)}...`,
          thumbnail: (await conn.getFile(videos[0].thumbnail)).data,
          sourceUrl: videos[0].url
        }
      }
    }, { quoted: m })

    if (wait) await conn.sendMessage(m.chat, { delete: wait.key })

  } catch (error) {
    console.error(error)
    await m.reply(`「❗」 *ERROR AL BUSCAR*\n\n> ❍ Error » *${error.message}*`)
  }
}

handler.help = ['youtube', 'ytsearch']
handler.tags = ['buscadores']
handler.command = /^(youtube|ytsearch|ytbuscar|buscarYT)$/i

export default handler
