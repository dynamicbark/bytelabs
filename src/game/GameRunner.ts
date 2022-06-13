import puppeteer, { KeyInput } from 'puppeteer';
import { config } from '../utils/Configuration';
import { createControlsList, runtimeConfig } from '../utils/RuntimeConfiguration';

let browser: puppeteer.Browser | undefined;
let page: puppeteer.Page | undefined;

export async function startGameHandler(): Promise<void> {
  browser = await puppeteer.launch({
    args: ['--disable-web-security', '--autoplay-policy=no-user-gesture-required', '--start-fullscreen'], //'--window-size=1366,768',],
    ignoreDefaultArgs: ['--mute-audio'],
    headless: false,
  });
  page = await browser.newPage();
  await page.goto(config.playerUrl);
  await page.setViewport({
    width: 1366,
    height: 768,
  });
  /*await page.setViewport({
    width: 1920,
    height: 1080,
  });*/
  await setControlsText(createControlsList());
  await setInfoText(runtimeConfig.info);
}

export async function stopGameHandler(): Promise<void> {
  if (!browser) return;
  if (!page) return;
  await page.reload();
  await setControlsText(createControlsList());
  await setInfoText(runtimeConfig.info);
  /*if (!browser) return;
  await browser.close();
  browser = undefined;
  page = undefined;*/
}

export async function loadROM(url: string): Promise<void> {
  if (!page) return;
  await page.goto(config.playerUrl);
  /*const session = await page.target().createCDPSession();
  await session.send('Emulation.setPageScaleFactor', {
    pageScaleFactor: 1.25, // 125%
  });*/
  await setControlsText(createControlsList());
  await setInfoText(runtimeConfig.info);
  await page.evaluate(`window.loadROM('${url}');`);
  // Hit the play now button
  tryClickPlay();
}

function tryClickPlay() {
  setTimeout(async () => {
    try {
      const [playNowButton] = await page!.$x('//a[contains(text(), "Play Now")]');
      await playNowButton.click();
      /*setTimeout(async () => {
        deleteTheRandomDiv();
      }, 250);*/
    } catch (e) {
      tryClickPlay();
    }
  }, 250);
}

export async function resetConsole(): Promise<void> {
  if (!page) return;
  await page.evaluate(`window.resetConsole();`);
}

export async function setControlsText(text: string): Promise<void> {
  if (!page) return;
  await page.evaluate((text) => {
    (window as any).setControlsText(text);
  }, text);
}

export async function setInfoText(text: string): Promise<void> {
  if (!page) return;
  await page.evaluate((text) => {
    (window as any).setInfoText(text);
  }, text);
}

export async function deleteTheRandomDiv(): Promise<void> {
  if (!page) return;
  await page.evaluate(() => {
    let element = (document as any).evaluate(
      '/html/body/div[1]/div/div/div/div[6]/div/div[1]',
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    );
    element.singleNodeValue.remove();
  });
}

export function lookupKeyName(input: string): string {
  switch (input) {
    case 'a':
      return 'A';
    case 'b':
      return 'B';
    case 'x':
      return 'X';
    case 'y':
      return 'Y';
    case 'start':
      return 'Start';
    case 'select':
      return 'Select';
    case 'right':
      return 'Right';
    case 'left':
      return 'Left';
    case 'up':
      return 'Up';
    case 'down':
      return 'Down';
    case 'l':
      return 'L';
    case 'r':
      return 'R';
    case 'z':
      return 'Z';
    case 'l stick right':
      return 'L Stick Right';
    case 'l stick left':
      return 'L Stick Left';
    case 'l stick up':
      return 'L Stick Up';
    case 'l stick down':
      return 'L Stick Down';
    default:
      return '';
  }
}

export function lookupKey(input: string): string {
  switch (input) {
    case 'a':
      return 'z';
    case 'b':
      return 'x';
    case 'x':
      return 'a';
    case 'y':
      return 's';
    case 'start':
      return 'Enter';
    case 'select':
      return 'Shift';
    case 'right':
      return 'ArrowRight';
    case 'left':
      return 'ArrowLeft';
    case 'up':
      return 'ArrowUp';
    case 'down':
      return 'ArrowDown';
    case 'l':
      return 'q';
    case 'r':
      return 'e';
    case 'z':
      return 'r';
    case 'l stick right':
      return 'h';
    case 'l stick left':
      return 'f';
    case 'l stick up':
      return 't';
    case 'l stick down':
      return 'g';
    default:
      return '';
  }
}

export async function keyHandler(userId: string, messageContent: string): Promise<void> {
  const chatCommandNames = Object.keys(runtimeConfig.chatCommands);
  if (!chatCommandNames.includes(messageContent)) return;
  const chatCommand = runtimeConfig.chatCommands[messageContent];
  for (let i = 0; i < chatCommand.length; i++) {
    page?.keyboard.press(lookupKey(chatCommand[i].key) as KeyInput, {
      delay: chatCommand[i].delay,
    });
  }
}
