import { Message } from 'discord.js';
import { lookupKey, setControlsText } from '../../game/GameRunner';
import { createControlsList, runtimeConfig, saveRuntimeConfig } from '../../utils/RuntimeConfiguration';
import { DiscordTextCommand, DiscordTextCommandData, replyToMessage } from '../types/DiscordTextCommand';

export class SetChatCommandCommand extends DiscordTextCommand {
  constructor() {
    super('setchatcommand');
  }

  async handle(data: DiscordTextCommandData, message: Message): Promise<void> {
    if (data.args.length < 2) {
      await replyToMessage(message, {
        content: [
          'Usage: setchatcommand [command] - [key,delay,...]',
          'Example: `setchatcommand rump - a,500,right,500`',
          'The example command will press the A button and right arrow key for 500 ms each when `rump` is sent in chat.',
          'The valid keys are: `a`, `b`, `x`, `y`, `start`, `select`, `right`, `left`, `up`, `down`, `l stick right`, `l`, `r`, `z`, `l stick left`, `l stick up`, `l stick down`',
        ].join('\n'),
      });
      return;
    }
    const chatCommandFull = data.args.join(' ').split('-');
    const chatCommandName = chatCommandFull[0].trim();
    const chatCommandData = (chatCommandFull[1] || '').trim().split(',');
    const parsedCommandData = [];
    if (chatCommandData.length % 2 !== 0) {
      await replyToMessage(message, {
        content: 'The command data is invalid. (Incorrect length)',
      });
      return;
    }
    for (let i = 0; i < chatCommandData.length; i += 2) {
      if (lookupKey(chatCommandData[i]) === '') {
        await replyToMessage(message, {
          content: `The command data is invalid. (The key \`${chatCommandData[i].replace(/`/g, '')}\` is not valid)`,
        });
        return;
      }
      if (!chatCommandData[i + 1].match(/^\d{1,4}$/)) {
        await replyToMessage(message, {
          content: `The command data is invalid. (The duration \`${chatCommandData[i + 1].replace(/`/g, '')}\` is not valid)`,
        });
        return;
      }
      const parsedDelay = parseInt(chatCommandData[i + 1], 10);
      parsedCommandData.push({
        key: chatCommandData[i],
        delay: parsedDelay,
      });
    }
    runtimeConfig.chatCommands = {
      ...runtimeConfig.chatCommands,
      ...{
        [chatCommandName]: parsedCommandData,
      },
    };
    await setControlsText(createControlsList());
    saveRuntimeConfig();
    await replyToMessage(message, {
      content: `The chat command \`${chatCommandName.replace(/`/g, '')}\` has been set with the data \`${chatCommandFull[1]
        .trim()
        .replace(/`/g, '')}\`.`,
    });
  }
}
