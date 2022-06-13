import { Client as DiscordClient } from 'discord.js';
import Client from 'tw-irc';
import { messageCreateListener } from './discord/listeners/MessageCreateListener';
import { readyListener } from './discord/listeners/ReadyListener';
import { startGameHandler } from './game/GameRunner';
import { setupTwitchHandler } from './twitch/TwitchHandler';
import { config } from './utils/Configuration';

export const discordClient = new DiscordClient({
  intents: ['GUILDS', 'GUILD_MESSAGES'],
  presence: {
    status: 'online',
    activities: [
      {
        type: 'WATCHING',
        name: `stream - ${config.discord.prefix}help`,
      },
    ],
  },
});
export const twitchClient = new Client({
  channels: [config.twitch.channel],
  secure: true,
  auth: {
    login: config.twitch.username,
    password: config.twitch.password,
  },
});
setupTwitchHandler(twitchClient);

discordClient.on('messageCreate', messageCreateListener);
discordClient.on('ready', readyListener);

async function main() {
  discordClient.login(config.discord.token);
  twitchClient.connect();
  await startGameHandler();
}

main().catch((e) => {
  throw e;
});
