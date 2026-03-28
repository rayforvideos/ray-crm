import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from '../common/entities/campaign.entity';
import { CampaignTrigger } from '../common/entities/campaign-trigger.entity';
import { CampaignAction } from '../common/entities/campaign-action.entity';
import { WebhookConfig } from '../common/entities/webhook-config.entity';
import { CampaignsService } from './campaigns.service';
import { CampaignsController } from './campaigns.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Campaign, CampaignTrigger, CampaignAction, WebhookConfig]),
  ],
  controllers: [CampaignsController],
  providers: [CampaignsService],
  exports: [CampaignsService],
})
export class CampaignsModule {}
