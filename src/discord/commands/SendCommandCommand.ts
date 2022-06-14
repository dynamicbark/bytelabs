import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { CommandInteraction } from 'discord.js';
import { config } from '../../utils/Configuration';
import { runtimeData } from '../../utils/RuntimeConfiguration';
import { DiscordChatInputCommand } from '../types/DiscordChatInputCommand';
import { pressKeyCode } from '../../utils/Keyboard';

export class SendCommandCommand extends DiscordChatInputCommand {
  constructor() {
    super({
      name: 'sendcommand',
      description: 'Send a command.',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'data',
          description: 'The command data',
          required: true,
        },
      ],
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
    for (let i = 0; i < parsedCommandData.length; i++) {
      // @ts-ignore
      pressKeyCode(keycode.codes[config.keymap[parsedCommandData[i].key].key], parsedCommandData[i].delay);
    }
    await commandInteraction.editReply({
      content: `The command data \`${dataOption.replace(/`/g, '')}\` has been run.`,
    });
  }
}
