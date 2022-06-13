import { CommandInteraction } from 'discord.js';
import { toggleRetroArchPause } from '../../utils/RetroArch';
import { runtimeData } from '../../utils/RuntimeConfiguration';
import { DiscordChatInputCommand } from '../types/DiscordChatInputCommand';

export class PauseGameCommand extends DiscordChatInputCommand {
  constructor() {
    super({
      name: 'pausegame',
      description: 'Toggle if the game is paused.',
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
    toggleRetroArchPause();
    await commandInteraction.editReply({
      content: 'The game pause state has been toggled.',
    });
  }
}
