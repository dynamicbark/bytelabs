import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { CommandInteraction } from 'discord.js';
import { unlinkSync } from 'fs';
import path from 'path';
import { runtimeConfig, runtimeData, saveRuntimeConfig } from '../../utils/RuntimeConfiguration';
import { DiscordChatInputCommand } from '../types/DiscordChatInputCommand';

export class DeleteGameCommand extends DiscordChatInputCommand {
  constructor() {
    super({
      name: 'deletegame',
      description: 'Delete a game from the bot.',
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
    if (runtimeData.selectedGame === nameOption) {
      await commandInteraction.editReply({
        content: 'The game cannot be deleted when it is currently selected.',
      });
      return;
    }
    unlinkSync(path.join(__dirname, '..', '..', '..', 'data', 'games', runtimeConfig.games[nameOption].romFile));
    delete runtimeConfig.games[nameOption];
    saveRuntimeConfig();
    await commandInteraction.editReply({
      content: 'The game has been deleted.',
    });
  }
}
