import { Client, Intents } from 'discord.js';

import config from './config';

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on('ready', () => {
  console.log(`🟢 Client Logged in as ${client.user.tag}`);
});

client.on('messageCreate', (interaction) => {
  const commands = interaction.channel.lastMessage.content.split(' ');
  if (commands[0] === '!cdc') {
    console.log('Time:', new Date());
    console.log('Commands:', commands.join(' '));

    if (commands.length === 1) {
      interaction.channel.send('Hello from CDC Signal🚀');
    }
  }
});

client.login(config.CLIENT_TOKEN);
