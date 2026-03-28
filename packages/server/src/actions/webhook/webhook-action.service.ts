import { Injectable, Logger } from '@nestjs/common';
import { ActionLogService } from '../action-log.service';
import { CampaignAction } from '../../common/entities/campaign-action.entity';
import { WebhookConfig } from '../../common/entities/webhook-config.entity';

@Injectable()
export class WebhookActionService {
  private readonly logger = new Logger(WebhookActionService.name);

  constructor(private readonly actionLogService: ActionLogService) {}

  async execute(
    action: CampaignAction & { webhookConfig: WebhookConfig },
    userId: string,
    campaignId: string,
    context: { externalId: string; eventName?: string; eventProperties?: Record<string, unknown> },
  ) {
    const { webhookConfig } = action;
    if (!webhookConfig) return;

    const body = this.interpolateTemplate(webhookConfig.bodyTemplate, {
      userId: context.externalId,
      eventName: context.eventName ?? '',
      eventProperties: context.eventProperties ?? {},
    });

    let lastError: string | undefined;
    for (let attempt = 0; attempt <= webhookConfig.maxRetries; attempt++) {
      try {
        const response = await fetch(webhookConfig.url, {
          method: webhookConfig.method,
          headers: {
            'Content-Type': 'application/json',
            ...webhookConfig.headers,
          },
          body: webhookConfig.method !== 'GET' ? body : undefined,
        });

        if (response.ok) {
          await this.actionLogService.create({
            campaignId,
            actionId: action.id,
            userId,
            actionType: 'webhook',
            status: 'sent',
            metadata: { statusCode: response.status },
          });
          return;
        }

        lastError = `HTTP ${response.status}`;
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err);
      }

      if (attempt < webhookConfig.maxRetries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }

    this.logger.error(`Webhook failed after retries: ${lastError}`);
    await this.actionLogService.create({
      campaignId,
      actionId: action.id,
      userId,
      actionType: 'webhook',
      status: 'failed',
      metadata: { error: lastError },
    });
  }

  private interpolateTemplate(
    template: string | null,
    vars: Record<string, unknown>,
  ): string {
    if (!template) return '{}';
    return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (_match, path: string) => {
      const value = path.split('.').reduce((obj: any, key) => obj?.[key], vars);
      return typeof value === 'object' ? JSON.stringify(value) : String(value ?? '');
    });
  }
}
