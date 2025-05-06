import { Module } from '@nestjs/common';
import { NecordModule } from 'necord';
import { IntentsBitField } from 'discord.js';
import { AppService } from './app.service';
import { MovieService } from './movie/codeforces.service';
import { BotModule } from 'libs/bot/src';

@Module({
  imports: [
    BotModule,
    NecordModule.forRoot({
      token: process.env.DISCORD_TOKEN,
      intents: [IntentsBitField.Flags.Guilds],
      development: [process.env.DISCORD_DEVELOPMENT_GUILD_ID],
    }),
  ],
  providers: [AppService, MovieService],
})
export class AppModule {}
