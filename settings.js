import { watchFile, unwatchFile } from "fs"
import chalk from "chalk"
import { fileURLToPath } from "url"
import fs from "fs"
import path from "path"

global.botNumber = ""
global.owner = ["50493732693"]
global.suittag = [""]
global.prems = []
global.id_canal = ["120363403739366547@newsletter"]
global.name_canal = ["ෆ 𝖲𝗎𝗉𝗉𝗈𝗋𝗍 𝖠𝖽𝗈 ❏"]

global.libreria = "Baileys Multi Device"
global.vs = "^Latest"
global.nameqr = "Hamsty-MD"
global.sessions = "Sessions/Principal"
global.jadi = "Sessions/SubBot"
global.duckJadibts = true
global.apiadonix = 'https://apiadonix.kozow.com'
global.mayapi = 'https://mayapi.ooguy.com'

export const defaultSettings = {
    botname: "𝐇𝐚𝐦𝐬𝐭𝐲 𝐀𝐃",
    textbot: "💚 𝗛𝗮𝗺𝘀𝘁𝘆, mᥲძᥱ ᥕі𝗍һ ᑲᥡ 𝗔𝗱𝗼",
    dev: "☀︎ 𝖬𝖺𝖽𝖾 𝖡𝗒 𝗔𝗱𝗼",
    author: "© mᥲძᥱ ᥕі𝗍һ ᑲᥡ 𝗔𝗱𝗼",
    etiqueta: "𝗔𝗱𝗼",
    currency: "𝖢𝗁𝗈𝖼𝗈𝖥𝗋𝖾𝗌𝖺𝗌",
    banner: "https://files.catbox.moe/1fd272.jpg",
    icono: "https://files.catbox.moe/esmvnn.jpg"
}

Object.assign(global, defaultSettings)

function leerSubBotConfig(senderBotNumber) {
    const configPath = path.join(global.jadi, senderBotNumber, 'config.json')
    if (fs.existsSync(configPath)) {
        try {
            const data = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
            return {
                name: data.name || defaultSettings.botname,
                banner: data.banner || defaultSettings.banner,
                video: data.video || null
            }
        } catch (e) {
            console.error("Error leyendo config subbot:", e)
        }
    }
    return { name: defaultSettings.botname, banner: defaultSettings.banner, video: null }
}


global.setSubBotData = (conn) => {
    const senderBotNumber = conn.user.jid.split('@')[0]
    const subBotData = leerSubBotConfig(senderBotNumber)
    global.botname = subBotData.name
    global.banner = subBotData.banner
    global.video = subBotData.video
}


let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
    unwatchFile(file)
    console.log(chalk.redBright("Update 'settings.js'"))
    import(`${file}?update=${Date.now()}`)
})
