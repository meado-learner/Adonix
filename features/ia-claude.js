const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(
      m.chat,
      `> Por favor, escribe tu pregunta o mensaje para la inteligencia artificial.\n\n*Ejemplo:*\n${usedPrefix}${command} ¿Cuál es la capital de Francia?\n${usedPrefix}${command} Explícame qué es la fotosíntesis`,
      m
    )
  }

  const prompt = encodeURIComponent(text)
  const apiUrl = `https://apiadonix.kozow.com/ai/claude?apikey=Adofreekey&text=${prompt}`

  await m.react('🕓')

  try {
    const response = await fetch(apiUrl)
    const data = await response.json()

    if (!data.status || !data.message) {
      throw new Error('Respuesta inválida de la API')
    }

    await conn.reply(
      m.chat,
      `❀ *Claude IA*\n\n> ${data.message}\n\n_Powered by ${data.creator}_`,
      m
    )

    await m.react('✅')
  } catch (e) {
    console.error('Error al consultar IA:', e)
    await m.react('❌')
    conn.reply(
      m.chat,
      `❀ *Error de Conexión*\n\n> No se pudo obtener respuesta de la inteligencia artificial.\n> Intenta nuevamente en unos momentos.\n\n*Detalles:*\n\`\`\`${e.message}\`\`\``,
      m
    )
  }
}

handler.help = ['claude']
handler.tags = ['inteligencia artificial']
handler.command = ['claude', 'ia', 'ai', 'chatai', 'pregunta']
handler.register = true

export default handler
