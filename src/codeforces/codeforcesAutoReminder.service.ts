import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { APIEmbed, JSONEncodable } from 'discord.js';
import { BotService } from 'libs/bot/src';
import { Context, SlashCommand, SlashCommandContext } from 'necord';
import {
  ChannelType,
  TextChannel,
  NewsChannel,
  ThreadChannel,
} from 'discord.js';

@Injectable()
export class AutoContestReminderService {
  constructor(private readonly botService: BotService) {}

  @Cron('*/30 * * * * *') //runs every 30 mins
  public async handleCron() {
    console.log('Cron job running every 30 seconds');
    const contests = await this.botService.searchUpcomingContests(); // Access the shared data
    // // const contests = await this.botService.searchUpcomingContests();
    // const contests = [
    //   {
    //     id: 9999,
    //     name: 'TEST Contest - Codeforces Round 999 (Div. 1)',
    //     type: 'CF',
    //     phase: 'BEFORE',
    //     frozen: false,
    //     durationSeconds: 7200, // 2 hours
    //     startTimeSeconds: Math.floor(Date.now() / 1000) + 300, // Starts in 5 minutes
    //     relativeTimeSeconds: -300,
    //   },
    //   {
    //     id: 9998,
    //     name: 'TEST Contest - Codeforces Round 999 (Div. 2)',
    //     type: 'CF',
    //     phase: 'BEFORE',
    //     frozen: false,
    //     durationSeconds: 7200, // 2 hours
    //     startTimeSeconds: Math.floor(Date.now() / 1000) + 900, // Starts in 15 minutes
    //     relativeTimeSeconds: -900,
    //   },
    // ];

    if (!contests) {
      return;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const upcomingContests = contests?.data?.filter((contest: any) => {
      // const upcomingContests = contests?.filter((contest: any) => {
      const timeUntilStart = contest.startTimeSeconds - currentTime;
      return timeUntilStart > 0 && timeUntilStart <= 1800; // Filter contests starting within the next hour
    });

    if (upcomingContests.length > 0) {
      const embeds = this.createEmbeds(upcomingContests);
      this.sendMessage(embeds);
    }
  }
  private createEmbeds(
    contests: any[],
  ): (APIEmbed | JSONEncodable<APIEmbed>)[] {
    return contests.map((contest: any): APIEmbed | JSONEncodable<APIEmbed> => {
      return {
        title: `${contest.name}`,
        description: `Contest ID: ${contest.id}`,
        url: `https://codeforces.com/contests/${contest.id.toString()}`,
        color: 0x00ff00,
        fields: [
          {
            name: 'Start Time',
            value: new Date(contest.startTimeSeconds * 1000).toString(), // UNIX format
            inline: true,
          },
          {
            name: 'Duration',
            value: contest?.durationSeconds
              ? `${contest?.durationSeconds / 3600} hrs`
              : 'N/A',
            inline: true,
          },
          {
            name: 'Type',
            value: contest.type,
            inline: true,
          },
        ],
      };
    });
  }

  private async sendMessage(
    embeds: (APIEmbed | JSONEncodable<APIEmbed>)[],
  ): Promise<void> {
    try {
      // Get your target channel ID from environment variables
      const channelId = process.env.NOTIFICATION_CHANNEL_ID;

      if (!channelId) {
        console.error('NOTIFICATION_CHANNEL_ID is not set');
        return;
      }

      // Get the channel
      const channel = await this.botService.client.channels.fetch(channelId);

      if (
        !channel ||
        !(
          channel.type === ChannelType.GuildText ||
          channel.type === ChannelType.GuildNews ||
          channel.type === ChannelType.GuildNewsThread ||
          channel.type === ChannelType.GuildPublicThread ||
          channel.type === ChannelType.GuildPrivateThread
        )
      ) {
        console.error('Channel not found or not a sendable text channel');
        return;
      }

      // Type assertion now safe because of above check
      const textChannel = channel as TextChannel | NewsChannel | ThreadChannel;

      await textChannel.send({
        content: '@everyone Contest starting soon! 🚀',
        // embeds: embeds.map((e) =>
        //   e instanceof JSONEncodable ? e.toJSON() : e,
        // ),
        embeds: embeds,
      });

      console.log('Notification sent successfully');
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }

  @SlashCommand({
    name: 'cache',
    description: 'Chach check!',
  })
  public async onPing(@Context() [interaction]: SlashCommandContext) {
    const contests = await this.botService.searchUpcomingContests(); // Access the shared data
    if (contests) {
      const embeds = this.createEmbeds(contests?.data);
      this.sendMessage(embeds);
    } else {
      console.log('No contests data available.');
    }

    const embeds = contests ? this.createEmbeds(contests?.data) : [];

    return interaction.reply({
      content: '@everyone Contest starting in 30 minutes!! Good Luck!!',
      embeds,
    });
  }
}
