import { CommandInteraction } from 'discord.js';
import { runtimeConfig } from '../../utils/RuntimeConfiguration';
import { DiscordChatInputCommand } from '../types/DiscordChatInputCommand';

export class ListGamesCommand extends DiscordChatInputCommand {
  constructor() {
    super({
      name: 'listgames',
      description: 'List the games.',
    });
  }

  async handle(commandInteraction: CommandInteraction): Promise<void> {
    await commandInteraction.deferReply();
    const gameNames = Object.keys(runtimeConfig.games).map((game) => `\`${game}\``);
    await commandInteraction.editReply({
      content: `Available Games: ${gameNames.join(', ')}`,
    });
  }
}
