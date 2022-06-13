import { Client } from 'discord.js';
import { config } from '../../utils/Configuration';
import { registerCommandsOnDiscord } from './InteractionCreateListener';

export async function readyListener(clientObject: Client<true>): Promise<void> {
  console.log(`Logged in as ${clientObject.user.tag}.`);
  if (config.discord.setGlobalCommandsOnStart) {
    console.log(`Registering commands on Discord.`);
    await registerCommandsOnDiscord(clientObject);
  }
}
