import yts from 'yt-search';
import fetch from 'node-fetch';

let handler = async (m, { conn, command, args, text, usedPrefix }) => {
  if (!text) 
    return conn.reply(
      m.chat, 
      '「✿」 Ingresa el nombre de lo que quieres buscar', 
      m
    );

  await m.react('🕓');

  let res = await yts(text);
  let play = res.videos[0];

  if (!play) 
    return conn.reply(
      m.chat, 
      '> No se encontraron resultados para tu búsqueda', 
      m
    );

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
          title: title || 'Video',
          body: botname || '',
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
        let audioUrl;
        let apiName = '';

        if (global.mayapi) {
          apiName = 'MayAPI';
          const endpoint = `${global.mayapi}/ytdl?url=${encodeURIComponent(url)}&type=mp3&apikey=may-3d9ac5f2`;
          let resApi = await fetch(endpoint);
          let json = await resApi.json();
          audioUrl = json.result?.url;
        }

        if (!audioUrl && global.apiadonix) {
          apiName = 'Adonix API';
          const endpoint = `${global.apiadonix}/download/ytmp3?apikey=Adofreekey&url=${encodeURIComponent(url)}`;
          let resApi = await fetch(endpoint);
          let json = await resApi.json();
          audioUrl = json.data?.url;
        }

        if (!audioUrl) 
          return conn.reply(
            m.chat, 
            '「✦」 Ocurrió un error, no se pudo obtener el audio.', 
            m
          );

        await conn.sendMessage(m.chat, { 
          text: `> ❑ *Server:* *${apiName}*`,
          quoted: m
        });

        await conn.sendMessage(m.chat, { 
          audio: { url: audioUrl }, 
          mimetype: 'audio/mpeg', 
          ptt: false 
        }, { quoted: m });

      } else {
        let videoUrl;
        let apiName = '';

        if (global.mayapi) {
          apiName = 'MayAPI';
          const endpoint = `${global.mayapi}/ytdl?url=${encodeURIComponent(url)}&type=mp4&apikey=may-3d9ac5f2`;
          let resApi = await fetch(endpoint);
          let json = await resApi.json();
          videoUrl = json.result?.url;
        }

        if (!videoUrl && global.apiadonix) {
          apiName = 'Adonix API';
          const endpoint = `${global.apiadonix}/download/ytmp4?apikey=Adofreekey&url=${encodeURIComponent(url)}`;
          let resApi = await fetch(endpoint);
          let json = await resApi.json();
          videoUrl = json.data?.url;
        }

        if (!videoUrl) 
          return conn.reply(
            m.chat, 
            '「✦」 Ocurrió un error, no se pudo obtener el video.', 
            m
          );

        await conn.sendMessage(m.chat, { 
          text: `> ❑ *Server:* *${apiName}*`,
          quoted: m
        });

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
handler.tags = ['dl'];
handler.command = ['play', 'play2'];

export default handler;
