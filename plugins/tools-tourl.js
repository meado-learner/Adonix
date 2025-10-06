import fs from 'fs'
import path from 'path'
import axios from 'axios'
import FormData from 'form-data'
import { fileTypeFromBuffer } from 'file-type'

const handler = async (m, { conn, command, text }) => {
  const q = m.quoted || m
  const mime = (q.msg || q).mimetype || q.mediaType || ''
  
  if (!mime) {
    return conn.sendMessage(m.chat, {
      text: `⚠️ Envía un archivo con el texto *.${command}* o responde al archivo con este comando.`,
    }, { quoted: m })
  }


  if (!text) {
    const sections = [{
      title: "Servicios de Subida",
      rows: [
        { title: "📤 Supa.codes", description: "Subir a Supa.codes", rowId: ".tourl 1" },
        { title: "📁 TmpFiles.org", description: "Subir a TmpFiles.org", rowId: ".tourl 2" },
        { title: "🌐 Uguu.se", description: "Subir a Uguu.se", rowId: ".tourl 3" },
        { title: "🖼️ FreeImage.Host", description: "Subir a FreeImage.Host", rowId: ".tourl 4" },
        { title: "🚀 Todos los servicios", description: "Subir a todos a la vez", rowId: ".tourl 5" }
      ]
    }]

    const listMessage = {
      text: "*❏ SELECCIONA SERVICIO DE SUBIDA*\n\nElige dónde quieres subir tu archivo:",
      footer: "Bot de Subida de Archivos",
      title: "📂 Menú de Subida",
      buttonText: "Ver Opciones",
      sections
    }
    
    return conn.sendMessage(m.chat, listMessage, { quoted: m })
  }

  const option = text.trim()
  const validOptions = ['1', '2', '3', '4', '5']
  
  if (!validOptions.includes(option)) {
    return conn.sendMessage(m.chat, {
      text: '⚠️ Opción inválida. Usa un número del 1 al 5.'
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
    react: { text: '⏳', key: m.key }
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
  let uploadResult

  switch(option) {
    case '1':
      uploadResult = await uploadToSupa(buffer)
      if (uploadResult) message += `\n✿ *Supa.codes:* ${uploadResult}`
      break
    case '2':
      uploadResult = await uploadToTmpFiles(filePath)
      if (uploadResult) message += `\n✿ *TmpFiles.org:* ${uploadResult}`
      break
    case '3':
      uploadResult = await uploadToUguu(filePath)
      if (uploadResult) message += `\n✿ *Uguu.se:* ${uploadResult}`
      break
    case '4':
      uploadResult = await uploadToFreeImageHost(buffer)
      if (uploadResult) message += `\n✿ *FreeImage.Host:* ${uploadResult}`
      break
    case '5':
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
      break
  }

  if (!uploadResult && option !== '5') {
    message = '❌ Error al subir el archivo. Intenta con otro servicio.'
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
