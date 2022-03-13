import { Client, Intents } from 'discord.js';

import config from './config';
console.log(config);
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('ready', () => {
  console.log(`🟢 Client Logged in as ${client.user.tag}`);
});

client.login(config.CLIENT_TOKEN);
