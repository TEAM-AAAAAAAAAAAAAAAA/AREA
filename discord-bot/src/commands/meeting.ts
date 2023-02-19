import { CommandInteraction } from 'discord.js';
import { ApplicationCommandOptionType } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { prisma } from '../config/db.js';
import { env } from '../config/env.js';

@Discord()
export class Meeting {
    @Slash({ description: "Meeting" })
    meeting(
        @SlashOption({name: "subject", description: "subject of the meeting", required: true, type: ApplicationCommandOptionType.String})
        subject: string,

        @SlashOption({name: "year", description: "year of the meeting", required: true, type: ApplicationCommandOptionType.Integer})
        year: number,

        @SlashOption({name: "month", description: "month of the meeting", required: true, type: ApplicationCommandOptionType.Integer})
        month: number,

        @SlashOption({name: "day", description: "day of the meeting", required: true, type: ApplicationCommandOptionType.Integer})
        day: number,

        @SlashOption({name: "hour", description: "hour of the meeting", required: true, type: ApplicationCommandOptionType.Integer})
        hour: number,

        @SlashOption({ name: "minute", description: "minute of the meeting", required: false, type: ApplicationCommandOptionType.Integer})
        minute: number,

        interaction: CommandInteraction
    ): void {
        let webhook = prisma.discordBotWebhook.findUnique({
            where: {
                command_userId: {
                    command: "meeting",
                    userId: '211a6457-c335-40c1-b5b1-e40fb4883d59'
                }
            },
            select: {
                webhook: {
                    select: {
                        userId: true,
                        webhookId: true
                    }
                }
            }
        }).then(hook => {
            console.log(hook)
            fetch(env.API_URL + '/hook/' + hook?.webhook.userId + '/' + hook?.webhook.webhookId, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({bot: {
                    content: subject,
                    hour: hour,
                    minute: minute,
                    day: day,
                    month: month,
                    year: year,
                    author: hook?.webhook.userId
                }})
            }).then(res => {
                console.log(Math.floor(new Date(year, month, day, hour, minute, 0, 0).getTime() / 1000));
                console.log(res);
                interaction.reply("Meeting created");
            })
        })
    }
}
