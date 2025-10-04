import yts from 'yt-search';
import fetch from 'node-fetch';
import axios from 'axios';
import crypto from 'crypto';

// Placeholder function to generate PoW hash (needs reverse-engineering)
function generatePowHash(nonce, videoId, timestamp) {
    // Mock function: Replace with actual PoW logic from the website
    return crypto.createHash('sha256')
        .update(`${nonce}${videoId}${timestamp}`)
        .digest('hex');
}

// Placeholder function to generate signature (needs reverse-engineering)
function generateSignature(videoId, timestamp) {
    // Mock function: Replace with actual signature logic
    return crypto.createHash('sha256')
        .update(`${videoId}${timestamp}`)
        .digest('hex');
}

// Scraper function for yt1s.biz
async function scrapeYt1s(videoId, quality = '320') {
    try {
        // Placeholder values (replace with actual logic)
        const apiAuth = 'Ig9CxOQPYu3RB7GC21sOcgRPy4uyxFKTx54bFDu07G3eAMkrdVqXY9bBatu4WqTpkADrQ';
        const nonce = Math.floor(Math.random() * 100000).toString();
        const timestamp = Date.now();
        const sessionToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpcCI6IjEwNC4yMy4xODcuMjQ2IiwiaWF0IjoxNzU5NTk1MDg1LCJleHAiOjE3NTk1OTU2ODV9.VUrGC03dlBoWmW5Ofm5oc89uKpB7ThU6HYUSeBwq3n0';
        const signature = generateSignature(videoId, timestamp);
        const powhash = generatePowHash(nonce, videoId, timestamp);

        // Request headers
        const headers = {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'x-api-auth': apiAuth,
            'x-session-token': sessionToken,
            'x-signature': signature,
            'x-signature-timestamp': timestamp.toString(),
            'nonce': nonce,
            'powhash': powhash,
        };

        // Request payload
        const payload = {
            videoId: videoId,
            quality: quality,
        };

        // Make the POST request
        const response = await axios.post('https://fast.dlsrv.online/gateway/audio', payload, { headers });

        if (response.data.status === 'tunnel') {
            return {
                status: 'success',
                url: response.data.url,
                filename: response.data.filename,
                duration: response.data.duration,
            };
        } else {
            throw new Error(`Unexpected response status: ${response.data.status}`);
        }
    } catch (error) {
        console.error('Scraper error:', error.message);
        return {
            status: 'error',
            message: error.message,
        };
    }
}

let handler = async (m, { conn, command, text, usedPrefix }) => {
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
                    title: botname || 'Video',
                    body: author || '',
                    mediaType: 1,
                    mediaUrl: url,
                    sourceUrl: url,
                    thumbnail: thumbnailBuffer,
                    containsAutoReply: true,
                    renderLargerThumbnail: true,
                },
            },
        },
        { quoted: m }
    );

    try {
        if (command === 'play1' || command === 'play2') {
            if (command.endsWith('mp3') || command === 'play1') {
                // Use the scraper for MP3 downloads
                const result = await scrapeYt1s(videoId);

                if (result.status !== 'success') {
                    return conn.reply(
                        m.chat,
                        `「✦」 Ocurrió un error al obtener el audio: ${result.message}`,
                        m
                    );
                }

                await conn.sendMessage(m.chat, {
                    audio: { url: result.url },
                    mimetype: 'audio/mpeg',
                    ptt: false,
                }, { quoted: m });
            } else {
                // Keep the original video download logic
                const endpoint = `${global.apiadonix}/download/ytmp4?apikey=Adofreekey&url=${encodeURIComponent(url)}`;
                const resApi = await fetch(endpoint);
                const json = await resApi.json();
                const videoUrl = json.data?.url;

                if (!videoUrl) 
                    return conn.reply(
                        m.chat, 
                        '「✦」 Ocurrió un error, no se pudo obtener el video.', 
                        m
                    );

                await conn.sendMessage(m.chat, {
                    video: { url: videoUrl },
                    caption: `「✦」 *${title}*`,
                }, { quoted: m });
            }
            await m.react('✅');
        }
    } catch (e) {
        console.log(e);
        conn.reply(m.chat, '「❌」 Ocurrió un error al descargar', m);
        await m.react('❌');
    }
};

handler.help = ['play', 'play2'];
handler.tags = ['descargas'];
handler.command = ['play1'];

export default handler;
