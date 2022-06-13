import { Message } from 'discord.js';
import { isCurrentlyRunning, setCurrentlyRunning } from '../../utils/Configuration';
import { DiscordTextCommand, DiscordTextCommandData, replyToMessage } from '../types/DiscordTextCommand';

export class DisableCommand extends DiscordTextCommand {
  constructor() {
    super('disable');
  }

  async handle(data: DiscordTextCommandData, message: Message): Promise<void> {
    if (isCurrentlyRunning()) {
      await replyToMessage(message, {
        content: 'The Twitch bot is not enabled.',
      });
      return;
    }
    await replyToMessage(message, {
      content: 'Disabling Twitch bot.',
    });
    setCurrentlyRunning(false);
  }
}
