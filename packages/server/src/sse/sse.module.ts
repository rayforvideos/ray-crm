import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { App } from '../common/entities/app.entity';
import { SseService } from './sse.service';
import { SseController } from './sse.controller';

@Module({
  imports: [TypeOrmModule.forFeature([App])],
  controllers: [SseController],
  providers: [SseService],
  exports: [SseService],
})
export class SseModule {}
