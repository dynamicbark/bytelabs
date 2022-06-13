import { CommandInteraction } from 'discord.js';
import { stopRetroArch } from '../../utils/RetroArch';
import { runtimeData } from '../../utils/RuntimeConfiguration';
import { DiscordChatInputCommand } from '../types/DiscordChatInputCommand';

export class StopGameCommand extends DiscordChatInputCommand {
  constructor() {
    super({
      name: 'stopgame',
      description: 'Stop the game.',
    });
  }

  async handle(commandInteraction: CommandInteraction): Promise<void> {
    await commandInteraction.deferReply();
    if (runtimeData.selectedGame === '') {
      await commandInteraction.editReply({
        content: 'There is no currently running game.',
      });
      return;
    }
    runtimeData.selectedGame = '';
    runtimeData.canChatControl = false;
    stopRetroArch();
    await commandInteraction.editReply({
      content: 'The game has been stopped.',
    });
  }
}
