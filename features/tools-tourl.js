import fs from 'fs'
import path from 'path'
import axios from 'axios'
import FormData from 'form-data'
import { fileTypeFromBuffer } from 'file-type'

const handler = async (m, { conn, command }) => {
  const q = m.quoted || m
  const mime = (q.msg || q).mimetype || q.mediaType || ''
  
  if (!mime) {
    return conn.sendMessage(m.chat, {
      text: `❐ Envía un archivo con el texto *.${command}* o responde al archivo con este comando.`,
    }, { quoted: m })
  }

  const media = await q.download()
  const tempDir = './tmp'
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

  const ext = mime.split('/')[1] || 'dat'
  const fileName = `media_${Date.now()}.${ext}`
  const filePath = path.join(tempDir, fileName)
  fs.writeFileSync(filePath, media)

  const buffer = fs.readFileSync(filePath)

  await conn.sendMessage(m.chat, {
    react: { text: '🕓', key: m.key }
  })

  const uploadToSupa = async (buffer) => {
    try {
      const form = new FormData()
      form.append('file', buffer, 'upload.jpg')
      const res = await axios.post('https://i.supa.codes/api/upload', form, {
        headers: form.getHeaders()
      })
      return res.data?.link || null
    } catch (err) {
      console.error('Error Supa:', err?.response?.data || err.message)
      return null
    }
  }

  const uploadToTmpFiles = async (filePath) => {
    try {
      const buf = fs.readFileSync(filePath)
      const { ext, mime } = await fileTypeFromBuffer(buf)
      const form = new FormData()
      form.append('file', buf, {
        filename: `${Date.now()}.${ext}`,
        contentType: mime
      })
      const res = await axios.post('https://tmpfiles.org/api/v1/upload', form, {
        headers: form.getHeaders()
      })
      return res.data.data.url.replace('s.org/', 's.org/dl/')
    } catch (err) {
      console.error('Error TmpFiles:', err)
      return null
    }
  }

  const uploadToUguu = async (filePath) => {
    try {
      const form = new FormData()
      form.append('files[]', fs.createReadStream(filePath))
      const res = await axios.post('https://uguu.se/upload.php', form, {
        headers: form.getHeaders()
      })
      return res.data.files?.[0]?.url || null
    } catch (err) {
      console.error('Error Uguu:', err)
      return null
    }
  }

  const uploadToFreeImageHost = async (buffer) => {
    try {
      const form = new FormData()
      form.append('source', buffer, 'file')
      const res = await axios.post('https://freeimage.host/api/1/upload', form, {
        params: {
          key: '6d207e02198a847aa98d0a2a901485a5'
        },
        headers: form.getHeaders()
      })
      return res.data.image.url
    } catch (err) {
      console.error('Error FreeImageHost:', err?.response?.data || err.message)
      return null
    }
  }

  let message = '*❏ Archivo subido exitosamente:*\n'

  const [supa, tmp, uguu, freehost] = await Promise.all([
    uploadToSupa(buffer),
    uploadToTmpFiles(filePath),
    uploadToUguu(filePath),
    uploadToFreeImageHost(buffer),
  ])

  if (supa) message += `\n✿ *Supa.codes:* ${supa}`
  if (tmp) message += `\n✿ *TmpFiles.org:* ${tmp}`
  if (uguu) message += `\n✿ *Uguu.se:* ${uguu}`
  if (freehost) message += `\n✿ *FreeImage.Host:* ${freehost}`

  if (!supa && !tmp && !uguu && !freehost) {
    message = '❌ Error al subir el archivo a todos los servicios.'
  }

  await conn.sendMessage(m.chat, { text: message }, { quoted: m })
  await conn.sendMessage(m.chat, {
    react: { text: '✅', key: m.key }
  })

  fs.unlinkSync(filePath)
}

handler.help = ['tourl']
handler.tags = ['uploader']
handler.command = /^(tourl)$/i

export default handler
