import fetch from 'node-fetch'

let handler = async (m, { conn, args }) => {
let mentionedJid = await m.mentionedJid
let userId = mentionedJid && mentionedJid[0] ? mentionedJid[0] : m.sender
let totalreg = Object.keys(global.db.data.users).length
let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length
    
let txt = `̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮
▭࣪▬ִ▭࣪▬ִ▭࣪▬ִ▭࣪▬ִ▭࣪▬ִ▭࣪▬ִ▭࣪▬ִ▭࣪▬
> ☆ Hola! @${userId.split('@')[0]}, Soy *${botname}*, ${(conn.user.jid == global.conn.user.jid ? '𝐏𝐫𝐢𝐧𝐜𝐢𝐩𝐚𝐥' : '𝐒𝐮𝐛-𝐁𝐨𝐭')}

Aquí tienes la lista de comandos.

╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ؕ͜─ׄ͜─֬͜─֟͜─֫͜─ׄ͜─ؕ͜─݊͜┈ࠦ͜┅ࠡ͜͜┈࠭͜͜
│✰ *Usuarios* » ${totalreg.toLocaleString()}
│➮ *Versión* » ${vs}
│〄 *Plugins* » ${totalCommands}
│🜸 *Librería* » ${libreria}
╰▭࣪▬ִ▭࣪▬ִ▭࣪▬ִ▭࣪▬ִ▭࣪▬ִ▭࣪▬ִ▭࣪▬ִ▭࣪▬╯

╭╶͜▭࣪▬ִ▭࣪▬ִ▭࣪𐔌 *SOCKETS* ╶͜▭࣪▬ִ▭࣪▬ִ▭࣪
> ✦ Comandos para registrar tu propio Bot.
❏ *#qr • #code*
> ☆ Crear un Sub-Bot con un codigo QR/Code
❏ *#bots • #botlist*
> ☆ Ver el numero de bots activos.
❏ *#status • #estado*
> ☆ Ver estado del bot.
❏ *#setbanner*
> ☆ Cambiar la imagen global del bot.
❏ *#setname*
> ☆ Cambiar el nombre del bot.
❏ *#p • #ping*
> ☆ Medir tiempo de respuesta.
❏ *#join* + [Invitacion]
> ☆ Unir al bot a un grupo.
❏ *#leave • #salir*
> ☆ Salir de un grupo.
❏ *#logout*
> ☆ Cerrar sesion del bot.
❏ *#setpfp • #setimage*
> ☆ Cambiar la imagen de perfil
❏ *#setstatus* + [estado]
> ☆ Cambiar el estado del bot
❏ *#setusername* + [nombre]
> ☆ Cambiar el nombre de usuario
╰ׅ͜━─֟͜━⃔━━═̶፝֟͜══̶⃔━ٞ━━֟͜━━┈ࠢ͜╯ׅ

╭╶͜▭࣪▬ִ▭࣪▬ִ▭࣪𐔌 *ECONOMY* ╶͜▭࣪▬ִ▭࣪▬ִ▭࣪
> ✦ Comandos de *Economía* para ganar dinero.
❏ *#w • #work • #trabajar*
> ☆ Ganar coins trabajando.
❏ *#slut • #protituirse*
> ☆ Ganar coins prostituyéndote.
❏ *#coinflip • #flip • #cf* + [cantidad] <cara/cruz>
> ☆ Apostar coins en un cara o cruz.
❏ *#crime • #crimen*
> ☆ Ganar coins rapido.
❏ *#roulette • #rt* + [red/black] [cantidad]
> ☆ Apostar coins en una ruleta.
❏ *#casino • #apostar* • *#slot* + [cantidad]
> ☆ Apuestar coins en el casino.
❏ *#balance • #bal • #bank* + <usuario>
> ☆ Ver cuantos coins tienes en el banco.
❏ *#deposit • #dep • #depositar • #d* + [cantidad] | all
> ☆ Depositar tus coins en el banco.
❏ *#withdraw • #with • #retirar* + [cantidad] | all
> ☆ Retirar tus coins del banco.
❏ *#economyinfo • #einfo*
> ☆ Ver tu información de economía en el grupo.
❏ *#givecoins • #pay • #coinsgive* + [usuario] [cantidad]
> ☆ Dar coins a un usuario.
❏ *#miming • #minar • #mine*
> ☆ Realizar trabajos de minería y ganar coins.
❏ *#daily • #diario*
> ☆ Reclamar tu recompensa diaria.
❏ *#cofre* • *#coffer*
> ☆ Reclamar tu cofre diario.
❏ *#weekly • #semanal*
> ☆ Reclamar tu recompensa semanal.
❏ *#monthly • #mensual*
> ☆ Reclamar tu recompensa mensual.
❏ *#steal • #robar • #rob* + [@mencion]
> ☆ Intentar robar coins a un usuario.
❏ *#economyboard • #eboard • #baltop* + <pagina>
> ☆ Ver tu información de economía en el grupo.
❏ *#aventura • #adventure*
> ☆ Aventuras para ganar coins y exp.
❏ *#curar • #heal*
> ☆ Curar salud para salir de aventuras.
❏ *#cazar • #hunt*
> ☆ cazar animales para ganar coins y exp.
❏ *#fish • #pescar*
> ☆ Ganar coins y exp pescando.
❏ *#mazmorra • #dungeon*
> ☆ Explorar mazmorras para ganar coins y exp.
╰ׅ͜━─֟͜━⃔━━═̶፝֟͜══̶⃔━ٞ━━֟͜━━┈ࠢ͜╯ׅ

╭╶͜▭࣪▬ִ▭࣪▬ִ▭࣪𐔌 *DOWNLOAD* ╶͜▭࣪▬ִ▭࣪▬ִ▭࣪
> ✦ Comandos de *Descargas* para descargar archivos de varias fuentes.
❏ *#tiktok • #tt* + [Link] / [busqueda]
> ☆ Descargar un video de TikTok.
❏ *#mediafire • #mf* + [Link]
> ☆ Descargar un archivo de MediaFire.
❏ *#mega • #mg* + [Link]
> ☆ Descargar un archivo de MEGA.
❏ *#play • #play2 • #ytmp3 • #ytmp4* + [Cancion] / [Link]
> ☆ Descargar una cancion o vídeo de YouTube.
❏ *#facebook • #fb* + [Link]
> ☆ Descargar un video de Facebook.
❏ *#twitter • #x* + [Link]
> ☆ Descargar un video de Twitter/X.
❏ *#ig • #instagram* + [Link]
> ☆ Descargar un reel de Instagram.
❏ *#pinterest • #pin* + [busqueda] / [Link]
> ☆ Buscar y descargar imagenes de Pinterest.
❏ *#image • #imagen* + [busqueda]
> ☆ Buscar y descargar imagenes de Google.
❏ *#apk • #modapk* + [busqueda]
> ☆ Descargar un apk de Aptoide.
❏ *#ytsearch • #search* + [busqueda]
> ☆ Buscar videos de YouTube.
╰ׅ͜━─֟͜━⃔━━═̶፝֟͜══̶⃔━ٞ━━֟͜━━┈ࠢ͜╯ׅ

╭╶͜▭࣪▬ִ▭࣪▬ִ▭࣪𐔌 *GACHA* ╶͜▭࣪▬ִ▭࣪▬ִ▭࣪
> ✦ Comandos de *Gacha* para reclamar y colecciónar personajes.
❏ *#buycharacter • #buychar • #buyc* + [nombre]
> ☆ Comprar un personaje en venta.
❏ *#charimage • #waifuimage • #cimage • #wimage* + [nombre]
> ☆ Ver una imagen aleatoria de un personaje.
❏ *#charinfo • #winfo • #waifuinfo* + [nombre]
> ☆ Ver información de un personaje.
❏ *#claim • #c • #reclamar* + {citar personaje}
> ☆ Reclamar un personaje.
❏ *#delclaimmsg*
> ☆ Restablecer el mensaje al reclamar un personaje
❏ *#deletewaifu • #delwaifu • #delchar* + [nombre]
> ☆ Eliminar un personaje reclamado.
❏ *#favoritetop • #favtop*
> ☆ Ver el top de personajes favoritos.
❏ *#gachainfo • #ginfo • #infogacha*
> ☆ Ver tu información de gacha.
❏ *#giveallharem* + [@usuario]
> ☆ Regalar todos tus personajes a otro usuario.
❏ *#givechar • #givewaifu • #regalar* + [@usuario] [nombre]
> ☆ Regalar un personaje a otro usuario.
❏ *#robwaifu • #robarwaifu* + [@usuario]
> ☆ Robar un personaje a otro usuario.
❏ *#harem • #waifus • #claims* + <@usuario>
> ☆ Ver tus personajes reclamados.
❏ *#haremshop • #tiendawaifus • #wshop* + <Pagina>
> ☆ Ver los personajes en venta.
❏ *#removesale • #removerventa* + [precio] [nombre]
> ☆ Eliminar un personaje en venta.
❏ *#rollwaifu • #rw • #roll*
> ☆ Waifu o husbando aleatorio
❏ *#sell • #vender* + [precio] [nombre]
> ☆ Poner un personaje a la venta.
❏ *#serieinfo • #ainfo • #animeinfo* + [nombre]
> ☆ Información de un anime.
❏ *#serielist • #slist • #animelist*
> ☆ Listar series del bot
❏ *#setclaimmsg • #setclaim* + [mensaje]
> ☆ Modificar el mensaje al reclamar un personaje
❏ *#trade • #intercambiar* + [Tu personaje] / [Personaje 2]
> ☆ Intercambiar un personaje con otro usuario
❏ *#vote • #votar* + [nombre]
> ☆ Votar por un personaje para subir su valor.
❏ *#waifusboard • #waifustop • #topwaifus • #wtop* + [número]
> ☆ Ver el top de personajes con mayor valor.
╰ׅ͜━─֟͜━⃔━━═̶፝֟͜══̶⃔━ٞ━━֟͜━━┈ࠢ͜╯ׅ

╭╶͜▭࣪▬ִ▭࣪▬ִ▭࣪𐔌 *UTILITIES* ╶͜▭࣪▬ִ▭࣪▬ִ▭࣪
> ✦ Comandos de *Útilidades*.
❏ *#help • #menu*
> ☆ Ver el menú de comandos.
❏ *#sug • #suggest*
> ☆ Sugerir nuevas funciones al desarrollador.
❏ *#reporte • #reportar*
> ☆ Reportar fallas o problemas del bot.
❏ *#calcular • #cal*
> ☆ Calcular tipos de ecuaciones.
❏ *#delmeta*
> ☆ Restablecer el pack y autor por defecto para tus stickers.
❏ *#getpic • #pfp* + [@usuario]
> ☆ Ver la foto de perfil de un usuario.
❏ *#say* + [texto]
> ☆ Repetir un mensaje
❏ *#setmeta* + [autor] | [pack]
> ☆ Establecer el pack y autor por defecto para tus stickers.
❏ *#sticker • #s • #wm* + {citar una imagen/video}
> ☆ Convertir una imagen/video a sticker
❏ *#toimg • #img* + {citar sticker}
> ☆ Convertir un sticker/imagen de una vista a imagen.
❏ *#brat • #bratv • #qc • #emojimix*︎ 
> ☆ Crear stickers con texto.
❏ *#gitclone* + [Link]
> ☆ Descargar un repositorio de Github.
❏ *#enhance • #remini • #hd*
> ☆ Mejorar calidad de una imagen.
❏ *#letra • #style* 
> ☆ Cambia la fuente de las letras.
❏ *#read • #readviewonce*
> ☆ Ver imágenes viewonce.
❏ *#ss • #ssweb*
> ☆ Ver el estado de una página web.
❏ *#translate • #traducir • #trad*
> ☆ Traducir palabras en otros idiomas.
❏ *#ia • #gemini*
> ☆ Preguntar a Chatgpt.
❏ *#tourl • #catbox*
> ☆ Convertidor de imágen/video en urls.
❏ *#wiki • #wikipedia*
> ☆ Investigar temas a través de Wikipedia.
❏ *#dalle • #flux*
> ☆ Crear imágenes con texto mediante IA.
❏ *#npmdl • #nmpjs*
> ☆ Descargar paquetes de NPMJS.
❏ *#google*
> ☆ Realizar búsquedas por Google.
╰ׅ͜━─֟͜━⃔━━═̶፝֟͜══̶⃔━ٞ━━֟͜━━┈ࠢ͜╯ׅ

╭╶͜▭࣪▬ִ▭࣪▬ִ▭࣪𐔌 *PROFILES* ╶͜▭࣪▬ִ▭࣪▬ִ▭࣪
> ✦ Comandos de *Perfil* para ver y configurar tu perfil.
❏ *#leaderboard • #lboard • #top* + <Paginá>
> ☆ Top de usuarios con más experiencia.
❏ *#level • #lvl* + <@Mencion>
> ☆ Ver tu nivel y experiencia actual.
❏ *#marry • #casarse* + <@Mencion>
> ☆ Casarte con alguien.
❏ *#profile* + <@Mencion>
> ☆ Ver tu perfil.
❏ *#setbirth* + [fecha]
> ☆ Establecer tu fecha de cumpleaños.
❏ *#setdescription • #setdesc* + [Descripcion]
> ☆ Establecer tu descripcion.
❏ *#setgenre* + Hombre | Mujer
> ☆ Establecer tu genero.
❏ *#delgenre • #delgenero*
> ☆ Eliminar tu género.
❏ *#delbirth* + [fecha]
> ☆ Borrar tu fecha de cumpleaños.
❏ *#divorce*
> ☆ Divorciarte de tu pareja.
❏ *#setfavourite • #setfav* + [Personaje]
> ☆ Establecer tu claim favorito.
❏ *#deldescription • #deldesc*
> ☆ Eliminar tu descripción.
❏ *#prem • #vip*
> ☆ Comprar membresía premium.
╰ׅ͜━─֟͜━⃔━━═̶፝֟͜══̶⃔━ٞ━━֟͜━━┈ࠢ͜╯ׅ

╭╶͜▭࣪▬ִ▭࣪▬ִ▭࣪𐔌 *GROUPS* ╶͜▭࣪▬ִ▭࣪▬ִ▭࣪
> ✦ Comandos para *Administradores* de grupos.
❏ *#tag • #hidetag • #invocar • #tagall* + [mensaje]
> ☆ Envía un mensaje mencionando a todos los usuarios del grupo.
❏ *#detect • #alertas* + [enable/disable]
> ☆ Activar/desactivar las alertas de promote/demote
❏ *#antilink • #antienlace* + [enable/disable]
> ☆ Activar/desactivar el antienlace
❏ *#bot* + [enable/disable]
> ☆ Activar/desactivar al bot
❏ *#close • #cerrar*
> ☆ Cerrar el grupo para que solo los administradores puedan enviar mensajes.
❏ *#demote* + <@usuario> | {mencion}
> ☆ Descender a un usuario de administrador.
❏ *#economy* + [enable/disable]
> ☆ Activar/desactivar los comandos de economía
❏ *#gacha* + [enable/disable]
> ☆ Activar/desactivar los comandos de Gacha y Games.
❏ *#welcome • #bienvenida* + [enable/disable]
> ☆ Activar/desactivar la bienvenida y despedida.
❏ *#setbye* + [texto]
> ☆ Establecer un mensaje de despedida personalizado.
❏ *#setprimary* + [@bot]
> ☆ Establece un bot como primario del grupo.
❏ *#setwelcome* + [texto]
> ☆ Establecer un mensaje de bienvenida personalizado.
❏ *#kick* + <@usuario> | {mencion}
> ☆ Expulsar a un usuario del grupo.
❏ *#nsfw* + [enable/disable]
> ☆ Activar/desactivar los comandos NSFW
❏ *#onlyadmin* + [enable/disable]
> ☆ Permitir que solo los administradores puedan utilizar los comandos.
❏ *#open • #abrir*
> ☆ Abrir el grupo para que todos los usuarios puedan enviar mensajes.
❏ *#promote* + <@usuario> | {mencion}
> ☆ Ascender a un usuario a administrador.
❏ *#add • #añadir • #agregar* + {número}
> ☆ Invita a un usuario a tu grupo.
❏ *admins • admin* + [texto]
> ☆ Mencionar a los admins para solicitar ayuda.
❏ *#restablecer • #revoke*
> ☆ Restablecer enlace del grupo.
❏ *#addwarn • #warn* + <@usuario> | {mencion}
> ☆ Advertir aún usuario.
❏ *#unwarn • #delwarn* + <@usuario> | {mencion}
> ☆ Quitar advertencias de un usuario.
❏ *#advlist • #listadv*
> ☆ Ver lista de usuarios advertidos.
❏ *#inactivos • #kickinactivos*
> ☆ Ver y eliminar a usuarios inactivos.
❏ *#listnum • #kicknum* [texto]
> ☆ Eliminar usuarios con prefijo de país.
❏ *#gpbanner • #groupimg*
> ☆ Cambiar la imagen del grupo.
❏ *#gpname • #groupname* [texto]
> ☆ Cambiar la nombre del grupo.
❏ *#gpdesc • #groupdesc* [texto]
> ☆ Cambiar la descripción del grupo.
❏ *#del • #delete* + {citar un mensaje}
> ☆ Eliminar un mensaje.
❏ *#linea • #listonline*
> ☆ Ver lista de usuarios en linea.
❏ *#gp • #infogrupo*
> ☆ Ver la Informacion del grupo.
❏ *#link*
> ☆ Ver enlace de invitación del grupo.
╰ׅ͜━─֟͜━⃔━━═̶፝֟͜══̶⃔━ٞ━━֟͜━━┈ࠢ͜╯ׅׅ

╭╶͜▭࣪▬ִ▭࣪▬ִ▭࣪𐔌 *ANIME* ╶͜▭࣪▬ִ▭࣪▬ִ▭࣪
> ✦ Comandos de reacciones de anime.
❏ *#angry • #enojado* + <mencion>
> ☆ Estar enojado
❏ *#bath • #bañarse* + <mencion>
> ☆ Bañarse
❏ *#bite • #morder* + <mencion>
> ☆ Muerde a alguien
❏ *#bleh • #lengua* + <mencion>
> ☆ Sacar la lengua
❏ *#blush • #sonrojarse* + <mencion>
> ☆ Sonrojarte
❏ *#bored • #aburrido* + <mencion>
> ☆ Estar aburrido
❏ *#clap • #aplaudir* + <mencion>
> ☆ Aplaudir
❏ *#coffee • #cafe • #café* + <mencion>
> ☆ Tomar café
❏ *#cry • #llorar* + <mencion>
> ☆ Llorar por algo o alguien
❏ *#cuddle • #acurrucarse* + <mencion>
> ☆ Acurrucarse
❏ *#dance • #bailar* + <mencion>
> ☆ Sacate los pasitos prohíbidos
❏ *#dramatic • #drama* + <mencion>
> ☆ Drama
❏ *#drunk • #borracho* + <mencion>
> ☆ Estar borracho
❏ *#eat • #comer* + <mencion>
> ☆ Comer algo delicioso
❏ *#facepalm • #palmada* + <mencion>
> ☆ Darte una palmada en la cara
❏ *#happy • #feliz* + <mencion>
> ☆ Salta de felicidad
❏ *#hug • #abrazar* + <mencion>
> ☆ Dar un abrazo
❏ *#impregnate • #preg • #preñar • #embarazar* + <mencion>
> ☆ Embarazar a alguien
❏ *#kill • #matar* + <mencion>
> ☆ Toma tu arma y mata a alguien
❏ *#kiss • #muak* + <mencion>
> ☆ Dar un beso
❏ *#kisscheek • #beso* + <mencion>
> ☆ Beso en la mejilla
❏ *#laugh • #reirse* + <mencion>
> ☆ Reírte de algo o alguien
❏ *#lick • #lamer* + <mencion>
> ☆ Lamer a alguien
❏ *#love • #amor • #enamorado • #enamorada* + <mencion>
> ☆ Sentirse enamorado
❏ *#pat • #palmadita • #palmada* + <mencion>
> ☆ Acaricia a alguien
❏ *#poke • #picar* + <mencion>
> ☆ Picar a alguien
❏ *#pout • #pucheros* + <mencion>
> ☆ Hacer pucheros
❏ *#punch • #pegar • #golpear* + <mencion>
> ☆ Dar un puñetazo
❏ *#run • #correr* + <mencion>
> ☆ Correr
❏ *#sad • #triste* + <mencion>
> ☆ Expresar tristeza
❏ *#scared • #asustado • #asustada* + <mencion>
> ☆ Estar asustado
❏ *#seduce • #seducir* + <mencion>
> ☆ Seducir a alguien
❏ *#shy • #timido • #timida* + <mencion>
> ☆ Sentir timidez
❏ *#slap • #bofetada* + <mencion>
> ☆ Dar una bofetada
❏ *#sleep • #dormir* + <mencion>
> ☆ Tumbarte a dormir
❏ *#smoke • #fumar* + <mencion>
> ☆ Fumar
❏ *#spit • #escupir* + <mencion>
> ☆ Escupir
❏ *#step • #pisar* + <mencion>
> ☆ Pisar a alguien
❏ *#think • #pensar* + <mencion>
> ☆ Pensar en algo
❏ *#walk • #caminar* + <mencion>
> ☆ Caminar
❏ *#wink • #guiñar* + <mencion>
> ☆ Guiñar el ojo
❏ *#cringe • #avergonzarse* + <mencion>
> ☆ Sentir vergüenza ajena
❏ *#smug • #presumir* + <mencion>
> ☆ Presumir con estilo
❏ *#smile • #sonreir* + <mencion>
> ☆ Sonreír con ternura
❏ *#highfive • #5* + <mencion>
> ☆ Chocar los cinco
❏ *#bully • #bullying* + <mencion>
> ☆ Molestar a alguien
❏ *#handhold • #mano* + <mencion>
> ☆ Tomarse de la mano
❏ *#wave • #ola • #hola* + <mencion>
> ☆ Saludar con la mano
❏ *#waifu*
> ☆ Buscar una waifu aleatoria.
❏ *#ppcouple • #ppcp*
> ☆ Genera imágenes para amistades o parejas.
╰ׅ͜━─֟͜━⃔━━═̶፝֟͜══̶⃔━ٞ━━֟͜━━┈ࠢ͜╯

╭╶͜▭࣪▬ִ▭࣪▬ִ▭࣪𐔌 *NSFW* 𐦯╶͜▭࣪▬ִ▭࣪▬ִ▭࣪
❏ *#danbooru • #dbooru* + [Tags]
> ☆ Buscar imagenes en Danbooru
❏ *#gelbooru • #gbooru* + [Tags]
> ☆ Buscar imagenes en Gelbooru
❏ *#rule34 • #r34* + [Tags]
> ☆ Buscar imagenes en Rule34
❏ *#xvideos •#xvideosdl* + [Link]
> ☆ Descargar un video Xvideos. 
❏ *#xnxx •#xnxxdl* + [Link]
> ☆ Descargar un video Xnxx.
╰ׅ͜━─֟͜━⃔━━═̶፝֟͜══̶⃔━ٞ━━֟͜━━┈ࠢ͜╯ׅ`.trim()
await conn.sendMessage(m.chat, { 
text: txt,
contextInfo: {
mentionedJid: [userId],
isForwarded: true,
forwardedNewsletterMessageInfo: {
newsletterJid: channelRD.id,
serverMessageId: '',
newsletterName: channelRD.name
},
externalAdReply: {
title: botname,
body: author,
mediaType: 1,
mediaUrl: redes,
sourceUrl: redes,
thumbnail: await (await fetch(banner)).buffer(),
showAdAttribution: false,
containsAutoReply: true,
renderLargerThumbnail: true
}}}, { quoted: m })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help']

export default handler