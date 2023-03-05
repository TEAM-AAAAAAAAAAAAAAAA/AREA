import { CommandInteraction } from 'discord.js';
import { ApplicationCommandOptionType } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { env } from '../config/env.js';
import {areaConfigCheck} from "../config/areaConfigCheck.js";

@Discord()
export class GetIssues {
    @Slash({description: "Get issues"})
    async get_issues(
        @SlashOption({name: "owner", description: "username of the repo's owner", required: true, type: ApplicationCommandOptionType.String})
            owner: string,

        @SlashOption({name: "repo", description: "name of the repo", required: true, type: ApplicationCommandOptionType.String})
            repo: string,

        interaction: CommandInteraction
    ): Promise<void> {



        let webhook = await areaConfigCheck(interaction, "get_issues");
        if (!webhook) {
            interaction.reply("You need to set up a webhook for this command");
            return;
        }
        console.log(webhook)
        let res = await fetch(env.API_URL + '/hook/' + webhook.userId + '/' + webhook.webhookWebhookId, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                bot: {
                    owner: owner,
                    repo: repo,
                    author: webhook.userId
                }
            })
        });
        if (!res || !res.ok) {
            interaction.reply("Unknown error");
            return;
        }
        console.log(res);
        interaction.reply("This is the repo's issues' list :");
    }
}