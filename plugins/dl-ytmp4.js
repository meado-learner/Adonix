import fetch from 'node-fetch'
import yts from 'yt-search'

let handler = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, '「✿」 Ingresa el nombre o link de YouTube', m)
  await m.react('🕓')
  try {
    let url, video
    if (text.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/i)) {
      url = text.trim()
      let id = url.split('v=')[1] || url.split('/').pop()
      let res = await yts({ videoId: id })
      video = res.videos && res.videos[0] ? res.videos[0] : null
    } else {
      let res = await yts(text)
      video = res.videos && res.videos.length ? res.videos[0] : null
      if (!video) return conn.reply(m.chat, '「✦」 No se encontró ningún resultado', m)
      url = `https://youtube.com/watch?v=${video.videoId}`
    }

    const api = `${global.apiadonix}/download/ytmp4?apikey=Adofreekey&url=${encodeURIComponent(url)}`
    const r = await fetch(api)
    const json = await r.json()
    if (!json || !json.data || !json.data.url) {
      await m.react('❌')
      return conn.reply(m.chat, '「✦」 No se pudo obtener el video.', m)
    }

    const videoUrl = json.data.url
    const caption = `☆ *${video.title}*\n✦ *Canal:* ${video.author?.name || 'Desconocido'}\n✿ *Duración:* ${video.timestamp}\n❀ *URL:* ${url}`

    await conn.sendMessage(
      m.chat,
      {
        video: { url: videoUrl },
        mimetype: 'video/mp4',
        caption,
        thumbnail: video.thumbnail,
      },
      { quoted: m }
    )
    await m.react('✅')
  } catch (e) {
    console.error(e)
    await m.react('❌')
    conn.reply(m.chat, '「#」 Error al procesar tu solicitud.', m)
  }
}

handler.help = ['ytmp4']
handler.tags = ['descargas']
handler.command = ['ytmp4']

export default handler

/*import yts from 'yt-search'
import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, '「✿」 Ingresa el nombre o link de YouTube', m)

  await m.react('🕓')
  try {
    let res = await yts(text)
    let video = res.videos[0]
    if (!video) return conn.reply(m.chat, '「✦」 No se encontró ningún resultado', m)

    const url = `https://youtube.com/watch?v=${video.videoId}`
    const api = `${global.apiadonix}/download/ytmp4?apikey=Adofreekey&url=${encodeURIComponent(url)}`
    const r = await fetch(api)
    const json = await r.json()
    const videoUrl = json.data?.url

    if (!videoUrl) return conn.reply(m.chat, '「✦」 No se pudo obtener el video.', m)

    await conn.sendMessage(
      m.chat,
      { video: { url: videoUrl }, caption: '☆ 𝐀𝐪𝐮𝐢 𝐭𝐢𝐞𝐧𝐞𝐬 𝐭𝐮 𝐯𝐢𝐝𝐞𝐨' },
      { quoted: m }
    )

    await m.react('✅')
  } catch (e) {
    console.log(e)
    await m.react('❌')
    conn.reply(m.chat, '「#」 Error al procesar tu solicitud.', m)
  }
}

handler.help = ['ytmp4']
handler.tags = ['descargas']
handler.command = ['ytmp4']

export default handler*/