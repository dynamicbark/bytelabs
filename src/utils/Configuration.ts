import { readFileSync } from 'fs';

export interface Configuration {
  discord: {
    token: string;
    setGlobalCommandsOnStart: boolean;
    allowedRoles: string[];
    allowedUsers: string[];
  };
  twitch: {
    username: string;
    password: string;
    channel: string;
  };
  retroarch: {
    path: string;
  };
  keymap: {
    [key: string]: {
      niceName: string;
      key: string;
    };
  };
}

export const config: Configuration = JSON.parse(readFileSync('config.json').toString());
