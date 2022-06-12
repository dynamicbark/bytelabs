import { readFileSync } from 'fs';

export interface Configuration {
  discord: {
    token: string;
    prefix: string;
    accessRoles: string[];
    accessUsers: string[];
  };
  twitch: {
    username: string;
    password: string;
    channel: string;
  };
  playerUrl: string;
}

export const config: Configuration = JSON.parse(readFileSync('config.json').toString());

let currentlyRunning = false;

export function isCurrentlyRunning(): boolean {
  return currentlyRunning;
}

export function setCurrentlyRunning(state: boolean): void {
  currentlyRunning = state;
}
