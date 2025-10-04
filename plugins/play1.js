// ytaudio.js
import axios from "axios";
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

// Si tu entorno no soporta ESM, adapta a require(...) en consecuencia.

const API_ENDPOINT = "https://fast.dlsrv.online/gateway/audio"

// --- CONFIG: pon aquí los headers que conseguiste (pueden expirar) ---
const DEFAULT_HEADERS = {
  Accept: "application/json, text/plain, */*",
  "Content-Type": "application/json",
  "x-api-auth": "Ig9CxOQPYu3RB7GC21sOcgRPy4uyxFKTx54bFDu07G3eAMkrdVqXY9bBatu4WqTpkADrQ",
  "x-session-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpcCI6IjEwNC4yMy4xODcuMjQ2IiwiaWF0IjoxNzU5NTk1MDg1LCJleHAiOjE3NTk1OTU2ODV9.VUrGC03dlBoWmW5Ofm5oc89uKpB7ThU6HYUSeBwq3n0",
  "x-signature": "875681b35f9ba3a307192fb69d4694486c728fae8402b73285da272c40718a46",
  "x-signature-timestamp": "1759595084792",
  nonce: "54867",
  powhash: "000098376099b92fa634842d851610e30ed0055c637aa8f1ade95b5e54c3de2f",
  "cache-control": "private",
  // Otros headers que quieras incluir...
}

// Utilidad: crea un archivo temporal con extensión .mp3
function tempFilePath(filename = "yt_audio") {
  const tmpDir = os.tmpdir()
  const safeName = filename.replace(/[\/\\?%*:|"<>]/g, "_").slice(0, 120)
  return path.join(tmpDir, `${safeName}-${Date.now()}.mp3`)
}

// Hace la petición a gateway/audio y devuelve el objeto JSON de respuesta
async function requestAudioTunnel(videoId, headers = DEFAULT_HEADERS) {
  const body = { videoId: videoId, quality: "320" } // ajusta quality si quieres
  const res = await axios.post(API_ENDPOINT, body, {
    headers,
    timeout: 20000,
  })
  return res.data
}

// Descarga el recurso de `url` (stream) a archivo temporal y retorna path
async function downloadToTemp(url, filenameHint = "audio") {
  const tmpPath = tempFilePath(filenameHint)
  const writer = fs.createWriteStream(tmpPath)
  const response = await axios.get(url, {
    responseType: "stream",
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    timeout: 0, // permitir descargas largas (opcional)
  })
  return new Promise((resolve, reject) => {
    response.data.pipe(writer)
    let error = null
    writer.on("error", err => {
      error = err
      writer.close()
      reject(err)
    })
    writer.on("close", () => {
      if (!error) resolve(tmpPath)
    })
  })
}

// Plugin/handler exportado para tu bot
const handler = async (m, { conn, command, usedPrefix, args }) => {
  try {
    if (!args[0]) return m.reply(`⚠︎ Uso: ${usedPrefix}${command} <videoId|youtube_url>`)
    // Extraer videoId si el usuario pegó una URL
    let videoId = args[0]
    // si es una URL de youtube intentar extraer id
    const ytMatch = videoId.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:[&?]|$)/)
    if (ytMatch) videoId = ytMatch[1]

    await m.reply(`🔎 Procesando video: ${videoId} — solicitando audio...`)

    // 1) Llamada al endpoint gateway/audio
    const tunnelResp = await requestAudioTunnel(videoId)

    // ejemplo de lo que esperamos:
    // { status: "tunnel", url: "...", filename: "...", duration: 45 }
    if (!tunnelResp || !tunnelResp.url) {
      return m.reply("❌ Respuesta inválida del servicio (no vino 'url').")
    }

    // 2) Descargar el archivo desde tunnelResp.url
    // A veces la 'url' devuelve una redirección 302 a la URL final. axios seguirá redirs por defecto.
    const filename = tunnelResp.filename || `youtube-${videoId}.mp3`
    const tempPath = await downloadToTemp(tunnelResp.url, filename)

    // 3) Enviar el audio al chat
    // Ajusta el sendMessage al método de tu framework (aquí se usa la forma común)
    const stat = fs.statSync(tempPath)
    const fileSize = stat.size

    // Si tu conn.sendMessage acepta audio/documentas:
    await conn.sendMessage(m.chat, {
      document: fs.createReadStream(tempPath),
      fileName: filename,
      mimetype: "audio/mpeg",
      fileLength: fileSize,
    })

    // borrar archivo temporal
    fs.unlink(tempPath, (err) => {
      if (err) console.warn("No se pudo borrar temp file:", err)
    })

  } catch (err) {
    console.error("Error en handler ytaudio:", err)
    // Mensaje de error amigable al usuario
    const msg = (err && err.response && err.response.data) ? 
      `❌ Error del servicio: ${JSON.stringify(err.response.data)}` : `❌ Error: ${err.message || err}`
    try { await m.reply(msg) } catch(e){ console.error(e) }
  }
}

handler.tags = ["downloader", "tools"]
handler.help = ["ytaudio <id|url>"]
handler.command = ["ytaudio", "yta"] // alias
handler.group = false

export default handler
