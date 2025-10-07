const handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin }) => {
    const chat = global.db.data.chats[m.chat];

    
    const primaryBot = chat.primaryBot;
    if (primaryBot && conn.user.jid !== primaryBot) throw false;

    
    const validCommands = {
        welcome: 'welcome',
        antilink: 'antiLink',
        modoadmin: 'modoadmin'
    };

    const type = validCommands[command.toLowerCase()];
    if (!type) return;


    if (m.isGroup && !(isAdmin || isOwner)) {
        global.dfail('admin', m, conn);
        throw false;
    }

    let isEnable = chat[type] || false;

    if (args[0] === 'on' || args[0] === 'enable') {
        if (isEnable) return conn.reply(m.chat, `ꕥ *${command}* ya estaba *activado*.`, m);
        isEnable = true;
    } else if (args[0] === 'off' || args[0] === 'disable') {
        if (!isEnable) return conn.reply(m.chat, `ꕥ *${command}* ya estaba *desactivado*.`, m);
        isEnable = false;
    } else {
        return conn.reply(
            m.chat,
            `[✦] Un admin puede gestionar el comando *${command}*:
☆ Activar:   ${usedPrefix}${command} enable
☆ Desactivar: ${usedPrefix}${command} disable

✿ Estado actual: ${isEnable ? '★ Activado' : '✣ Desactivado'}`,
            m
        );
    }

    chat[type] = isEnable;
    conn.reply(m.chat, `❏ *${command}* *${isEnable ? 'activado' : 'desactivado'}* correctamente para este grupo.`, m);
};

handler.help = ['welcome', 'antilink', 'modoadmin'];
handler.tags = ['grupo'];
handler.command = ['welcome', 'antilink', 'modoadmin'];
handler.group = true;

export default handler;
