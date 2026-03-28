import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../common/entities/event.entity';
import { UsersService } from '../users/users.service';
import { TriggerEngineService } from '../trigger-engine/trigger-engine.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
    private readonly usersService: UsersService,
    private readonly triggerEngine: TriggerEngineService,
  ) {}

  async track(appId: string, externalId: string, name: string, properties?: Record<string, unknown>, timestamp?: string) {
    const user = await this.usersService.upsert(appId, externalId);

    const event = this.eventRepo.create({
      userId: user.id,
      appId,
      name,
      properties: properties ?? {},
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    });

    const saved = await this.eventRepo.save(event);

    // Fire-and-forget trigger evaluation
    this.triggerEngine.evaluate(saved, user).catch((err) => {
      console.error('Trigger evaluation failed:', err);
    });

    return saved;
  }

  async trackBatch(appId: string, events: Array<{ externalId: string; name: string; properties?: Record<string, unknown>; timestamp?: string }>) {
    const results: Event[] = [];
    for (const e of events) {
      const event = await this.track(appId, e.externalId, e.name, e.properties, e.timestamp);
      results.push(event);
    }
    return results;
  }

  findByApp(appId: string, page = 1, limit = 50) {
    return this.eventRepo.findAndCount({
      where: { appId },
      order: { timestamp: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user'],
    });
  }

  findByUser(userId: string, page = 1, limit = 50) {
    return this.eventRepo.findAndCount({
      where: { userId },
      order: { timestamp: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
