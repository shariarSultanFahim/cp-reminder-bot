import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class BotService {
  public async searchUpcomingContests() {
    const url = `https://codeforces.com/api/contest.list`;
    const res = await axios.get(url);
    const previousData = res;

    if (!res.data)
      return {
        status: 'success',
        message: `Found contests!`,
        data: previousData.data?.result,
      };

    return {
      status: 'success',
      message: `Found contests!`,
      data: res.data?.result,
    };
  }
}
