import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign, CampaignStatus } from '../common/entities/campaign.entity';
import { CampaignTrigger } from '../common/entities/campaign-trigger.entity';
import { CampaignAction } from '../common/entities/campaign-action.entity';
import { WebhookConfig } from '../common/entities/webhook-config.entity';
import { CreateCampaignDto } from '../common/dto/campaign.dto';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepo: Repository<Campaign>,
    @InjectRepository(CampaignTrigger)
    private readonly triggerRepo: Repository<CampaignTrigger>,
    @InjectRepository(CampaignAction)
    private readonly actionRepo: Repository<CampaignAction>,
    @InjectRepository(WebhookConfig)
    private readonly webhookRepo: Repository<WebhookConfig>,
  ) {}

  async create(appId: string, dto: CreateCampaignDto) {
    const campaign = this.campaignRepo.create({
      appId,
      name: dto.name,
      description: dto.description,
      status: 'draft',
    });
    const saved = await this.campaignRepo.save(campaign);

    for (const t of dto.triggers) {
      const trigger = this.triggerRepo.create({
        campaignId: saved.id,
        type: t.type,
        eventName: t.eventName,
        segmentId: t.segmentId,
        eventConditions: t.eventConditions,
      });
      await this.triggerRepo.save(trigger);
    }

    for (const a of dto.actions) {
      const action = this.actionRepo.create({
        campaignId: saved.id,
        type: a.type,
        config: a.config ?? {},
      });
      const savedAction = await this.actionRepo.save(action);

      if (a.type === 'webhook' && a.webhookConfig) {
        const wh = this.webhookRepo.create({
          campaignActionId: savedAction.id,
          ...a.webhookConfig,
        });
        await this.webhookRepo.save(wh);
      }
    }

    return this.findById(saved.id);
  }

  findByApp(appId: string, status?: CampaignStatus) {
    const where: any = { appId };
    if (status) where.status = status;
    return this.campaignRepo.find({
      where,
      relations: ['triggers', 'actions'],
      order: { createdAt: 'DESC' },
    });
  }

  findById(id: string) {
    return this.campaignRepo.findOneOrFail({
      where: { id },
      relations: ['triggers', 'triggers.segment', 'actions', 'actions.webhookConfig'],
    });
  }

  async updateStatus(id: string, status: CampaignStatus) {
    await this.campaignRepo.update(id, { status });
    return this.findById(id);
  }

  findActiveByEventName(appId: string, eventName: string) {
    return this.campaignRepo
      .createQueryBuilder('campaign')
      .innerJoinAndSelect('campaign.triggers', 'trigger')
      .innerJoinAndSelect('campaign.actions', 'action')
      .leftJoinAndSelect('action.webhookConfig', 'webhookConfig')
      .where('campaign.appId = :appId', { appId })
      .andWhere('campaign.status = :status', { status: 'active' })
      .andWhere('trigger.type = :type', { type: 'event' })
      .andWhere('trigger.eventName = :eventName', { eventName })
      .getMany();
  }

  findActiveBySegment(appId: string) {
    return this.campaignRepo
      .createQueryBuilder('campaign')
      .innerJoinAndSelect('campaign.triggers', 'trigger')
      .innerJoinAndSelect('campaign.actions', 'action')
      .leftJoinAndSelect('action.webhookConfig', 'webhookConfig')
      .where('campaign.appId = :appId', { appId })
      .andWhere('campaign.status = :status', { status: 'active' })
      .andWhere('trigger.type = :type', { type: 'segment' })
      .getMany();
  }
}
