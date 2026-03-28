import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../common/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async upsert(appId: string, externalId: string, properties?: Record<string, unknown>) {
    let user = await this.userRepo.findOne({ where: { appId, externalId } });
    const now = new Date();

    if (user) {
      if (properties) {
        user.properties = { ...user.properties, ...properties };
      }
      user.lastSeenAt = now;
      return this.userRepo.save(user);
    }

    user = this.userRepo.create({
      appId,
      externalId,
      properties: properties ?? {},
      firstSeenAt: now,
      lastSeenAt: now,
    });
    return this.userRepo.save(user);
  }

  findByApp(appId: string, page = 1, limit = 50) {
    return this.userRepo.findAndCount({
      where: { appId },
      order: { lastSeenAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  findById(id: string) {
    return this.userRepo.findOneOrFail({ where: { id } });
  }

  findByExternalId(appId: string, externalId: string) {
    return this.userRepo.findOne({ where: { appId, externalId } });
  }
}
