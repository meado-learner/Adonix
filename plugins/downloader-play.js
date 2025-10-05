import yts from 'yt-search';
import fetch from 'node-fetch';

async function getRandomCDN() {
  const res = await fetch('https://media.savetube.me/api/random-cdn');
  const data = await res.json();
  return data.cdn; 
}

async function getVideoDownload(videoId, format = 'mp4', quality = '720p') {
  const cdn = await getRandomCDN();
  const convertUrl = `https://${cdn}/api/convert`;

  const res = await fetch(convertUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ videoId, format, quality })
  });

  const data = await res.json();
  if (!data.downloadUrl) throw new Error('No se pudo obtener el link de descarga');
  return data.downloadUrl;
}

let handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) 
    return conn.reply(m.chat, '「✿」 Ingresa el nombre de lo que quieres buscar', m);

  await m.react('🕓');

  let res = await yts(text);
  let play = res.videos[0];

  if (!play) 
    return conn.reply(m.chat, '> No se encontraron resultados para tu búsqueda', m);

  let { title, thumbnail, ago, timestamp, views, videoId, url, author } = play;

  let txt = '';
  txt += `「✦」 Descargando *${title || ''}*\n\n`;
  txt += `> ❑ Canal » *${author.name || ''}*\n`;
  txt += `> ♡ Vistas » *${views.toLocaleString() || ''}*\n`;
  txt += `> ✧︎ Duración » *${timestamp || ''}*\n`;
  txt += `> ✿ Publicado » *${ago || ''}*\n`;
  txt += `> ✎ Link » https://youtube.com/watch?v=${videoId}`;

  let thumbnailBuffer;
  try {
    const resFetch = await fetch(thumbnail);
    thumbnailBuffer = await resFetch.buffer();
  } catch {
    thumbnailBuffer = null;
  }

  await conn.sendMessage(
    m.chat,
    {
      text: txt,
      footer: 'YouTube',
      mentions: [m.sender],
      contextInfo: {
        externalAdReply: {
          title: botname || 'Video',
          body: global.author || '',
          mediaType: 1,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumbnailBuffer,
          containsAutoReply: true,
          renderLargerThumbnail: true
        }
      }
    },
    { quoted: m }
  );

  try {
    if (command === 'play' || command === 'play2') {
      if (command.endsWith('mp3') || command === 'play') {
        
        const audioUrl = await getVideoDownload(videoId, 'mp3');
        await conn.sendMessage(m.chat, { 
          audio: { url: audioUrl }, 
          mimetype: 'audio/mpeg', 
          ptt: false 
        }, { quoted: m });
      } else {
    
        const videoUrl = await getVideoDownload(videoId, 'mp4');
        await conn.sendMessage(m.chat, { 
          video: { url: videoUrl }, 
          caption: `「✦」 *${title}*`,
        }, { quoted: m });
      }
    }
    await m.react('✅');
  } catch (e) {
    console.log(e);
    conn.reply(m.chat, '「❌」 Ocurrió un error al descargar', m);
  }
};

handler.help = ['play', 'play2'];
handler.tags = ['descargas'];
handler.command = ['play', 'play2'];

export default handler;
