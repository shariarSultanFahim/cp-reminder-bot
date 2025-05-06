import { Injectable } from '@nestjs/common';
import { Context, SlashCommand, SlashCommandContext } from 'necord';
import { BotService } from '@app/bot';
import {
  APIEmbed,
  // ButtonBuilder,
  // ButtonStyle,
  // ComponentType,
  JSONEncodable,
} from 'discord.js';

@Injectable()
export class MovieService {
  constructor(private readonly bot: BotService) {}

  @SlashCommand({
    name: 'upcoming',
    description: 'Show Upcoming Contests!',
  })
  public async onLength(@Context() [interaction]: SlashCommandContext) {
    const constests = await this.bot.searchUpcomingContests();

    if (constests.status === 'error') {
      return interaction.reply({
        content: constests.message,
        ephemeral: true,
      });
    }

    const embeds: (APIEmbed | JSONEncodable<APIEmbed>)[] = constests.data
      .slice(0, 3)
      .map((data: any): APIEmbed | JSONEncodable<APIEmbed> => {
        console.log(data);
        return {
          title: `Contest Name: ${data.name}`,
          description: `Contest ID: ${data.id}`,
          url: `https://codeforces.com/contests/${data.id.toString()}`,
          color: 0x00ff00,
          fields: [
            {
              name: 'Contest Start Time',
              value: new Date(data.startTimeSeconds * 1000).toString(), //this is in UNIX formate
              inline: true,
            },
            {
              name: 'Contest Type',
              value: data.type,
              inline: true,
            },
          ],
        };
      });

    return interaction.reply({
      content: constests.message,
      embeds,
    });
  }
}
