import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { CampaignAction } from './campaign-action.entity';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

@Entity('webhook_configs')
export class WebhookConfig {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  campaignActionId!: string;

  @OneToOne(() => CampaignAction, (action) => action.webhookConfig, { onDelete: 'CASCADE' })
  @JoinColumn()
  campaignAction!: CampaignAction;

  @Column()
  url!: string;

  @Column({ type: 'varchar', default: 'POST' })
  method!: HttpMethod;

  @Column({ type: 'jsonb', default: {} })
  headers!: Record<string, string>;

  @Column({ type: 'text', nullable: true })
  bodyTemplate!: string;

  @Column({ type: 'int', default: 3 })
  maxRetries!: number;
}
