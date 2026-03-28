import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { App } from '../common/entities/app.entity';

@Injectable()
export class AppsService {
  constructor(
    @InjectRepository(App)
    private readonly appRepo: Repository<App>,
  ) {}

  async create(name: string) {
    const app = this.appRepo.create({
      name,
      appKey: `rcrm_${randomUUID().replace(/-/g, '')}`,
    });
    return this.appRepo.save(app);
  }

  findAll() {
    return this.appRepo.find({ order: { createdAt: 'DESC' } });
  }

  findById(id: string) {
    return this.appRepo.findOneOrFail({ where: { id } });
  }

  findByAppKey(appKey: string) {
    return this.appRepo.findOne({ where: { appKey } });
  }
}
