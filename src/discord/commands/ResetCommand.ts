import { Message } from 'discord.js';
import { resetConsole, stopGameHandler } from '../../game/GameRunner';
import { isCurrentlyRunning, setCurrentlyRunning } from '../../utils/Configuration';
import { DiscordTextCommand, DiscordTextCommandData, replyToMessage } from '../types/DiscordTextCommand';

export class ResetCommand extends DiscordTextCommand {
  constructor() {
    super('reset');
  }

  async handle(data: DiscordTextCommandData, message: Message): Promise<void> {
    if (!isCurrentlyRunning()) {
      await replyToMessage(message, {
        content: 'The Twitch bot is not running.',
      });
      return;
    }
    await replyToMessage(message, {
      content: 'Resetting the console.',
    });
    setCurrentlyRunning(false);
    await stopGameHandler();
  }
}
