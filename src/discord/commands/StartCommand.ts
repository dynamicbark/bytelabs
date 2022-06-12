import { Message } from 'discord.js';
import { startGameHandler } from '../../game/GameRunner';
import { isCurrentlyRunning, setCurrentlyRunning } from '../../utils/Configuration';
import { DiscordTextCommand, DiscordTextCommandData, replyToMessage } from '../types/DiscordTextCommand';

export class StartCommand extends DiscordTextCommand {
  constructor() {
    super('start');
  }

  async handle(data: DiscordTextCommandData, message: Message): Promise<void> {
    if (isCurrentlyRunning()) {
      await replyToMessage(message, {
        content: 'The Twitch bot is already running.',
      });
      return;
    }
    await replyToMessage(message, {
      content: 'Starting Twitch bot.',
    });
    await startGameHandler();
    setCurrentlyRunning(true);
  }
}
