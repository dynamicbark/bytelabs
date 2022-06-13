import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { CommandInteraction } from 'discord.js';
import { startRetroArch } from '../../utils/RetroArch';
import { runtimeConfig, runtimeData } from '../../utils/RuntimeConfiguration';
import { DiscordChatInputCommand } from '../types/DiscordChatInputCommand';

export class StartGameCommand extends DiscordChatInputCommand {
  constructor() {
    super({
      name: 'startgame',
      description: 'Start a game.',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'name',
          description: 'The game name.',
          required: true,
        },
      ],
    });
  }

  async handle(commandInteraction: CommandInteraction): Promise<void> {
    await commandInteraction.deferReply();
    const nameOption = commandInteraction.options.getString('name', true);
    if (!Object.keys(runtimeConfig.games).includes(nameOption)) {
      await commandInteraction.editReply({
        content: 'No game exists with the name specified.',
      });
      return;
    }
    if (runtimeData.selectedGame !== '') {
      await commandInteraction.editReply({
        content: 'The game cannot be started when a game is already running.',
      });
      return;
    }
    runtimeData.selectedGame = nameOption;
    startRetroArch(nameOption);
    await commandInteraction.editReply({
      content: 'The game has been started.',
    });
  }
}
