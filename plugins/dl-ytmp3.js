import fetch from 'node-fetch'
import yts from 'yt-search'

let handler = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, '「✿」 Ingresa el nombre o link de YouTube', m)
  await m.react('🕓')
  try {
    let url
    if (text.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/i)) {
      url = text.trim()
    } else {
      let res = await yts(text)
      let video = res.videos && res.videos.length ? res.videos[0] : null
      if (!video) return conn.reply(m.chat, '「✦」 No se encontró ningún resultado', m)
      url = `https://youtube.com/watch?v=${video.videoId}`
    }

    const api = `${global.apiadonix}/download/ytmp3?apikey=Adofreekey&url=${encodeURIComponent(url)}`
    const r = await fetch(api)
    const json = await r.json()
    if (!json || !json.data || !json.data.url) {
      await m.react('❌')
      return conn.reply(m.chat, '「✦」 No se pudo obtener el audio.', m)
    }

    const audioUrl = json.data.url
    await conn.sendMessage(
      m.chat,
      { audio: { url: audioUrl }, mimetype: 'audio/mpeg', ptt: false },
      { quoted: m }
    )
    await m.react('✅')
  } catch (e) {
    console.error(e)
    await m.react('❌')
    conn.reply(m.chat, '「#」 Error al procesar tu solicitud.', m)
  }
}

handler.help = ['ytmp3 <texto o enlace>']
handler.tags = ['descargas']
handler.command = ['ytmp3']

export default handler