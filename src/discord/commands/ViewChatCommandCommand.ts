import { Message } from 'discord.js';
import { runtimeConfig } from '../../utils/RuntimeConfiguration';
import { DiscordTextCommand, DiscordTextCommandData, replyToMessage } from '../types/DiscordTextCommand';

export class ViewChatCommandCommand extends DiscordTextCommand {
  constructor() {
    super('viewchatcommand');
  }

  async handle(data: DiscordTextCommandData, message: Message): Promise<void> {
    if (data.args.length < 1) {
      await replyToMessage(message, {
        content: 'Usage: viewchatcommand [command]',
      });
      return;
    }
    const chatCommandName = data.args.join(' ').trim();
    const chatCommandNames = Object.keys(runtimeConfig.chatCommands);
    if (!chatCommandNames.includes(chatCommandName)) {
      await replyToMessage(message, {
        content: `The chat command specified does not exist.`,
      });
      return;
    }
    const chatCommand = runtimeConfig.chatCommands[chatCommandName];
    const builtChatCommand = chatCommand
      .map((value) => {
        return `${value.key},${value.delay}`;
      })
      .join(',');
    await replyToMessage(message, {
      content: `The chat command \`${chatCommandName.replace(/`/g, '')}\` is set to \`${builtChatCommand.replace(/`/g, '')}\`.`,
    });
  }
}
