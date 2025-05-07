import { Module } from '@nestjs/common';
import { NecordModule } from 'necord';
import { IntentsBitField } from 'discord.js';
import { AppService } from './app.service';
import { CodeforcesService } from './codeforces/codeforces.service';
import { BotModule } from 'libs/bot/src';
import { AutoContestReminderService } from './codeforces/codeforcesAutoReminder.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    BotModule,
    NecordModule.forRoot({
      token: process.env.DISCORD_TOKEN,
      intents: [IntentsBitField.Flags.Guilds],
      development: [process.env.DISCORD_DEVELOPMENT_GUILD_ID],
    }),
    ScheduleModule.forRoot(),
  ],
  providers: [AppService, CodeforcesService, AutoContestReminderService],
})
export class AppModule {}
