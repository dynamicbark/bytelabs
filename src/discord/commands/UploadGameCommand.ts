import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { CommandInteraction } from 'discord.js';
import { writeFileSync } from 'fs';
import fetch from 'node-fetch';
import path from 'path';
import { runtimeConfig, saveRuntimeConfig } from '../../utils/RuntimeConfiguration';
import { DiscordChatInputCommand } from '../types/DiscordChatInputCommand';

export class UploadGameCommand extends DiscordChatInputCommand {
  constructor() {
    super({
      name: 'uploadgame',
      description: 'Upload a game to the bot.',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'name',
          description: 'The game name.',
          required: true,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: 'console',
          description: 'The console the game is made for.',
          required: true,
          choices: [
            {
              name: 'NES',
              value: 'nes',
            },
            {
              name: 'Nintendo 64',
              value: 'n64',
            },
          ],
        },
        {
          type: ApplicationCommandOptionType.Attachment,
          name: 'file',
          description: 'The game ROM file.',
          required: true,
        },
      ],
    });
  }

  async handle(commandInteraction: CommandInteraction): Promise<void> {
    await commandInteraction.deferReply();
    const nameOption = commandInteraction.options.getString('name', true);
    if (!nameOption.match(/^([a-zA-Z0-9_\-\(\)]+)$/g)) {
      await commandInteraction.editReply({
        content: 'The game name can only contain alphanumeric characters, underscore, dash, and parentheses.',
      });
      return;
    }
    if (Object.keys(runtimeConfig.games).includes(nameOption)) {
      await commandInteraction.editReply({
        content: 'A game already exists with the name specified.',
      });
      return;
    }
    const consoleOption = commandInteraction.options.getString('console', true);
    const fileOption = commandInteraction.options.getAttachment('file', true);
    const romResponse = await fetch(fileOption.url);
    const fileExtension = fileOption.url.split('.').pop();
    writeFileSync(path.join(__dirname, '..', '..', '..', 'data', 'games', `${nameOption}.${fileExtension}`), await romResponse.buffer());
    runtimeConfig.games = {
      ...runtimeConfig.games,
      ...{
        [nameOption]: {
          console: consoleOption,
          romFile: `${nameOption}.${fileExtension}`,
          commands: {},
        },
      },
    };
    saveRuntimeConfig();
    await commandInteraction.editReply({
      content: 'The game has been uploaded.',
    });
  }
}
