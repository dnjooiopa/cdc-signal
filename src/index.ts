import { Client, Intents } from 'discord.js';
import { init, update } from './app';

import config from './config';
import { getSignalMessage } from './utils';
import { getLocaleString } from './utils/date';

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on('ready', () => {
    console.log(`🟢 Client Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (interaction) => {
    const commands = interaction.channel.lastMessage.content.split(' ');
    if (commands[0] === '!cdc') {
        const timeStr = getLocaleString();
        console.log('------------- Incoming Command -------------');
        console.log('Time:', timeStr);
        console.log('Commands:', commands.join(' '));

        if (commands.length === 1) {
            interaction.channel.send('Hello from CDC Signal🚀');
        } else if (commands.length === 2) {
            if (commands[1] === 'time') {
                interaction.channel.send(timeStr);
            } else if (commands[1] === 'update') {
                await update();
                const msg = getSignalMessage();
                interaction.channel.send(msg);
            }
        }
    }
});

client.login(config.CLIENT_TOKEN);

init();
