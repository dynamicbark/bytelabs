import { Message } from 'discord.js';
import { loadROM } from '../../game/GameRunner';
import { DiscordTextCommand, DiscordTextCommandData, replyToMessage } from '../types/DiscordTextCommand';

export class LoadCommand extends DiscordTextCommand {
  constructor() {
    super('load');
  }

  async handle(data: DiscordTextCommandData, message: Message): Promise<void> {
    if (message.attachments.size === 0) {
      await replyToMessage(message, {
        content: 'You must attach a ROM file.',
      });
      return;
    }
    await replyToMessage(message, {
      content: 'Loading the specified ROM...',
    });
    const romUrl = message.attachments.first()?.url || 'none';
    await loadROM(romUrl);
  }
}
