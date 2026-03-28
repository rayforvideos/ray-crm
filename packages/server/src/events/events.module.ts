import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../common/entities/event.entity';
import { App } from '../common/entities/app.entity';
import { UsersModule } from '../users/users.module';
import { TriggerEngineModule } from '../trigger-engine/trigger-engine.module';
import { ActionsModule } from '../actions/actions.module';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Event, App]), UsersModule, TriggerEngineModule, ActionsModule],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
