export type TelegramWebAppUser = {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
};

export type TelegramWebAppInitDataUnsafe = {
  user?: TelegramWebAppUser;
  start_param?: string;
};

export type TelegramWebApp = {
  platform?: string;
  version?: string;
  colorScheme?: 'light' | 'dark';
  initData?: string;
  initDataUnsafe?: TelegramWebAppInitDataUnsafe;
  ready: () => void;
  expand: () => void;
  openLink?: (url: string, options?: { try_instant_view?: boolean }) => void;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export {};
