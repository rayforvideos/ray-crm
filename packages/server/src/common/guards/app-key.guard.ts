import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { App } from '../entities/app.entity';

@Injectable()
export class AppKeyGuard implements CanActivate {
  constructor(
    @InjectRepository(App)
    private readonly appRepo: Repository<App>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const appKey = request.headers['x-app-key'] as string;

    if (!appKey) {
      throw new UnauthorizedException('Missing x-app-key header');
    }

    const app = await this.appRepo.findOne({ where: { appKey } });
    if (!app) {
      throw new UnauthorizedException('Invalid app key');
    }

    request.app = app;
    return true;
  }
}
