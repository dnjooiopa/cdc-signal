import { Client, Intents, TextChannel } from 'discord.js';
import cron from 'node-cron';

import { init } from './app';
import config from './config';
import global from './global';
import { publish } from './mqtt';
import { addSymbol, removeSymbol, update } from './utils';
import { getLocaleString } from './utils/date';
import { sendMessage } from './utils/discord';
import { getAllSignal, getSignalMessage, getSignalObject } from './utils/signal';

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on('ready', () => {
    console.log(`π’ Client Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (interaction) => {
    const commands = interaction.channel.lastMessage.content.toLowerCase().split(' ');
    if (commands[0] === '!cdc') {
        const timeStr = getLocaleString();
        console.log('------------- Incoming Command -------------');
        console.log('Time:', timeStr);
        console.log('Commands:', commands.join(' '));

        if (commands.length === 1) {
            interaction.channel.send(`Hello from CDC Signalπ${global.info}`);
        } else if (commands.length === 2) {
            if (commands[1] === 'time') {
                sendMessage(interaction.channel, timeStr);
            } else if (commands[1] === 'update') {
                await update();
                const msg = getSignalMessage();
                sendMessage(interaction.channel, msg);
                console.log(getLocaleString(), ': π send update signal');
            } else if (commands[1] === 'trader') {
                const signals = getSignalObject();
                publish(JSON.stringify(signals));
                sendMessage(interaction.channel, 'π publish signals');
            } else if (commands[1] === 'signal') {
                const msg = getAllSignal();
                sendMessage(interaction.channel, msg);
            } else if (commands[1] === 'future') {
                await update();
                const msg = getSignalMessage(1);
                sendMessage(interaction.channel, msg);
            }
        } else if (commands.length === 4) {
            if (commands[1] === 'add') {
                const msg = await addSymbol(commands[2], commands[3]);
                sendMessage(interaction.channel, msg);
            } else if (commands[1] === 'remove') {
                const msg = await removeSymbol(commands[2], commands[3]);
                sendMessage(interaction.channel, msg);
            }
        }
    }
});

async function sendUpdateSignal() {
    try {
        await update();
        console.log(getLocaleString(), ': π Automatic update signal');

        const signals = getSignalObject();
        publish(JSON.stringify(signals));

        const msg = getSignalMessage();
        const channel = (await client.channels.cache.get(config.SIGNAL_CHANNEL)) as TextChannel;
        sendMessage(channel, msg);
    } catch (err) {
        console.log(getLocaleString(), ': π΄ Automatic update error:', err.message);
    }
}

(async () => {
    try {
        await init();
        await client.login(config.CLIENT_TOKEN);
        cron.schedule(config.UPDATE_TIME, sendUpdateSignal);
    } catch (err) {
        console.log('π΄ Application initialization error:', err);
        process.exit();
    }
})();
