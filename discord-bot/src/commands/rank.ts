import { DiscordBotWebhook } from '@prisma/client';
import { CommandInteraction, User } from 'discord.js';
import { ApplicationCommandOptionType } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { areaConfigCheck, areaGetUser } from '../config/areaConfigCheck.js';
import { env } from '../config/env.js';
import { bot } from '../main.js';

@Discord()
export class Rank {
    @Slash({ description: "Get a user's rank" })
    async rank(
        @SlashOption({name: "user", description: "User (or you if unspecified)", required: false, type: ApplicationCommandOptionType.Mentionable})
        user: User,

        interaction: CommandInteraction
    ): Promise<void> {
        try {

            let webhook = await areaConfigCheck(interaction, "rank");
            if (!webhook) return;

            console.log(user?.id, interaction.user.id)
            let targetUser = user?.id || interaction.user.id;
            let target = await areaGetUser(interaction, targetUser);
            if (!target) return;

            let res = await fetch(env.API_URL + '/hook/' + webhook.userId + '/' + webhook.webhookWebhookId, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({bot: {
                    author: webhook.userId,
                    targetUser: target
                }})
            });

            await interaction.deferReply({ ephemeral: true});

            if (!res || !res.ok)
                await interaction.editReply("Error: " + res.status + " " + res.statusText);
            else
                await interaction.editReply("OK");
                
        } catch {}
    }
}
