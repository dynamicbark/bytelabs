import { Message } from 'discord.js';
import { stopGameHandler } from '../../game/GameRunner';
import { isCurrentlyRunning, setCurrentlyRunning } from '../../utils/Configuration';
import { DiscordTextCommand, DiscordTextCommandData, replyToMessage } from '../types/DiscordTextCommand';

export class StopCommand extends DiscordTextCommand {
  constructor() {
    super('stop');
  }

  async handle(data: DiscordTextCommandData, message: Message): Promise<void> {
    if (!isCurrentlyRunning()) {
      await replyToMessage(message, {
        content: 'The Twitch bot is not running.',
      });
      return;
    }
    await replyToMessage(message, {
      content: 'Stopping Twitch bot.',
    });
    setCurrentlyRunning(false);
    await stopGameHandler();
  }
}
