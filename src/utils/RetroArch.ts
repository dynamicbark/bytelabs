import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { createSocket } from 'dgram';
import path from 'path';
import { config } from './Configuration';
import { runtimeConfig } from './RuntimeConfiguration';

let retroarchSubprocess: ChildProcessWithoutNullStreams | undefined;

function sendCommandToRetroArch(command: string) {
  const udpClient = createSocket('udp4');
  const data = Buffer.from(`${command}`);
  udpClient.send(data, 55355, '127.0.0.1');
  setTimeout(() => {
    udpClient.close();
  }, 1000);
}

function consoleNameToCore(console: string): string {
  switch (console) {
    case 'nes':
      return 'mesen_libretro.dll';
    case 'n64':
      return 'mupen64plus_next_libretro.dll';
    default:
      return '';
  }
}

export async function startRetroArch(gameName: string): Promise<void> {
  const game = runtimeConfig.games[gameName];
  if (!game) {
    throw Error(`The game '${gameName}' does not exist. Cannot start RetroArch.`);
  }
  // retroarch.exe --config [path to config] --libretro [path to core] [path to rom] --verbose --fullscreen
  retroarchSubprocess = spawn(
    path.join(config.retroarch.path, 'retroarch.exe'),
    [
      `--config`,
      `${path.join(__dirname, '..', '..', 'data', 'retroarch.cfg')}`,
      `--libretro`,
      `${path.join(config.retroarch.path, 'cores', consoleNameToCore(game.console))}`,
      `${path.join(__dirname, '..', '..', 'data', 'games', game.romFile)}`,
      `--verbose`,
      `--fullscreen`,
    ],
    {
      detached: false,
      stdio: ['pipe', 'pipe', 'pipe'],
    }
  );
}

export async function stopRetroArch(): Promise<void> {
  sendCommandToRetroArch('QUIT\n');
  setTimeout(() => {
    sendCommandToRetroArch('QUIT\n');
  }, 250);
}

export async function toggleRetroArchPause(): Promise<void> {
  sendCommandToRetroArch('PAUSE_TOGGLE\n');
}
