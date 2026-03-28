import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AppsService } from './apps.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { IsString } from 'class-validator';

class CreateAppDto {
  @IsString()
  name!: string;
}

@Controller('apps')
@UseGuards(JwtAuthGuard)
export class AppsController {
  constructor(private readonly appsService: AppsService) {}

  @Post()
  create(@Body() dto: CreateAppDto) {
    return this.appsService.create(dto.name);
  }

  @Get()
  findAll() {
    return this.appsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.appsService.findById(id);
  }
}
