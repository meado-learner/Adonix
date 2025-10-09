import fetch from "node-fetch";

const instagramRegex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel|tv|stories)\/([a-zA-Z0-9_-]+)/;

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text?.trim()) return conn.reply(m.chat, "❀ Ingresa el enlace del video de Instagram.", m);

    await m.react('🕓');

    const url = text.trim();

    if (!instagramRegex.test(url)) {
      return conn.reply(m.chat, "✧ El enlace de Instagram no es válido. Usa: instagram.com/p/... o instagram.com/reel/...", m);
    }

    if (["ig", "igdl", "instagram", "insta"].includes(command)) {
      const api = await (await fetch(`${global.apiadonix}/download/instagram?apikey=Adofreekey&url=${encodeURIComponent(url)}`)).json();
      
      if (!api.status || !api.data || api.data.length === 0) {
        throw new Error("⚠ No se pudo obtener el contenido del enlace.");
      }

      const result = api.data[0]?.url;
      if (!result) throw new Error("⚠ No se pudo generar el enlace de descarga.");

      await conn.sendMessage(
        m.chat,
        { video: { url: result }, mimetype: "video/mp4", fileName: "instagram.mp4" },
        { quoted: m }
      );
      await m.react('✔️');
    } else {
      return conn.reply(m.chat, "✧ Comando no reconocido.", m);
    }
  } catch (error) {
    return m.reply(`⚠ Ocurrió un error: ${error.message || error}`);
  }
};

handler.command = handler.help = ["instagram"];
handler.tags = ["descargas"];
handler.group = true;

export default handler;
