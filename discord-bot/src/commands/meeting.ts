import { CommandInteraction } from 'discord.js';
import { ApplicationCommandOptionType } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { prisma } from '../config/db.js';
import { env } from '../config/env.js';

@Discord()
export class Meeting {
    @Slash({ description: "Meeting" })
    async meeting(
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
    ): Promise<void> {
        // var thisId = prisma.oAuthUserData.findUnique({

        // })

        let thisProvider = await prisma.oAuthProvider.findUnique({
            where: {
                serviceName: "Discord"
            }
        });
        if (!thisProvider)
        {
            interaction.reply("This AREA server's administrator has not set up the Discord OAuth provider yet");
            return;
        }

        let thisUser = await prisma.oAuthUserData.findUnique({
            where: {
                providerUserId_oAuthProviderName: {
                    providerUserId: interaction.user.id,
                    oAuthProviderName: thisProvider.oAuthProviderName
                }
            }
        });
        if (!thisUser)
        {
            interaction.reply("You need to be linked to an AREA account to use commands");
            return;
        }

        let webhook = await prisma.discordBotWebhook.findUnique({
            where: {
                command_userId: {
                    command: "meeting",
                    userId: thisUser.userId
                }
            }
        });
        if (!webhook)
        {
            interaction.reply("You need to set up a webhook for this command");
            return;
        }
        console.log(webhook)
        let res = await fetch(env.API_URL + '/hook/' + webhook.userId + '/' + webhook.webhookWebhookId, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({bot: {
                subject: subject,
                hour: hour,
                minute: minute,
                day: day,
                month: month,
                year: year,
                author: webhook.userId
            }})
        });
        if (!res || !res.ok)
        {
            interaction.reply("Unknown error");
            return;
        }

        console.log(Math.floor(new Date(year, month, day, hour, minute, 0, 0).getTime() / 1000));
        console.log(res);
        interaction.reply("Meeting created");
    }
}
