import { Client, Intents, TextChannel } from 'discord.js';
import cron from 'node-cron';

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

async function sendUpdateSignal() {
    update();
    console.log(getLocaleString(), ': 🚀 send update signal');
    const msg = getSignalMessage();
    ((await client.channels.cache.get(config.SIGNAL_CHANNEL)) as TextChannel).send(msg);
}

(async () => {
    await init();
    await client.login(config.CLIENT_TOKEN);
    cron.schedule(config.UPDATE_TIME, sendUpdateSignal);
})();
