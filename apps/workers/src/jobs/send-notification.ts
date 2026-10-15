import type { NotificationChannelAdapter, NotificationChannelName, NotificationMessage } from '@if/integrations';

/** Fans a notification out to each requested channel: SES email, Teams, Slack, in-app, SMS (FR-0065). */
const adapters = new Map<NotificationChannelName, NotificationChannelAdapter>(); // TODO register SES/Teams/Slack/in-app adapters

export async function handler(event: { channels: NotificationChannelName[]; message: NotificationMessage }): Promise<string[]> {
  const delivered: string[] = [];
  for (const channel of event.channels) {
    const adapter = adapters.get(channel);
    if (!adapter) continue; // TODO dead-letter + alarm (NFR-M03)
    await adapter.send(event.message);
    delivered.push(channel);
  }
  return delivered;
}
