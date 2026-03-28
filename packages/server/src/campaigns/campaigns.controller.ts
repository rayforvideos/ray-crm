import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateCampaignDto, UpdateCampaignStatusDto } from '../common/dto/campaign.dto';
import { CampaignStatus } from '../common/entities/campaign.entity';

@Controller('campaigns')
@UseGuards(JwtAuthGuard)
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  create(@Query('appId') appId: string, @Body() dto: CreateCampaignDto) {
    return this.campaignsService.create(appId, dto);
  }

  @Get()
  findAll(@Query('appId') appId: string, @Query('status') status?: CampaignStatus) {
    return this.campaignsService.findByApp(appId, status);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.campaignsService.findById(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateCampaignStatusDto) {
    return this.campaignsService.updateStatus(id, dto.status);
  }
}
