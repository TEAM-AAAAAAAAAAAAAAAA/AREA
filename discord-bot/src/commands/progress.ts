import { DiscordBotWebhook } from '@prisma/client';
import { CommandInteraction, User } from 'discord.js';
import { ApplicationCommandOptionType } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { areaConfigCheck, areaGetUser } from '../config/areaConfigCheck.js';
import { env } from '../config/env.js';
import { bot } from '../main.js';

@Discord()
export class Progress {
    @Slash({ description: "Get a user's progress" })
    async progress(
        @SlashOption({name: "user", description: "User (or you if unspecified)", required: false, type: ApplicationCommandOptionType.Mentionable})
        user: any,

        interaction: CommandInteraction
    ): Promise<void> {
        try {

            let webhook = await areaConfigCheck(interaction, "progress");
            if (!webhook) return;

            let targetUser = user?.id || interaction.user.id;
            let targetUserName = user?.displayName || interaction.user.username;
            let target = await areaGetUser(interaction, targetUser);
            if (!target) return;

            await interaction.deferReply({ ephemeral: true});

            let res = await fetch(env.API_URL + '/hook/' + webhook.userId + '/' + webhook.webhookWebhookId, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({bot: {
                    author: webhook.userId,
                    targetUser: target,
                    targetUserName: targetUserName
                }})
            });

            if (!res || !res.ok)
                await interaction.editReply("Error: " + res.status + " " + res.statusText);
            else
                await interaction.editReply("OK");
                
        } catch {}
    }
}
