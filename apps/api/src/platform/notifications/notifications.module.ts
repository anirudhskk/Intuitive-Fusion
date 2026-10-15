import { Global, Injectable, Logger, Module } from '@nestjs/common';
import type { NotificationChannelName, NotificationMessage } from '@if/integrations';

/**
 * Outbound notifications: in-platform, email, MS Teams, Slack, (SMS — open decision, see docs/open-decisions.md)
 * (FR-0065, FR-0066). Messages deep-link to the exact section needing action, e.g. the plan
 * section a delegate must approve (AI narrative — Approvals).
 *
 * Delivery runs asynchronously in apps/workers; this service only enqueues.
 */
@Injectable()
export class NotificationsService {
  private readonly log = new Logger('Notifications');

  async send(channels: NotificationChannelName[], message: NotificationMessage): Promise<void> {
    // TODO publish `notification.requested` to EventBridge/SQS; worker fans out per channel
    this.log.debug(`enqueue ${channels.join(',')} → ${message.recipientUserIds.join(',')}: ${message.subject}`);
  }
}

@Global()
@Module({ providers: [NotificationsService], exports: [NotificationsService] })
export class NotificationsModule {}
