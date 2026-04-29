type LogPayload = Record<string, string | number | boolean | null | undefined>;

type LogEventName =
  | 'mini_app_open'
  | 'map_ready'
  | 'pin_click'
  | 'card_close'
  | 'deeplink_click'
  | 'cars_load_error';

declare global {
  interface Window {
    __miniAppLogs__?: Array<{
      event: LogEventName;
      payload: LogPayload;
      timestamp: string;
    }>;
  }
}

export const logEvent = (event: LogEventName, payload: LogPayload = {}): void => {
  const entry = {
    event,
    payload,
    timestamp: new Date().toISOString(),
  };

  window.__miniAppLogs__ = [...(window.__miniAppLogs__ ?? []), entry];
  console.info(`[mini-app] ${event}`, payload);
};

export {};
