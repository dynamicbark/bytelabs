import { Client } from 'discord.js';

export async function readyListener(clientObject: Client<true>): Promise<void> {
  console.log(`Logged into Discord as ${clientObject.user.tag}.`);
}
