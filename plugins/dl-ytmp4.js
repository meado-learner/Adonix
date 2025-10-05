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

export default handler