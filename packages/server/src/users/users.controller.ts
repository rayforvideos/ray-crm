import { Controller, Get, Post, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AppKeyGuard } from '../common/guards/app-key.guard';
import { IdentifyDto } from '../common/dto/sdk.dto';
import { App } from '../common/entities/app.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('identify')
  @UseGuards(AppKeyGuard)
  identify(@Req() req: Request & { app: App }, @Body() dto: IdentifyDto) {
    return this.usersService.upsert(req.app.id, dto.externalId, dto.properties);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('appId') appId: string, @Query('page') page?: string) {
    return this.usersService.findByApp(appId, page ? parseInt(page) : 1);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
