import { Message } from 'discord.js';
import { DiscordTextCommand, DiscordTextCommandData, replyToMessage } from '../types/DiscordTextCommand';

export class HelpCommand extends DiscordTextCommand {
  constructor() {
    super('help');
  }

  async handle(data: DiscordTextCommandData, message: Message): Promise<void> {
    await replyToMessage(message, {
      content: [
        'Command Help:',
        '`deletechatcommand [name]` - Delete the chat command',
        '`help` - This command',
        '`listchatcommands` - List the chat commands',
        '`load` - Load a NES ROM into the player',
        '`reset` - Reset the player',
        '`setchatcommand [name] - [key,delay,...]` - Set a chat command',
        '`start` - Start the Twitch bot',
        '`stop` - Stop the Twitch bot',
        '`viewchatcommand [name]` - View a chat command',
      ].join('\n'),
    });
  }
}
