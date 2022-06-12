import { Message } from 'discord.js';
import { runtimeConfig } from '../../utils/RuntimeConfiguration';
import { DiscordTextCommand, DiscordTextCommandData, replyToMessage } from '../types/DiscordTextCommand';

export class ListChatCommandsCommand extends DiscordTextCommand {
  constructor() {
    super('listchatcommands');
  }

  async handle(data: DiscordTextCommandData, message: Message): Promise<void> {
    const chatCommandNames = Object.keys(runtimeConfig.chatCommands).map((commandName) => `\`${commandName}\``);
    await replyToMessage(message, {
      content: `All chat commands: ${chatCommandNames.join(', ')}`,
    });
  }
}
