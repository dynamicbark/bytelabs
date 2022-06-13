import { Client, GuildMemberRoleManager, Interaction } from 'discord.js';
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { config } from '../../utils/Configuration';
import { DiscordChatInputCommand } from '../types/DiscordChatInputCommand';
import { UploadGameCommand } from '../commands/UploadGameCommand';
import { StatusCommand } from '../commands/StatusCommand';
import { DeleteGameCommand } from '../commands/DeleteGameCommand';
import { StartGameCommand } from '../commands/StartGameCommand';
import { StopGameCommand } from '../commands/StopGameCommand';
import { PauseGameCommand } from '../commands/PauseGameCommand';
import { DeleteChatCommandsCommand } from '../commands/DeleteChatCommandCommand';
import { ListChatCommandsCommand } from '../commands/ListChatCommandsCommand';
import { ToggleChatControlCommand } from '../commands/ToggleChatControlCommand';
import { ViewChatCommandsCommand } from '../commands/ViewChatCommandCommand';
import { SetChatCommandsCommand } from '../commands/SetChatCommandCommand';
import { ListGamesCommand } from '../commands/ListGamesCommand';

const globalChatInputCommandMap = new Map<string, DiscordChatInputCommand>();

function registerGlobalChatInputCommand(discordChatInputCommand: DiscordChatInputCommand): void {
  globalChatInputCommandMap.set(discordChatInputCommand.commandConfiguration.name, discordChatInputCommand);
}

// Register the commands
registerGlobalChatInputCommand(new DeleteChatCommandsCommand());
registerGlobalChatInputCommand(new DeleteGameCommand());
registerGlobalChatInputCommand(new ListChatCommandsCommand());
registerGlobalChatInputCommand(new ListGamesCommand());
registerGlobalChatInputCommand(new PauseGameCommand());
registerGlobalChatInputCommand(new SetChatCommandsCommand());
registerGlobalChatInputCommand(new StartGameCommand());
registerGlobalChatInputCommand(new StatusCommand());
registerGlobalChatInputCommand(new StopGameCommand());
registerGlobalChatInputCommand(new ToggleChatControlCommand());
registerGlobalChatInputCommand(new UploadGameCommand());
registerGlobalChatInputCommand(new ViewChatCommandsCommand());

export async function interactionCreateListener(interaction: Interaction): Promise<void> {
  // Handle commands
  if (interaction.isCommand()) {
    let discordCommand;
    if (!discordCommand) {
      discordCommand = globalChatInputCommandMap.get(interaction.commandName);
    }
    if (!discordCommand) {
      return interaction.reply({
        content: 'The command requested was not found.',
        ephemeral: true,
      });
    }
    if (!interaction.inGuild()) {
      return interaction.reply({
        content: 'This command must be run in a guild.',
        ephemeral: true,
      });
    }
    let hasAllowedRole = false;
    for (let i = 0; i < config.discord.allowedRoles.length; i++) {
      if ((interaction.member.roles as GuildMemberRoleManager).cache.has(config.discord.allowedRoles[i])) {
        hasAllowedRole = true;
      }
    }
    if (!hasAllowedRole && !config.discord.allowedUsers.includes(interaction.user.id)) {
      return interaction.reply({
        content: 'You do not have access to this command.',
        ephemeral: true,
      });
    }
    try {
      await discordCommand.handle(interaction);
    } catch (e) {
      console.log('The command encountered an error while running.', e);
      if (interaction.deferred) {
        interaction.editReply({
          content: 'The command encountered an error while running.',
        });
      } else if (interaction.replied) {
        interaction.followUp({
          content: 'The command encountered an error while running.',
        });
      } else {
        interaction.reply({
          content: 'The command encountered an error while running.',
          ephemeral: true,
        });
      }
    }
    return;
  }
  // TODO: Add other interaction types
}

export async function registerCommandsOnDiscord(client: Client<true>) {
  if (config.discord.setGlobalCommandsOnStart) {
    // Global commands
    const globalCommands: RESTPostAPIApplicationCommandsJSONBody[] = [];
    globalChatInputCommandMap.forEach((globalChatInputCommand) => {
      globalCommands.push(globalChatInputCommand.commandConfiguration);
    });
    await client.application.commands.set(globalCommands);
  }
}
