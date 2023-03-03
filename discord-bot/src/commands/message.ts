import { CommandInteraction } from 'discord.js';
import { ApplicationCommandOptionType } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { areaConfigCheck } from '../config/areaConfigCheck.js';
import { env } from '../config/env.js';

@Discord()
export class Meeting {
    @Slash({ description: "Message" })
    async message(
        @SlashOption({name: "message", description: "the message to send (no way)", required: true, type: ApplicationCommandOptionType.String})
        message: string,

        interaction: CommandInteraction
    ): Promise<void> {
        try {
            let webhook = await areaConfigCheck(interaction, "message");
            if (!webhook)
                return;
        
            console.log(webhook)
            let res = await fetch(env.API_URL + '/hook/' + webhook.userId + '/' + webhook.webhookWebhookId, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({bot: {
                    content: message,
                    subject: message
                }})
            });
            if (!res || !res.ok)
            {
                interaction.reply("Unknown error");
                return;
            }

            interaction.reply("Message created");
        } catch {}
    }
}
