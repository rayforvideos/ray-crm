import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionLog } from '../common/entities/action-log.entity';
import { SseModule } from '../sse/sse.module';
import { ActionsService } from './actions.service';
import { ActionLogService } from './action-log.service';
import { InappActionService } from './inapp/inapp-action.service';
import { WebhookActionService } from './webhook/webhook-action.service';
import { KakaoActionService } from './kakao/kakao-action.service';

@Module({
  imports: [TypeOrmModule.forFeature([ActionLog]), SseModule],
  providers: [
    ActionsService,
    ActionLogService,
    InappActionService,
    WebhookActionService,
    KakaoActionService,
  ],
  exports: [ActionsService, ActionLogService],
})
export class ActionsModule {}
