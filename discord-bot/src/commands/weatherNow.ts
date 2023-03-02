import { CommandInteraction } from 'discord.js';
import { ApplicationCommandOptionType } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { areaConfigCheck } from '../config/areaConfigCheck.js';
import { env } from '../config/env.js';

@Discord()
export class Meeting {
    @Slash({ description: "Weather, NOW" })
    async weather_now(
        @SlashOption({name: "city", description: "where should we get the weather from?", required: true, type: ApplicationCommandOptionType.String})
        city: string,

        interaction: CommandInteraction
    ): Promise<void> {

        try {
            let webhook = await areaConfigCheck(interaction, "weather_now");
            if (!webhook)
                return;
        
            let res = await fetch(env.API_URL + '/hook/' + webhook.userId + '/' + webhook.webhookWebhookId, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({bot: {
                    city: city,
                    when: "now"
                }})
            });
            if (!res || !res.ok)
            {
                interaction.reply("Unknown error");
                return;
            }

            interaction.reply("Weather sent to chained reaction");
        } catch {}
    }
}
