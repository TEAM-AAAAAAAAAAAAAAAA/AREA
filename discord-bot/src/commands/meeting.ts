import { CommandInteraction } from 'discord.js';
import { ApplicationCommandOptionType } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { areaConfigCheck } from '../config/areaConfigCheck.js';
import { env } from '../config/env.js';

@Discord()
export class Meeting {
    @Slash({ description: "Meeting" })
    async meeting(
        @SlashOption({name: "subject", description: "subject of the meeting", required: true, type: ApplicationCommandOptionType.String})
        subject: string,

        @SlashOption({name: "duration_hours", description: "duration hours", required: true, type: ApplicationCommandOptionType.Integer})
        duration_hours: number,

        @SlashOption({name: "duration_minutes", description: "duration minutes", required: true, type: ApplicationCommandOptionType.Integer})
        duration_minutes: number,

        @SlashOption({name: "year", description: "year of the meeting", required: true, type: ApplicationCommandOptionType.Integer})
        year: number,

        @SlashOption({name: "month", description: "month of the meeting", required: true, type: ApplicationCommandOptionType.Integer})
        month: number,

        @SlashOption({name: "day", description: "day of the meeting", required: true, type: ApplicationCommandOptionType.Integer})
        day: number,

        @SlashOption({name: "hour", description: "hour of the meeting", required: true, type: ApplicationCommandOptionType.Integer})
        hour: number,

        @SlashOption({name: "minute", description: "minute of the meeting", required: false, type: ApplicationCommandOptionType.Integer})
        minute: number,

        interaction: CommandInteraction
    ): Promise<void> {
        try {

            let webhook = await areaConfigCheck(interaction, "meeting");
            if (!webhook)
                return;
        
            console.log(webhook)
            let res = await fetch(env.API_URL + '/hook/' + webhook.userId + '/' + webhook.webhookWebhookId, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({bot: {
                    subject: subject,
                    duration_hours: duration_hours,
                    duration_minutes: duration_minutes,
                    hour: hour,
                    minute: minute,
                    day: day,
                    month: month,
                    year: year,
                    author: webhook.userId,
                    message: subject
                }})
            });
            if (!res || !res.ok)
            {
                interaction.reply("Unknown error");
                return;
            }

            interaction.reply("Meeting created");

        } catch {}
    }
}
