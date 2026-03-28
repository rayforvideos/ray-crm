import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AppsModule } from './apps/apps.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { SegmentsModule } from './segments/segments.module';
import { SseModule } from './sse/sse.module';
import { ActionsModule } from './actions/actions.module';
import { TriggerEngineModule } from './trigger-engine/trigger-engine.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    AuthModule,
    AppsModule,
    UsersModule,
    EventsModule,
    CampaignsModule,
    SegmentsModule,
    SseModule,
    ActionsModule,
    TriggerEngineModule,
  ],
})
export class AppModule {}
