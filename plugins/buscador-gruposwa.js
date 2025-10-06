import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.sendMessage(m.chat, { 
      text: `「✦」 *INGRESA TU BÚSQUEDA*\n\n> ❍ Uso » ${usedPrefix + command} Minecraft\n> ❐ Ejemplo » ${usedPrefix + command} Anime\n> ❀ Ejemplo » ${usedPrefix + command} Programación` 
    }, { quoted: m })
  }
  
  try {
    let wait = await conn.sendMessage(m.chat, { 
      text: '「❀」 *BUSCANDO GRUPOS DE WHATSAPP...*' 
    }, { quoted: m })
    
    let apiUrl = `https://apiadonix.kozow.com/search/wpgroups?apikey=Adofreekey&q=${encodeURIComponent(text)}`
    let response = await fetch(apiUrl)
    let data = await response.json()

    if (!data.status || !data.data || data.data.length === 0) {
      return conn.sendMessage(m.chat, { 
        text: `「☆」 *NO HAY RESULTADOS*\n\n> ❍ Búsqueda » ${text}\n> ❐ Sugerencia » Prueba con otros términos` 
      }, { quoted: m })
    }

    let groups = data.data.slice(0, 6)
    
    let resultsText = `「❍」 *RESULTADOS DE GRUPOS*\n\n`
    resultsText += `> ❍ Término » ${text}\n`
    resultsText += `> ❐ Resultados » ${groups.length}\n\n`
    resultsText += `❐━━━━━━━━━━━━━━━━━━❏\n\n`

    groups.forEach((group, index) => {
      resultsText += `「${index + 1}」 *${group.name}*\n`
      resultsText += `> ➣ ${group.link}\n\n`
    })

    resultsText += `❐━━━━━━━━━━━━━━━━━━❏\n\n`
    resultsText += `「✧」 *INSTRUCCIONES*\n\n`
    resultsText += `> ❍ Paso 1 » Toca el enlace del grupo\n`
    resultsText += `> ❐ Paso 2 » Selecciona "Abrir en WhatsApp"\n`
    resultsText += `> ❀ Paso 3 » Presiona "Unirse al grupo"`

    await conn.sendMessage(m.chat, { 
      text: resultsText 
    }, { quoted: m })

    if (wait) {
      await conn.sendMessage(m.chat, { 
        delete: wait.key 
      })
    }

  } catch (error) {
    console.error(error)
    await conn.sendMessage(m.chat, { 
      text: `「❗」 *ERROR EN LA BÚSQUEDA*\n\n> ❍ Problema » ${error.message}\n> ❐ Solución » Intenta nuevamente en unos minutos` 
    }, { quoted: m })
  }
}

handler.help = ['searchgroup']
handler.tags = ['buscadores']
handler.command = /^(buscarGrupo|grupos|searchgroup|buscargrupos|gruposwa)$/i

export default handler
