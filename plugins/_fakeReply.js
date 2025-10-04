import fetch from 'node-fetch'

export async function before(m, { conn }) {
  const response = await fetch(banner);
  const thumbnailBuffer = Buffer.from(await response.arrayBuffer());

  global.rcanal = {
    externalAdReply: {
      title: botname,
      body: author,
      mediaUrl: 'https://apiadonix.kozow.com',
      previewType: "PHOTO",
      thumbnail: thumbnailBuffer,
      sourceUrl: 'https://apiadonix.kozow.com',
      mediaType: 1,
      renderLargerThumbnail: false
    }
  }
}
