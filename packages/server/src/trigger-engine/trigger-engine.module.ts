import { Module } from '@nestjs/common';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { SegmentsModule } from '../segments/segments.module';
import { ActionsModule } from '../actions/actions.module';
import { TriggerEngineService } from './trigger-engine.service';

@Module({
  imports: [CampaignsModule, SegmentsModule, ActionsModule],
  providers: [TriggerEngineService],
  exports: [TriggerEngineService],
})
export class TriggerEngineModule {}
