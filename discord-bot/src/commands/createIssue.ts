import { CommandInteraction } from 'discord.js';
import { ApplicationCommandOptionType } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { env } from '../config/env.js';
import {areaConfigCheck} from "../config/areaConfigCheck.js";

@Discord()
export class CreateIssue {
    @Slash({description: "Create issue"})
    async create_issue(
        @SlashOption({name: "owner", description: "username of the repo's owner", required: true, type: ApplicationCommandOptionType.String})
        owner: string,

        @SlashOption({name: "url", description: "url of the repo", required: true, type: ApplicationCommandOptionType.String})
        url: string,

        @SlashOption({name: "title", description: "title of the new issue", required: true, type: ApplicationCommandOptionType.String})
        title: string,

        @SlashOption({name: "body", description: "body of the new issue", required: true, type: ApplicationCommandOptionType.String})
        body: string,

        interaction: CommandInteraction
    ): Promise<void> {



        let webhook = await areaConfigCheck(interaction, "issue");
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
                    url: url,
                    title: title,
                    body: body,
                    author: webhook.userId
                }
            })
        });
        if (!res || !res.ok) {
            interaction.reply("Unknown error");
            return;
        }
        console.log(res);
        interaction.reply("Issue created");
    }
}