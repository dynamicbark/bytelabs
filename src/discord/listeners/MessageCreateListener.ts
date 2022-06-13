import { Message } from 'discord.js';
import { config } from '../../utils/Configuration';
import { DeleteChatCommandCommand } from '../commands/DeleteChatCommandCommand';
import { HelpCommand } from '../commands/HelpCommand';
import { ListChatCommandsCommand } from '../commands/ListChatCommandsCommand';
import { LoadCommand } from '../commands/LoadCommand';
import { ResetCommand } from '../commands/ResetCommand';
import { SendCommandCommand } from '../commands/SendCommandCommand';
import { SetChatCommandCommand } from '../commands/SetChatCommandCommand';
import { SetInfoCommand } from '../commands/SetInfoCommand';
import { EnableCommand } from '../commands/EnableCommand';
import { ViewChatCommandCommand } from '../commands/ViewChatCommandCommand';
import { DiscordTextCommand } from '../types/DiscordTextCommand';
import { DisableCommand } from '../commands/DisableCommand';

const discordTextCommandMap = new Map<string, DiscordTextCommand>();

function registerDiscordTextCommand(discordTextCommand: DiscordTextCommand): void {
  discordTextCommandMap.set(discordTextCommand.name, discordTextCommand);
}

registerDiscordTextCommand(new DeleteChatCommandCommand());
registerDiscordTextCommand(new DisableCommand());
registerDiscordTextCommand(new EnableCommand());
registerDiscordTextCommand(new HelpCommand());
registerDiscordTextCommand(new ListChatCommandsCommand());
registerDiscordTextCommand(new LoadCommand());
registerDiscordTextCommand(new ResetCommand());
registerDiscordTextCommand(new SendCommandCommand());
registerDiscordTextCommand(new SetChatCommandCommand());
registerDiscordTextCommand(new SetInfoCommand());
registerDiscordTextCommand(new ViewChatCommandCommand());

export async function messageCreateListener(message: Message): Promise<void> {
  if (message.author.bot) return;
  if (!message.content.startsWith(config.discord.prefix)) return;
  // Check if the user has access
  const userHasAccess = config.discord.accessUsers.includes(message.author.id);
  // Check if any of the roles of the member has access
  let userHasRole = false;
  const userRoles = [...message.member!.roles.cache.keys()];
  for (let i = 0; i < userRoles.length; i++) {
    if (config.discord.accessRoles.includes(userRoles[i])) {
      userHasRole = true;
    }
  }
  // If the user doens't have access and they don't have a role
  if (!userHasAccess && !userHasRole) return;
  // Check if the command exists
  const contentWithoutPrefix = message.content.substring(config.discord.prefix.length);
  const contentSplit = contentWithoutPrefix.split(' ');
  const commandName = contentSplit.shift() || '';
  if (!discordTextCommandMap.has(commandName)) return;
  const discordTextCommand = discordTextCommandMap.get(commandName);
  if (!discordTextCommand) return;
  // Execute the command
  try {
    await discordTextCommand.handle(
      {
        args: contentSplit,
      },
      message
    );
  } catch (e) {
    console.log(e);
  }
}
