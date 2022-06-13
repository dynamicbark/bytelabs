import { Client as DiscordClient } from 'discord.js';
import Client from 'tw-irc';
import { interactionCreateListener } from './discord/listeners/InteractionCreateListener';
import { readyListener } from './discord/listeners/ReadyListener';
import { setupTwitchHandler } from './twitch/TwitchHandler';
import { config } from './utils/Configuration';

export const discordClient = new DiscordClient({
  intents: ['GUILDS'],
  presence: {
    status: 'online',
    activities: [
      {
        type: 'WATCHING',
        name: `the stream`,
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

discordClient.on('interactionCreate', interactionCreateListener);
discordClient.on('ready', readyListener);

async function main() {
  discordClient.login(config.discord.token);
  twitchClient.connect();
}

main().catch((e) => {
  throw e;
});
