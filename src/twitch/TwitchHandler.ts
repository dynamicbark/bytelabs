import keycode from 'keycode';
import Client from 'tw-irc';
import { prepareIRCMessage, parseIRCMessage } from 'tw-irc/dist/utils';
import { twitchClient } from '..';
import { config } from '../utils/Configuration';
import { pressKeyCode } from '../utils/Keyboard';
import { getActiveChatCommands, runtimeData } from '../utils/RuntimeConfiguration';

export function setupTwitchHandler(twitchClient: Client) {
  twitchClient.onConnected(() => {
    //twitchClient.channels.say('Connected.', config.twitch.channel);
    console.log(`Connected to the Twitch channel ${config.twitch.channel}.`);
  });

  twitchClient.onMessage((event) => {
    // Convert raw socket message to array of messages. We need this action
    // because commands can be concatenated in one message and doing this,
    // we just detect them.
    const messages = prepareIRCMessage(event.data as string);
    // Parse each of the messages
    const parsedMessages = messages.map(parseIRCMessage);
    parsedMessages.forEach((message) => {
      // Handle the messages
      if (message?.channel !== config.twitch.channel) return;
      // Only read chat messages
      if (message.command !== 'PRIVMSG') return;
      // Get the information from the message
      const userId = message.meta!.userId as number;
      const messageContent = message.message as string;
      // Handle the command
      (async () => {
        await commandHandler(`${userId}`, messageContent);
      })();
    });
  });
}

async function commandHandler(userId: string, messageContent: string): Promise<void> {
  const activeChatCommands = getActiveChatCommands();
  if (messageContent === '!gamecmds') {
    if (!runtimeData.canChatControl) {
      twitchClient.channels.say('The commands are currently disabled.', config.twitch.channel);
    } else {
      twitchClient.channels.say(`Commands: ${Object.keys(activeChatCommands).join(', ')}`, config.twitch.channel);
    }
    return;
  }
  // Ignore if it chat cannot control the game
  if (!runtimeData.canChatControl) return;
  // Check to see if the command exists
  if (!Object.keys(activeChatCommands).includes(messageContent)) return;
  const chatCommand = activeChatCommands[messageContent];
  for (let i = 0; i < chatCommand.length; i++) {
    // @ts-ignore
    pressKeyCode(keycode.codes[config.keymap[chatCommand[i].key].key], chatCommand[i].delay);
  }
}
