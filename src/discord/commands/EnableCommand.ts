import { Message } from 'discord.js';
import { isCurrentlyRunning, setCurrentlyRunning } from '../../utils/Configuration';
import { DiscordTextCommand, DiscordTextCommandData, replyToMessage } from '../types/DiscordTextCommand';

export class EnableCommand extends DiscordTextCommand {
  constructor() {
    super('enable');
  }

  async handle(data: DiscordTextCommandData, message: Message): Promise<void> {
    if (isCurrentlyRunning()) {
      await replyToMessage(message, {
        content: 'The Twitch bot is already enabled.',
      });
      return;
    }
    await replyToMessage(message, {
      content: 'Enabling Twitch bot.',
    });
    setCurrentlyRunning(true);
  }
}
