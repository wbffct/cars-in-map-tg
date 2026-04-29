import type { TelegramWebApp } from '../types/telegram';

export const getTelegramWebApp = (): TelegramWebApp | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.Telegram?.WebApp ?? null;
};

export const isTelegramMiniApp = (): boolean => {
  return getTelegramWebApp() !== null;
};

export const initTelegramMiniApp = (): TelegramWebApp | null => {
  const webApp = getTelegramWebApp();

  if (!webApp) {
    return null;
  }

  webApp.ready();
  webApp.expand();
  webApp.setHeaderColor?.('#fffaf0');
  webApp.setBackgroundColor?.('#fffaf0');

  return webApp;
};

export const openTelegramLink = (url: string): void => {
  const webApp = getTelegramWebApp();

  if (webApp?.openLink) {
    webApp.openLink(url);
    return;
  }

  window.open(url, '_blank', 'noopener,noreferrer');
};
