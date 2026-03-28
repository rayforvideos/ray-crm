import { Controller, Get, Post, Body, Query, Req, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AppKeyGuard } from '../common/guards/app-key.guard';
import { TrackDto, TrackBatchDto } from '../common/dto/sdk.dto';
import { App } from '../common/entities/app.entity';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('track')
  @UseGuards(AppKeyGuard)
  track(@Req() req: Request & { app: App }, @Body() dto: TrackDto) {
    return this.eventsService.track(req.app.id, dto.externalId, dto.name, dto.properties, dto.timestamp);
  }

  @Post('track/batch')
  @UseGuards(AppKeyGuard)
  trackBatch(@Req() req: Request & { app: App }, @Body() dto: TrackBatchDto) {
    return this.eventsService.trackBatch(req.app.id, dto.events);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('appId') appId: string, @Query('page') page?: string) {
    return this.eventsService.findByApp(appId, page ? parseInt(page) : 1);
  }

  @Get('by-user')
  @UseGuards(JwtAuthGuard)
  findByUser(@Query('userId') userId: string, @Query('page') page?: string) {
    return this.eventsService.findByUser(userId, page ? parseInt(page) : 1);
  }
}
