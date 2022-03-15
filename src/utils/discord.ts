import { TextChannel, DMChannel, PartialDMChannel, NewsChannel, ThreadChannel } from 'discord.js';

export async function sendMessage(channel: DMChannel | PartialDMChannel | NewsChannel | TextChannel | ThreadChannel, msg: string) {
    const maxSendingLength = 1900;
    for (let i = 0; i < msg.length; i += maxSendingLength) {
        const max = msg.length < i + maxSendingLength ? msg.length : i + maxSendingLength;
        const subMsg = msg.substring(i, max);
        await channel.send(subMsg);
    }
}
