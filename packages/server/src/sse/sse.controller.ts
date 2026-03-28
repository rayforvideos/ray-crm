import { Controller, Get, Req, Res, Query, UnauthorizedException } from '@nestjs/common';
import { Response, Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { SseService } from './sse.service';
import { App } from '../common/entities/app.entity';

@Controller('sse')
export class SseController {
  constructor(
    private readonly sseService: SseService,
    @InjectRepository(App)
    private readonly appRepo: Repository<App>,
  ) {}

  @Get('connect')
  async connect(
    @Req() req: Request,
    @Res() res: Response,
    @Query('userId') userId: string,
    @Query('appKey') appKey: string,
  ) {
    const app = await this.appRepo.findOne({ where: { appKey } });
    if (!app) {
      throw new UnauthorizedException('Invalid app key');
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders();

    res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

    const connectionId = randomUUID();
    this.sseService.addConnection(connectionId, app.id, userId, res);

    const heartbeat = setInterval(() => {
      res.write(`: heartbeat\n\n`);
    }, 30000);

    req.on('close', () => {
      clearInterval(heartbeat);
    });
  }
}
