import { useEffect, useState } from 'react';
import { getTelegramWebApp, initTelegramMiniApp, isTelegramMiniApp } from '../lib/telegram';
import type { TelegramWebApp } from '../types/telegram';

export function useTelegramMiniApp() {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(() => getTelegramWebApp());

  useEffect(() => {
    setWebApp(initTelegramMiniApp());
  }, []);

  return {
    webApp,
    isTelegram: isTelegramMiniApp(),
    startParam: webApp?.initDataUnsafe?.start_param ?? null,
    user: webApp?.initDataUnsafe?.user ?? null,
    platform: webApp?.platform ?? 'browser',
    version: webApp?.version ?? 'unknown',
  };
}
