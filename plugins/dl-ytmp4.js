import fetch from "node-fetch"
import yts from 'yt-search'

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text?.trim()) return conn.reply(m.chat, `❀ Por favor, ingresa el nombre o link de YouTube.`, m)

    let videoIdToFind = text.match(youtubeRegexID) || null
    let searchQuery = videoIdToFind ? 'https://youtu.be/' + videoIdToFind[1] : text
    let ytplay2 = await yts(searchQuery)

    
    let video = null
    if (videoIdToFind && ytplay2.videos?.length) {
      video = ytplay2.videos.find(v => v.videoId === videoIdToFind[1])
    }
    if (!video) video = ytplay2.videos?.[0] || null
    if (!video) return m.reply('✧ No se encontraron resultados para tu búsqueda.')

    const { title, url, thumbnail } = video
    const thumb = thumbnail ? (await conn.getFile(thumbnail))?.data : null

    if (['play', 'yta', 'ytmp3', 'playaudio'].includes(command)) {
      const api = await (await fetch(`${global.apiadonix}/download/ytmp3?apikey=Adofreekey&url=${encodeURIComponent(url)}`)).json()
      if (!api?.data?.url) return conn.reply(m.chat, '⚠︎ No se pudo obtener el audio desde la API.', m)
      await conn.sendMessage(
        m.chat,
        {
          audio: { url: api.data.url },
          fileName: `${title || 'audio'}.mp3`,
          mimetype: 'audio/mpeg'
        },
        { quoted: m }
      )
    } else if (['play2', 'ytv', 'ytmp4', 'mp4'].includes(command)) {
      const api = await (await fetch(`${global.apiadonix}/download/ytmp4?apikey=Adofreekey&url=${encodeURIComponent(url)}`)).json()
      if (!api?.data?.url) return conn.reply(m.chat, '⚠︎ No se pudo obtener el video desde la API.', m)
      await conn.sendMessage(
        m.chat,
        {
          video: { url: api.data.url },
          mimetype: 'video/mp4',
          fileName: `${title || 'video'}.mp4`,
          thumbnail: thumb
        },
        { quoted: m }
      )
    } else {
      return conn.reply(m.chat, '✧︎ Comando no reconocido.', m)
    }

  } catch (error) {
    console.error(error)
    return m.reply(`⚠︎ Ocurrió un error: ${error}`)
  }
}

handler.command = handler.help = ['yta', 'ytmp3', 'ytv', 'ytmp4']
handler.tags = ['descargas']
handler.group = true

export default handler