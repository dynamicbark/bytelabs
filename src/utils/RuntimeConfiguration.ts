import { readFileSync, writeFileSync } from 'fs';
import { lookupKeyName } from '../game/GameRunner';

export type RuntimeConfigurationKeys =
  | 'a'
  | 'b'
  | 'x'
  | 'y'
  | 'start'
  | 'select'
  | 'right'
  | 'left'
  | 'up'
  | 'down'
  | 'l stick left'
  | 'l stick right'
  | 'l stick up'
  | 'l stick down';

export interface RuntimeConfiguration {
  chatCommands: {
    [key: string]: { key: string; delay: number }[];
  };
  info: string;
}

export let runtimeConfig: RuntimeConfiguration = JSON.parse(readFileSync('runtimeConfig.json').toString());

export function saveRuntimeConfig(): void {
  writeFileSync('runtimeConfig.json', JSON.stringify(runtimeConfig));
}

export function createControlsList(): string {
  const controlsList: string[] = [];
  const chatCommandNames = Object.keys(runtimeConfig.chatCommands);
  for (let i = 0; i < chatCommandNames.length; i++) {
    const builtControlsLine = runtimeConfig.chatCommands[chatCommandNames[i]]
      .map((value) => {
        return `${lookupKeyName(value.key)} for ${value.delay}ms`;
      })
      .join(', ');
    controlsList.push(`<li><span style="font-weight:900;">${chatCommandNames[i]}</span>: ${builtControlsLine}</li>`);
  }
  return controlsList.sort().join('\n');
}
