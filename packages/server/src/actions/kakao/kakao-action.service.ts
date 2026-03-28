import { Injectable, Logger } from '@nestjs/common';
import { CampaignAction } from '../../common/entities/campaign-action.entity';

@Injectable()
export class KakaoActionService {
  private readonly logger = new Logger(KakaoActionService.name);

  async execute(action: CampaignAction, userId: string, campaignId: string) {
    this.logger.log(
      `[STUB] Kakao action triggered for campaign=${campaignId}, user=${userId}, config=${JSON.stringify(action.config)}`,
    );
  }
}
