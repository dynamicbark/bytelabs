import { CommandInteraction } from 'discord.js';
import { runtimeData } from '../../utils/RuntimeConfiguration';
import { DiscordChatInputCommand } from '../types/DiscordChatInputCommand';

export class StatusCommand extends DiscordChatInputCommand {
  constructor() {
    super({
      name: 'status',
      description: 'Check the bot status.',
    });
  }

  async handle(commandInteraction: CommandInteraction): Promise<void> {
    await commandInteraction.deferReply();
    await commandInteraction.editReply({
      content: [
        `Selected Game: ${runtimeData.selectedGame === '' ? 'None' : runtimeData.selectedGame}`,
        `Can chat control: ${runtimeData.canChatControl ? 'Yes' : 'No'}`,
      ].join('\n'),
    });
  }
}
