import fetch from 'node-fetch'

export async function before(m, { conn }) {

  global.rcanal = {
    key: {
      fromMe: false,
      participant: '123456789@s.whatsapp.net', 
      remoteJid: 'status@broadcast'
    },
    message: {
      contactMessage: {
        displayName: '🔥 Super Producto XYZ 🔥',
        vcard: `BEGIN:VCARD
VERSION:3.0
N:;Super Producto XYZ;;;
FN:Super Producto XYZ
TEL;type=WORK;waid=123456789:+123456789
EMAIL:ventas@empresa.com
ORG:Empresa Fantástica
NOTE:Precio: $49.99
URL:https://empresa.com/producto-xyz
END:VCARD`
      }
    }
  }

}
