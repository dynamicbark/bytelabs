import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { CommandInteraction } from 'discord.js';
import { runtimeConfig, runtimeData, saveRuntimeConfig } from '../../utils/RuntimeConfiguration';
import { DiscordChatInputCommand } from '../types/DiscordChatInputCommand';

export class ViewChatCommandsCommand extends DiscordChatInputCommand {
  constructor() {
    super({
      name: 'viewchatcommand',
      description: 'View a chat command.',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'name',
          description: 'The command name',
          required: true,
        },
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
    const nameOption = commandInteraction.options.getString('name', true);
    // Validate and parse command data
    if (!Object.keys(runtimeConfig.games[gameToUse].commands).includes(nameOption)) {
      await commandInteraction.editReply({
        content: 'The chat command specified does not exist.',
      });
      return;
    }
    saveRuntimeConfig();
    const builtChatCommand = runtimeConfig.games[gameToUse].commands[nameOption]
      .map((value) => {
        return `${value.key},${value.delay}`;
      })
      .join(',');
    await commandInteraction.editReply({
      content: `The chat command \`${nameOption.replace(/`/g, '')}\` for the game \`${gameToUse}\` is set to \`${builtChatCommand.replace(
        /`/g,
        ''
      )}\`.`,
    });
  }
}
