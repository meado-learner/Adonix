import fetch from "node-fetch"
import yts from 'yt-search'

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text?.trim()) return conn.reply(m.chat, `❀ Por favor, ingresa el nombre o link de YouTube.`, m)

    let videoIdToFind = text.match(youtubeRegexID) || null
    let ytplay2 = await yts(videoIdToFind === null ? text : 'https://youtu.be/' + videoIdToFind[1])

    if (videoIdToFind) {
      const videoId = videoIdToFind[1]
      ytplay2 = ytplay2.all.find(item => item.videoId === videoId) || ytplay2.videos.find(item => item.videoId === videoId)
    }

    ytplay2 = ytplay2.all?.[0] || ytplay2.videos?.[0] || ytplay2
    if (!ytplay2) return m.reply('✧ No se encontraron resultados para tu búsqueda.')

    const { title, url, thumbnail } = ytplay2
    const thumb = (await conn.getFile(thumbnail))?.data

    
    if (['play', 'yta', 'ytmp3', 'playaudio'].includes(command)) {
      const api = await (await fetch(`${global.apiadonix}/download/ytmp3?apikey=Adofreekey&url=${encodeURIComponent(url)}`)).json()
      if (!api?.data?.url) return conn.reply(m.chat, '⚠︎ No se pudo obtener el audio desde la API.', m)
      await conn.sendMessage(
        m.chat,
        {
          audio: { url: api.data.url },
          fileName: `${title}.mp3`,
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
          fileName: `${title}.mp4`,
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