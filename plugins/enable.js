
const handler = async (m, { conn, command, usedPrefix, args, chat }) => {
    try {
        if (!args[0]) return m.reply(`⚠︎ Usa: ${usedPrefix}${command} <welcome|antilink>`);

        const option = args[0].toLowerCase();
        const validOptions = ["welcome", "antilink"];

        if (!validOptions.includes(option)) {
            return m.reply(`⚠︎ Opción inválida. Usa: welcome o antilink`);
        }

        
        if (!global.db) global.db = {};
        if (!global.db.chats) global.db.chats = {};
        if (!global.db.chats[chat]) global.db.chats[chat] = {};

        const chatSettings = global.db.chats[chat];

        if (command === "enable") {
            chatSettings[option] = true;
            m.reply(`❏ Se ha activado *${option}* en este grupo.`);
        } else if (command === "disable") {
            chatSettings[option] = false;
            m.reply(`✿ Se ha desactivado *${option}* en este grupo.`);
        }
    } catch (error) {
        m.reply(`⚠︎ Error:\n${error.message}`);
    }
};

handler.tags = ["group"];
handler.help = ["enable <welcome|antilink>", "disable <welcome|antilink>"];
handler.command = ["enable", "disable"];
handler.group = true;

export default handler;
