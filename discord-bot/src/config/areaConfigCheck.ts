import { DiscordBotWebhook } from "@prisma/client";
import { prisma } from "./db.js";

export async function areaConfigCheck(interaction: any, command: string): Promise<DiscordBotWebhook | null>
{
    const serviceName = "Discord";

    let thisProvider = await prisma.oAuthProvider.findUnique({
        where: {
            serviceName: serviceName
        }
    });
    if (!thisProvider)
    {
        interaction.reply("This AREA server's administrator has not set up the " + serviceName + " OAuth provider yet");
        return null;
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
        return null;
    }

    let webhook = await prisma.discordBotWebhook.findUnique({
        where: {
            command_userId: {
                command: command,
                userId: thisUser.userId
            }
        }
    });
    if (!webhook)
    {
        interaction.reply("You need to set up a webhook for this command");
        return null;
    }

    return webhook;
}