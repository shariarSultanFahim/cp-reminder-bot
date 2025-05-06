import { Injectable } from '@nestjs/common';
import { Context, SlashCommand, SlashCommandContext } from 'necord';
import {
  APIEmbed,
  // ButtonBuilder,
  // ButtonStyle,
  // ComponentType,
  JSONEncodable,
} from 'discord.js';
import { BotService } from 'libs/bot/src';

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
      ?.filter((d: any) => d.phase === 'BEFORE') // Logically Filtering Data's
      .slice(0, 3) // Getting first 3 data
      .map((data: any): APIEmbed | JSONEncodable<APIEmbed> => {
        console.log(data);
        return {
          title: `${data.name}`,
          description: `Contest ID: ${data.id}`,
          url: `https://codeforces.com/contests/${data.id.toString()}`,
          color: 0x00ff00,
          fields: [
            {
              name: 'Start Time',
              value: new Date(data.startTimeSeconds * 1000).toString(), //this is in UNIX formate
              inline: true,
            },
            {
              name: 'Duration',
              value: data?.durationSeconds
                ? `${data?.durationSeconds / 3600} hrs`
                : 'N/A',
              inline: true,
            },
            {
              name: 'Type',
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
