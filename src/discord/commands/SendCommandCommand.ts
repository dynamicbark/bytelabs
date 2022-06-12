import { Message } from 'discord.js';
import { keyHandler, lookupKey } from '../../game/GameRunner';
import { runtimeConfig } from '../../utils/RuntimeConfiguration';
import { DiscordTextCommand, DiscordTextCommandData, replyToMessage } from '../types/DiscordTextCommand';

export class SendCommandCommand extends DiscordTextCommand {
  constructor() {
    super('sendcommand');
  }

  async handle(data: DiscordTextCommandData, message: Message): Promise<void> {
    if (data.args.length < 1) {
      await replyToMessage(message, {
        content: [
          'Usage: sendcommand [key,delay,...]',
          'Example: `sendcommand a,500,right,500`',
          'The example command will press the A button and right arrow key for 500 ms each.',
          'The valid keys are: `a`, `b`, `x`, `y`, `start`, `select`, `left`, `right`, `up`, `down`',
        ].join('\n'),
      });
      return;
    }
    const chatCommandFull = data.args.join(' ');
    const chatCommandData = chatCommandFull.trim().split(',');
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
    const randomCommandName = `temp${Math.floor(Math.random() * (1000 - 1) + 1)}`;
    runtimeConfig.chatCommands = {
      ...runtimeConfig.chatCommands,
      ...{
        [randomCommandName]: parsedCommandData,
      },
    };
    keyHandler('1', randomCommandName);
    await replyToMessage(message, {
      content: `The keys \`${chatCommandData.join(',').replace(/`/g, '')}\` have been run.`,
    });
    delete runtimeConfig.chatCommands[randomCommandName];
  }
}
