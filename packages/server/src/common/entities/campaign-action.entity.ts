import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from 'typeorm';
import { Campaign } from './campaign.entity';
import { WebhookConfig } from './webhook-config.entity';

export type ActionType = 'inapp_toast' | 'inapp_modal' | 'inapp_banner' | 'webhook' | 'kakao';

@Entity('campaign_actions')
export class CampaignAction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  campaignId!: string;

  @ManyToOne(() => Campaign, (campaign) => campaign.actions, { onDelete: 'CASCADE' })
  campaign!: Campaign;

  @Column({ type: 'varchar' })
  type!: ActionType;

  @Column({ type: 'jsonb', default: {} })
  config!: Record<string, unknown>;

  @OneToOne(() => WebhookConfig, (wh) => wh.campaignAction, { cascade: true })
  webhookConfig!: WebhookConfig;
}
