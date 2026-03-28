import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActionLog, ActionLogStatus } from '../common/entities/action-log.entity';
import { ActionType } from '../common/entities/campaign-action.entity';

@Injectable()
export class ActionLogService {
  constructor(
    @InjectRepository(ActionLog)
    private readonly logRepo: Repository<ActionLog>,
  ) {}

  async create(params: {
    campaignId: string;
    actionId: string;
    userId: string;
    actionType: ActionType;
    status: ActionLogStatus;
    metadata?: Record<string, unknown>;
  }) {
    const log = this.logRepo.create(params);
    return this.logRepo.save(log);
  }

  async updateStatus(id: string, status: ActionLogStatus, metadata?: Record<string, unknown>) {
    await this.logRepo.update(id, { status, ...(metadata ? { metadata: metadata as any } : {}) });
  }

  findByCampaign(campaignId: string, page = 1, limit = 50) {
    return this.logRepo.findAndCount({
      where: { campaignId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user'],
    });
  }

  findByUser(userId: string, page = 1, limit = 50) {
    return this.logRepo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
