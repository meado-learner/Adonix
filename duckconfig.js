import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

global.owner = [
  ['50493732693', '-', true],
  ['51921826291']
]

global.vips = []
global.sessions = "Sessions/Principal"
global.jadi = "Sessions/SubBot"

global.nombre2 = '✎ 𝖧𝖺𝗓𝗓𝖺𝗆, mᥲძᥱ ᥕі𝗍һ 𝗔𝗱𝗼'
global.autor = '𝗔𝗱𝗼'
global.nombre = 'Hazzam'
global.img = 'https://files.catbox.moe/0hfvjz.jpg'

global.name_canal = 'Support Ado ^°^'
global.id_canal = '120363403739366547@newsletter'
global.canal = ''
global.currency = 'Caramelos'

global.apiadonix = 'https://apiadonix.kozow.com'
global.mayapi = 'https://mayapi.ooguy.com'

global.multiplier = 69
global.maxwarn = '2'

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright('Actualización detectada en duckconfig.js'))
  import(`${file}?update=${Date.now()}`)
})
