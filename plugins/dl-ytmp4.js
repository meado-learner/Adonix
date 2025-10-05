import fetch from "node-fetch";
import yts from "yt-search";
import axios from "axios";

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/;

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, "❀ Por favor, ingresa el nombre de la música a descargar.", m);
    }

    const videoIdToFind = text.match(youtubeRegexID)?.[1] || null;
    let ytplay2 = await yts(videoIdToFind ? `https://youtu.be/${videoIdToFind}` : text);

    if (videoIdToFind) {
      ytplay2 = (ytplay2.all || ytplay2.videos || []).find(item => item.videoId === videoIdToFind) || ytplay2;
    } else {
      ytplay2 = (ytplay2.all || ytplay2.videos || [])[0] || ytplay2;
    }

    if (!ytplay2 || !ytplay2.videoId) {
      return m.reply("✧ No se encontraron resultados para tu búsqueda.");
    }

    const { title = "No encontrado", thumbnail = null, timestamp = "No encontrado", views = 0, ago = "No encontrado", url = "No encontrado", author = {} } = ytplay2;
    const canal = author.name || "Desconocido";
    const vistas = formatViews(views);

    const infoMessage = `「✦」Descargando *${title}*\n\n> ✧ Canal » *${canal}*\n> ✰ Vistas » *${vistas}*\n> ⴵ Duración » *${timestamp}*\n> ✐ Publicado » *${ago}*\n> 🜸 Link » ${url}`;

    const thumb = thumbnail ? (await conn.getFile(thumbnail))?.data : null;
    const JT = {
      contextInfo: {
        externalAdReply: {
          title: botname || "Grok",
          body: dev || "xAI",
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true,
        },
      },
    };

    await conn.reply(m.chat, infoMessage, m, JT);

    if (["mp3", "yta", "ytmp3", "playaudio"].includes(command)) {
      try {
        const api = await (await fetch(`${global.apiadonix}/download/ytmp3?apikey=Adofreekey&url=${encodeURIComponent(url)}`)).json();
        const result = api?.data?.url;
        if (!result) throw new Error("⚠ El enlace de audio no se generó correctamente.");
        await conn.sendMessage(m.chat, { audio: { url: result }, fileName: `${title}.mp3`, mimetype: "audio/mpeg" }, { quoted: m });
      } catch (e) {
        return conn.reply(m.chat, "⚠︎ No se pudo enviar el audio. Esto puede deberse a que el archivo es demasiado pesado o a un error en la generación de la URL. Por favor, intenta nuevamente más tarde.", m);
      }
    } else if (["play2", "ytv", "ytmp4", "mp4"].includes(command)) {
      try {
        const api = await (await fetch(`${global.apiadonix}/download/ytmp4?apikey=Adofreekey&url=${encodeURIComponent(url)}`)).json();
        const result = api?.data?.url;
        if (!result) throw new Error("⚠ El enlace de video no se generó correctamente.");
        await conn.sendMessage(
          m.chat,
          {
            video: { url: result },
            mimetype: "video/mp4",
            fileName: `${title}.mp4`,
            thumbnail: thumb,
          },
          { quoted: m }
        );
      } catch (e) {
        return conn.reply(m.chat, "⚠︎ No se pudo enviar el video. Esto puede deberse a que el archivo es demasiado pesado o a un error en la generación de la URL. Por favor, intenta nuevamente más tarde.", m);
      }
    } else {
      return conn.reply(m.chat, "✧︎ Comando no reconocido.", m);
    }
  } catch (error) {
    return m.reply(`⚠︎ Ocurrió un error: ${error.message || error}`);
  }
};

handler.command = handler.help = ["mp3", "yta", "ytmp3", "ytv", "ytmp4", "mp4"];
handler.tags = ["descargas"];
handler.group = true;

export default handler;

function formatViews(views) {
  if (!views) return "No disponible";
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`;
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k (${views.toLocaleString()})`;
  return views.toString();
}