import { Injectable } from '@nestjs/common';
import { InappActionService } from './inapp/inapp-action.service';
import { WebhookActionService } from './webhook/webhook-action.service';
import { KakaoActionService } from './kakao/kakao-action.service';
import { CampaignAction } from '../common/entities/campaign-action.entity';

export interface ActionContext {
  userId: string;
  campaignId: string;
  externalId: string;
  eventName?: string;
  eventProperties?: Record<string, unknown>;
}

@Injectable()
export class ActionsService {
  constructor(
    private readonly inappService: InappActionService,
    private readonly webhookService: WebhookActionService,
    private readonly kakaoService: KakaoActionService,
  ) {}

  async dispatch(action: CampaignAction, ctx: ActionContext) {
    switch (action.type) {
      case 'inapp_toast':
      case 'inapp_modal':
      case 'inapp_banner':
        return this.inappService.execute(action, ctx.userId, ctx.campaignId);
      case 'webhook':
        return this.webhookService.execute(action as any, ctx.userId, ctx.campaignId, {
          externalId: ctx.externalId,
          eventName: ctx.eventName,
          eventProperties: ctx.eventProperties,
        });
      case 'kakao':
        return this.kakaoService.execute(action, ctx.userId, ctx.campaignId);
    }
  }
}
