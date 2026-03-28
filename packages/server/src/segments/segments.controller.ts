import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SegmentsService } from './segments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateSegmentDto } from '../common/dto/segment.dto';

@Controller('segments')
@UseGuards(JwtAuthGuard)
export class SegmentsController {
  constructor(private readonly segmentsService: SegmentsService) {}

  @Post()
  create(@Query('appId') appId: string, @Body() dto: CreateSegmentDto) {
    return this.segmentsService.create(appId, dto.name, dto.conditions);
  }

  @Get()
  findAll(@Query('appId') appId: string) {
    return this.segmentsService.findByApp(appId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.segmentsService.findById(id);
  }

  @Get(':id/count')
  countUsers(@Param('id') id: string, @Query('appId') appId: string) {
    return this.segmentsService.countUsers(id, appId).then((count) => ({ count }));
  }
}
