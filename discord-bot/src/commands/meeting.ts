import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";

@Discord()
export class Meeting {
  @Slash({ description: "Meeting" })
  meeting(
    @SlashOption({
      name: "hour",
      description: "hour of the meeting",
      required: true,
      type: ApplicationCommandOptionType.Integer
    })
    hour: number,
    @SlashOption({
      name: "minute",
      description: "minute of the meeting",
      required: false,
      type: ApplicationCommandOptionType.Integer
    })
    minute: number,
    @SlashOption({
      name: "month",
      description: "month of the meeting",
      required: false,
      type: ApplicationCommandOptionType.Integer
    })
    month: number,
    @SlashOption({
      name: "day",
      description: "day of the meeting",
      required: false,
      type: ApplicationCommandOptionType.Integer
    })
    day: number,
    @SlashOption({
      name: "year",
      description: "year of the meeting",
      required: false,
      type: ApplicationCommandOptionType.Integer
    })
    year: number,
    interaction: CommandInteraction
  ): void {
    interaction.reply("New meeting at " + hour + ":" + minute || "00" + ", ");
  }
}
