import { Client, Intents } from 'discord.js';
import { init } from './app';

import config from './config';
import { getLocaleString } from './utils/date';

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on('ready', () => {
    console.log(`🟢 Client Logged in as ${client.user.tag}`);
});

client.on('messageCreate', (interaction) => {
    const commands = interaction.channel.lastMessage.content.split(' ');
    if (commands[0] === '!cdc') {
        const timeStr = getLocaleString();
        console.log('Time:', timeStr);
        console.log('Commands:', commands.join(' '));

        if (commands.length === 1) {
            interaction.channel.send('Hello from CDC Signal🚀');
        } else if (commands.length === 2) {
            if (commands[1] === 'time') {
                interaction.channel.send(timeStr);
            }
        }
    }
});

client.login(config.CLIENT_TOKEN);

init();
