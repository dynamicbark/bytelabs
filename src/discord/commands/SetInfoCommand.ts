import { Message } from 'discord.js';
import { setInfoText } from '../../game/GameRunner';
import { config } from '../../utils/Configuration';
import { runtimeConfig, saveRuntimeConfig } from '../../utils/RuntimeConfiguration';
import { DiscordTextCommand, DiscordTextCommandData, replyToMessage } from '../types/DiscordTextCommand';

export class SetInfoCommand extends DiscordTextCommand {
  constructor() {
    super('setinfo');
  }

  async handle(data: DiscordTextCommandData, message: Message): Promise<void> {
    const commandWithPrefix = `${config.discord.prefix}setinfo`;
    const infoText = message.content.substring(commandWithPrefix.length).trim();
    runtimeConfig.info = infoText;
    await setInfoText(infoText);
    saveRuntimeConfig();
    await replyToMessage(message, {
      content: `The info has been updated.`,
    });
  }
}
