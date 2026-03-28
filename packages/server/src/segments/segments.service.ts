import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Segment, SegmentConditions, SegmentCondition } from '../common/entities/segment.entity';
import { User } from '../common/entities/user.entity';

@Injectable()
export class SegmentsService {
  constructor(
    @InjectRepository(Segment)
    private readonly segmentRepo: Repository<Segment>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  create(appId: string, name: string, conditions: SegmentConditions) {
    const segment = this.segmentRepo.create({ appId, name, conditions });
    return this.segmentRepo.save(segment);
  }

  findByApp(appId: string) {
    return this.segmentRepo.find({ where: { appId }, order: { createdAt: 'DESC' } });
  }

  findById(id: string) {
    return this.segmentRepo.findOneOrFail({ where: { id } });
  }

  async evaluateUser(segmentId: string, userId: string): Promise<boolean> {
    const segment = await this.segmentRepo.findOneOrFail({ where: { id: segmentId } });
    const user = await this.userRepo.findOneOrFail({ where: { id: userId } });
    return this.matchConditions(segment.conditions, user);
  }

  async countUsers(segmentId: string, appId: string): Promise<number> {
    const segment = await this.segmentRepo.findOneOrFail({ where: { id: segmentId } });
    const users = await this.userRepo.find({ where: { appId } });
    return users.filter((user) => this.matchConditions(segment.conditions, user)).length;
  }

  private matchConditions(conditions: SegmentConditions, user: User): boolean {
    const results = conditions.conditions.map((c) => this.matchCondition(c, user));
    return conditions.operator === 'AND'
      ? results.every(Boolean)
      : results.some(Boolean);
  }

  private matchCondition(condition: SegmentCondition, user: User): boolean {
    const value = this.resolveField(condition.field, user);

    switch (condition.op) {
      case 'eq':
        return value === condition.value;
      case 'neq':
        return value !== condition.value;
      case 'gt':
        return typeof value === 'number' && value > (condition.value as number);
      case 'gte':
        return typeof value === 'number' && value >= (condition.value as number);
      case 'lt':
        if (typeof condition.value === 'string' && condition.value.startsWith('-')) {
          const days = parseInt(condition.value.slice(1, -1));
          const threshold = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
          return value instanceof Date ? value < threshold : new Date(value as string) < threshold;
        }
        return typeof value === 'number' && value < (condition.value as number);
      case 'lte':
        return typeof value === 'number' && value <= (condition.value as number);
      case 'contains':
        return typeof value === 'string' && value.includes(condition.value as string);
      case 'not_contains':
        return typeof value === 'string' && !value.includes(condition.value as string);
      default:
        return false;
    }
  }

  private resolveField(field: string, user: User): unknown {
    const parts = field.split('.');
    if (parts[0] === 'properties') {
      return parts.slice(1).reduce((obj: any, key) => obj?.[key], user.properties);
    }
    return (user as any)[parts[0]];
  }
}
