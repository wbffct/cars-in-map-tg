import type { TelegramWebAppUser } from '../types/telegram';

type TelegramStatusProps = {
  isTelegram: boolean;
  platform: string;
  version: string;
  startParam: string | null;
  user: TelegramWebAppUser | null;
};

export function TelegramStatus({
  isTelegram,
  platform,
  version,
  startParam,
  user,
}: TelegramStatusProps) {
  return (
    <section className="telegram-status">
      <div className="telegram-status__badge">
        {isTelegram ? 'Запущено внутри Telegram' : 'Режим браузера для разработки'}
      </div>
      <div className="telegram-status__grid">
        <div>
          <span>Платформа</span>
          <strong>{platform}</strong>
        </div>
        <div>
          <span>Версия WebApp</span>
          <strong>{version}</strong>
        </div>
        <div>
          <span>Start Param</span>
          <strong>{startParam ?? 'не передан'}</strong>
        </div>
        <div>
          <span>Пользователь</span>
          <strong>{user?.username ? `@${user.username}` : user?.first_name ?? 'не определен'}</strong>
        </div>
      </div>
      {!isTelegram ? (
        <p className="telegram-status__hint">
          Вне Telegram карта и карточки продолжают работать, но `initData` и WebApp API будут недоступны.
        </p>
      ) : null}
    </section>
  );
}
