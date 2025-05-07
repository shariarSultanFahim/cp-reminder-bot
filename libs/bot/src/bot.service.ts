import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Client } from 'discord.js';

@Injectable()
export class BotService {
  public client: Client;

  constructor() {
    this.client = new Client({
      intents: ['Guilds', 'GuildMessages'],
    });

    this.client.login(process.env.DISCORD_TOKEN);
  }

  private contestData: any = null;
  public async searchUpcomingContests() {
    const url = `https://codeforces.com/api/contest.list`;
    const res = await axios.get(url);

    this.contestData = res.data?.result //Saving data to cache
      ?.filter((d: any) => d.phase === 'BEFORE') // Logically Filtering Data's
      .slice(0, 3);

    if (!res.data) {
      return {
        status: 'success',
        message: `Found contests!`,
        data: this.contestData,
      };
    }

    return {
      status: 'success',
      message: `Found contests!`,
      data: res.data?.result
        .filter((d: any) => d.phase === 'BEFORE') // Logically Filtering Data's
        .slice(0, 3),
    };
  }

  public getContestsData() {
    return this.contestData;
  }
}
