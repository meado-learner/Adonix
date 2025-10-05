import fetch from "node-fetch";
import yts from "yt-search";

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/;

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text?.trim()) return conn.reply(m.chat, "❀ Ingresa el nombre de la música o un enlace de YouTube.", m);

    await m.react('🕓');

    const videoIdToFind = text.match(youtubeRegexID)?.[1] || null;
    let url = text;

    if (!videoIdToFind) {
      const searchResult = await yts(text);
      const video = (searchResult.all || searchResult.videos || [])[0];
      if (!video?.url) return m.reply("✧ No se encontraron resultados.");
      url = video.url;
    }

    if (["mp3", "yta", "ytmp3", "playaudio"].includes(command)) {
      const api = await (await fetch(`${global.apiadonix}/download/ytmp3?apikey=Adofreekey&url=${encodeURIComponent(url)}`)).json();
      const result = api?.data?.url;
      if (!result) throw new Error("⚠ No se pudo generar el enlace de audio.");
      await conn.sendMessage(m.chat, { audio: { url: result }, fileName: "audio.mp3", mimetype: "audio/mpeg" }, { quoted: m });
      await m.react('✔️'); 
    } else if (["play2", "ytv", "ytmp4", "mp4"].includes(command)) {
      const api = await (await fetch(`${global.apiadonix}/download/ytmp4?apikey=Adofreekey&url=${encodeURIComponent(url)}`)).json();
      const result = api?.data?.url;
      if (!result) throw new Error("⚠ No se pudo generar el enlace de video.");
      await conn.sendMessage(
        m.chat,
        { video: { url: result }, mimetype: "video/mp4", fileName: "video.mp4" },
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

handler.command = handler.help = ["mp3", "yta", "ytmp3", "ytv", "ytmp4", "mp4"];
handler.tags = ["descargas"];
handler.group = true;

export default handler;