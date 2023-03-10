import { Events } from 'discord.js';
import type { ArgsOf, Client } from 'discordx';
import { Discord, On } from 'discordx';

@Discord()
export class Feur {
    @On({ event: Events.MessageCreate })
    messageCreate([message]: ArgsOf<"messageCreate">, client: Client): void {
        console.log("Message Created", client.user?.username, message.content);
        if (message.content.includes("ping"))
            message.reply("pong");
    }
}
