import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { App } from '../common/entities/app.entity';
import { AppsService } from './apps.service';
import { AppsController } from './apps.controller';

@Module({
  imports: [TypeOrmModule.forFeature([App])],
  controllers: [AppsController],
  providers: [AppsService],
  exports: [AppsService, TypeOrmModule.forFeature([App])],
})
export class AppsModule {}
