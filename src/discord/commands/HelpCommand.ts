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
        '`disable` - Disable the Twitch bot (chat can not input commands)',
        '`enable` - Enable the Twitch bot (chat can input commands)',
        '`help` - This command',
        '`listchatcommands` - List the chat commands',
        '`load` - Load a ROM into the player',
        '`reset` - Reset the console',
        '`sendcommand [key,delay,...]` - Send a command',
        '`setchatcommand [name] - [key,delay,...]` - Set a chat command',
        '`setinfo [text]` - Sets the info that is displayed',
        '`viewchatcommand [name]` - View a chat command',
      ].join('\n'),
    });
  }
}
