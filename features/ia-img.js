const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(
      m.chat,
      `> Por favor, proporciona una descripción de la imagen que deseas generar.\n\n*Ejemplo:*\n${usedPrefix}${command} un gato astronauta en el espacio`,
      m
    )
  }

  const prompt = encodeURIComponent(text)
  const apiUrl = `https://apiadonix.kozow.com/ai/iaimagen?apikey=Adofreekey&prompt=${prompt}`

  await conn.reply(
    m.chat,
    `> ❀ Creando imagen con IA...\n> Descripción: *${text}*\n\n_Esto puede tardar unos segundos..._`,
    m
  )

  try {
    await conn.sendFile(
      m.chat,
      apiUrl,
      'imagen-ia.jpg',
      `❀ *Imagen Generada*\n\n> Prompt: *${text}*`,
      m
    )
  } catch (e) {
    console.error('Error al generar imagen:', e)
    conn.reply(
      m.chat,
      `❀ *Error de Generación*\n\n> No se pudo generar la imagen solicitada.\n> Intenta con una descripción diferente o inténtalo más tarde.\n\n*Detalles:*\n\`\`\`${e.message}\`\`\``,
      m
    )
  }
}

handler.help = ['iaimagen']
handler.tags = ['inteligencia artificial']
handler.command = ['iaimagen', 'generarimagen', 'aiimg', 'imagenia']

export default handler
