import { CommandInteraction } from 'discord.js';
import { runtimeData } from '../../utils/RuntimeConfiguration';
import { DiscordChatInputCommand } from '../types/DiscordChatInputCommand';

export class ToggleChatControlCommand extends DiscordChatInputCommand {
  constructor() {
    super({
      name: 'togglechatcontrol',
      description: 'Toggle if chat can control the game or not.',
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
    const outputMessage = runtimeData.canChatControl ? 'The chat can no longer control the game.' : 'The chat can now control the game.';
    runtimeData.canChatControl = !runtimeData.canChatControl;
    await commandInteraction.editReply({
      content: outputMessage,
    });
  }
}
