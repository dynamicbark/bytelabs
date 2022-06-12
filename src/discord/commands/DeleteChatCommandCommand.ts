import { Message } from 'discord.js';
import { setControlsText } from '../../game/GameRunner';
import { createControlsList, runtimeConfig, saveRuntimeConfig } from '../../utils/RuntimeConfiguration';
import { DiscordTextCommand, DiscordTextCommandData, replyToMessage } from '../types/DiscordTextCommand';

export class DeleteChatCommandCommand extends DiscordTextCommand {
  constructor() {
    super('deletechatcommand');
  }

  async handle(data: DiscordTextCommandData, message: Message): Promise<void> {
    if (data.args.length < 1) {
      await replyToMessage(message, {
        content: 'Usage: deletechatcommand [command]',
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
    delete runtimeConfig.chatCommands[chatCommandName];
    await setControlsText(createControlsList());
    saveRuntimeConfig();
    await replyToMessage(message, {
      content: `The chat command \`${chatCommandName.replace(/`/g, '')}\` has been deleted.`,
    });
  }
}
