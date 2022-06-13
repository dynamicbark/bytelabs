import { readFileSync, writeFileSync } from 'fs';

export type ChatCommands = {
  [key: string]: {
    key: string;
    delay: number;
  }[];
};

export interface RuntimeConfiguration {
  games: {
    [key: string]: {
      console: string;
      romFile: string;
      commands: ChatCommands;
    };
  };
}

export const runtimeData = {
  canChatControl: false,
  selectedGame: '',
};

export const runtimeConfig: RuntimeConfiguration = JSON.parse(readFileSync('runtimeConfig.json').toString());

export function saveRuntimeConfig(): void {
  writeFileSync('runtimeConfig.json', JSON.stringify(runtimeConfig));
}

export function getActiveChatCommands(): ChatCommands {
  if (!runtimeData.canChatControl || runtimeData.selectedGame === '') return {};
  return runtimeConfig.games[runtimeData.selectedGame].commands;
}
