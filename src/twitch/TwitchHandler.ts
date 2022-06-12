import Client from 'tw-irc';
import { prepareIRCMessage, parseIRCMessage } from 'tw-irc/dist/utils';
import { keyHandler } from '../game/GameRunner';
import { config, isCurrentlyRunning } from '../utils/Configuration';

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
      // Ignore if it isn't running
      if (!isCurrentlyRunning()) return;
      // Handle the messages
      if (message?.channel !== config.twitch.channel) return;
      // Only read chat messages
      if (message.command !== 'PRIVMSG') return;
      // Get the information from the message
      const userId = message.meta!.userId as number;
      const messageContent = message.message as string;
      // Handle the command
      (async () => {
        await keyHandler(`${userId}`, messageContent);
      })();
    });
  });
}
