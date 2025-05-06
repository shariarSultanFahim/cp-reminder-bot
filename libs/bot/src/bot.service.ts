import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class BotService {
  public async searchUpcomingContests() {
    const url = `https://codeforces.com/api/contest.list`;
    const res = await axios.get(url);

    if (!res.data)
      return {
        status: 'error',
        message: 'No contests found! Try again with different query!',
      };

    return {
      status: 'success',
      message: `Found contests!`,
      data: res.data?.result,
    };
  }
}
