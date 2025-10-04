import fetch from 'node-fetch'

export async function before(m, { conn }) {

  global.rcanal = {
    externalAdReply: {
      title: botname,
      body: author,
      mediaUrl: 'https://apiadonix.kozow.com',
      previewType: "PHOTO",
      thumbnail: await (await fetch(banner)).buffer(),
      sourceUrl: 'https://apiadonix.kozow.com',
      mediaType: 1,
      renderLargerThumbnail: false
    }
  }

}
