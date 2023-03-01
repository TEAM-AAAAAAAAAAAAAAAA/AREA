import { CommandInteraction } from 'discord.js';
import { ApplicationCommandOptionType } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { areaConfigCheck } from '../config/areaConfigCheck.js';
import { env } from '../config/env.js';

@Discord()
export class Meeting {
    @Slash({ description: "Weather forecast for the next days" })
    async weather_forecast_days(
        @SlashOption({name: "city", description: "where should we get the weather from?", required: true, type: ApplicationCommandOptionType.String})
        city: string,

        interaction: CommandInteraction
    ): Promise<void> {
        let webhook = await areaConfigCheck(interaction, "weather_forecast_days");
        if (!webhook)
            return;
    
        // console.log(webhook)
        let res = await fetch(env.API_URL + '/hook/' + webhook.userId + '/' + webhook.webhookWebhookId, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({bot: {
                city: city,
                when: "hours"
            }})
        });
        if (!res || !res.ok)
        {
            interaction.reply("Unknown error");
            return;
        }

        console.log(city);
        console.log(res);
        interaction.reply("Weather sent to configured webhook");
    }
}
