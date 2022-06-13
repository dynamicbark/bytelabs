import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { CommandInteraction } from 'discord.js';
import { config } from '../../utils/Configuration';
import { runtimeConfig, runtimeData, saveRuntimeConfig } from '../../utils/RuntimeConfiguration';
import { DiscordChatInputCommand } from '../types/DiscordChatInputCommand';

export class SetChatCommandsCommand extends DiscordChatInputCommand {
  constructor() {
    super({
      name: 'setchatcommand',
      description: 'Set a chat command.',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'name',
          description: 'The command name',
          required: true,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: 'data',
          description: 'The command data',
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
    // Validate command name
    const nameOption = commandInteraction.options.getString('name', true);
    if (nameOption.length > 32) {
      await commandInteraction.editReply({
        content: 'The chat command name must be shorter than 32 characters.',
      });
      return;
    }
    // Validate and parse command data
    const dataOption = commandInteraction.options.getString('data', true);
    const dataOptionSplit = dataOption.split(',');
    if (dataOptionSplit.length % 2 !== 0) {
      await commandInteraction.editReply({
        content: 'The command data is invalid. (Incorrect length)',
      });
      return;
    }
    const validKeys = Object.keys(config.keymap);
    const parsedCommandData = [];
    for (let i = 0; i < dataOptionSplit.length; i += 2) {
      if (!validKeys.includes(dataOptionSplit[i])) {
        await commandInteraction.editReply({
          content: `The command data is invalid. (The key \`${dataOptionSplit[i].replace(/`/g, '')}\` is not valid)`,
        });
        return;
      }
      if (!dataOptionSplit[i + 1].match(/^\d{1,4}$/)) {
        await commandInteraction.editReply({
          content: `The command data is invalid. (The duration \`${dataOptionSplit[i + 1].replace(/`/g, '')}\` is not valid)`,
        });
        return;
      }
      const parsedDelay = parseInt(dataOptionSplit[i + 1], 10);
      parsedCommandData.push({
        key: dataOptionSplit[i],
        delay: parsedDelay,
      });
    }
    runtimeConfig.games[gameToUse].commands = {
      ...runtimeConfig.games[gameToUse].commands,
      ...{
        [nameOption]: parsedCommandData,
      },
    };
    saveRuntimeConfig();
    await commandInteraction.editReply({
      content: `The chat command \`${nameOption.replace(/`/g, '')}\` for the game \`${gameToUse}\` has been set.`,
    });
  }
}
