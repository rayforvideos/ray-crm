import { Injectable } from '@nestjs/common';
import { ActionLogService } from '../action-log.service';
import { CampaignAction } from '../../common/entities/campaign-action.entity';

@Injectable()
export class InappActionService {
  constructor(private readonly actionLogService: ActionLogService) {}

  async execute(action: CampaignAction, userId: string, campaignId: string) {
    return this.actionLogService.create({
      campaignId,
      actionId: action.id,
      userId,
      actionType: action.type,
      status: 'sent',
    });
  }
}
