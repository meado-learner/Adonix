import yts from 'yt-search'
import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, '「✿」 Ingresa el nombre o link de YouTube', m)

  await m.react('🕓')
  try {
    let res = await yts(text)
    let video = res.videos[0]
    if (!video) return conn.reply(m.chat, '「✦」 No se encontró ningún resultado', m)

    const url = `https://youtube.com/watch?v=${video.videoId}`
    const api = `${global.apiadonix}/download/ytmp3?apikey=Adofreekey&url=${encodeURIComponent(url)}`
    const r = await fetch(api)
    const json = await r.json()
    const audioUrl = json.data?.url

    if (!audioUrl) return conn.reply(m.chat, '「✦」 No se pudo obtener el audio.', m)

    await conn.sendMessage(
      m.chat,
      { audio: { url: audioUrl }, mimetype: 'audio/mpeg', ptt: false },
      { quoted: m }
    )

    await m.react('✅')
  } catch (e) {
    console.log(e)
    await m.react('❌')
    conn.reply(m.chat, '「#」 Error al procesar tu solicitud.', m)
  }
}

handler.help = ['ytmp3']
handler.tags = ['descargas']
handler.command = ['ytmp3']

export default handler