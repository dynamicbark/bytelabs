import { Message, MessageOptions } from 'discord.js';

export type DiscordTextCommandData = {
  args: string[];
};

export abstract class DiscordTextCommand {
  public readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract handle(data: DiscordTextCommandData, message: Message): Promise<void>;
}

export async function replyToMessage(message: Message, options: MessageOptions): Promise<Message> {
  return message.reply({
    allowedMentions: {
      repliedUser: false,
    },
    ...options,
  });
}
