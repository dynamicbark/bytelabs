import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { CommandInteraction } from 'discord.js';
import { runtimeConfig, runtimeData } from '../../utils/RuntimeConfiguration';
import { DiscordChatInputCommand } from '../types/DiscordChatInputCommand';

export class ListChatCommandsCommand extends DiscordChatInputCommand {
  constructor() {
    super({
      name: 'listchatcommands',
      description: 'List the chat commands.',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'game',
          description: 'A game name (will use currently selected game by default)',
          required: false,
        },
      ],
    });
  }

  async handle(commandInteraction: CommandInteraction): Promise<void> {
    await commandInteraction.deferReply();
    const gameOption = commandInteraction.options.getString('game', false);
    if (runtimeData.selectedGame === '' && !gameOption) {
      await commandInteraction.editReply({
        content: 'There is no currently running game, you must specify a game name.',
      });
      return;
    }
    const gameToUse = !gameOption ? runtimeData.selectedGame : gameOption;
    if (!Object.keys(runtimeConfig.games).includes(gameToUse)) {
      await commandInteraction.editReply({
        content: 'The game specified does not exist.',
      });
      return;
    }
    const chatCommandNames = Object.keys(runtimeConfig.games[gameToUse].commands).map((commandName) => `\`${commandName}\``);
    await commandInteraction.editReply({
      content: `Chat commands for \`${gameToUse}\`: ${chatCommandNames.join(', ')}`,
    });
  }
}
