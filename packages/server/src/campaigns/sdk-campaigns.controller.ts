import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { AppKeyGuard } from '../common/guards/app-key.guard';
import { App } from '../common/entities/app.entity';

@Controller('sdk/campaigns')
@UseGuards(AppKeyGuard)
export class SdkCampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get('rules')
  getRules(@Req() req: Request & { app: App }) {
    return this.campaignsService.findActiveInappRules(req.app.id);
  }
}
