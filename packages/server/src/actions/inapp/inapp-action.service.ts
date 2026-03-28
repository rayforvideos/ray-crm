import { Injectable } from '@nestjs/common';
import { SseService } from '../../sse/sse.service';
import { ActionLogService } from '../action-log.service';
import { CampaignAction } from '../../common/entities/campaign-action.entity';

@Injectable()
export class InappActionService {
  constructor(
    private readonly sseService: SseService,
    private readonly actionLogService: ActionLogService,
  ) {}

  async execute(action: CampaignAction, userId: string, campaignId: string) {
    const log = await this.actionLogService.create({
      campaignId,
      actionId: action.id,
      userId,
      actionType: action.type,
      status: 'sent',
    });

    await this.sseService.publishAction(userId, {
      type: action.type,
      actionLogId: log.id,
      config: action.config,
    });

    return log;
  }
}
