import ws from "ws"

const handler = async (m, { conn, participants, usedPrefix }) => {
    try {
        
        const allBots = [
            global.conn.user.jid,
            ...global.conns
                .filter(c => c.user?.jid && c.ws?.socket?.readyState !== ws.CLOSED)
                .map(c => c.user.jid)
        ]

        function convertirMsADiasHorasMinutosSegundos(ms) {
            const segundos = Math.floor(ms / 1000)
            const minutos = Math.floor(segundos / 60)
            const horas = Math.floor(minutos / 60)
            const días = Math.floor(horas / 24)
            const segRest = segundos % 60
            const minRest = minutos % 60
            const horasRest = horas % 24
            let resultado = ""
            if (días) resultado += `${días} días, `
            if (horasRest) resultado += `${horasRest} horas, `
            if (minRest) resultado += `${minRest} minutos, `
            if (segRest) resultado += `${segRest} segundos`
            return resultado.trim()
        }

        // Bots en el grupo
        const groupBots = allBots.filter(bot => participants.some(p => p.id === bot))

        const botsGroup = groupBots.length > 0
            ? groupBots.map(bot => {
                const isMainBot = bot === global.conn.user.jid
                const subSock = global.conns.find(c => c.user?.jid === bot)
                const uptime = isMainBot
                    ? convertirMsADiasHorasMinutosSegundos(Date.now() - (global.conn.uptime || Date.now()))
                    : subSock?.isInit
                        ? convertirMsADiasHorasMinutosSegundos(Date.now() - (subSock?.uptime || Date.now()))
                        : "Activo desde ahora"
                const mention = bot.replace(/[^0-9]/g, '')
                return `@${mention}\n> Bot: ${isMainBot ? 'Principal' : 'Sub-Bot'}\n> Online: ${uptime}`
            }).join("\n\n")
            : `✧ No hay bots activos en este grupo`

        const message = `*「 ✦ 」 Lista de bots activos*\n
❀ Principal: *1*
✿ Subs: *${allBots.length - 1}*

❏ En este grupo: *${groupBots.length}* bots
${botsGroup}`

        const mentionList = groupBots.map(bot => bot.endsWith("@s.whatsapp.net") ? bot : `${bot}@s.whatsapp.net`)

        await conn.sendMessage(m.chat, {
            text: message,
            contextInfo: { mentionedJid: mentionList }
        }, { quoted: m })

    } catch (err) {
        m.reply(`⚠︎ Se ha producido un error.\n> Usa *${usedPrefix}report* para informarlo.\n\n${err.message}`)
    }
}

handler.tags = ["serbot"]
handler.help = ["botlist"]
handler.command = ["botlist", "listbots", "listbot", "bots", "sockets", "socket"]

export default handler
