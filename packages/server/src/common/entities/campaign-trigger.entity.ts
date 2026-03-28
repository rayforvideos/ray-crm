import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Campaign } from './campaign.entity';
import { Segment } from './segment.entity';

export type TriggerType = 'event' | 'segment';

@Entity('campaign_triggers')
export class CampaignTrigger {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  campaignId!: string;

  @ManyToOne(() => Campaign, (campaign) => campaign.triggers, { onDelete: 'CASCADE' })
  campaign!: Campaign;

  @Column({ type: 'varchar' })
  type!: TriggerType;

  @Column({ nullable: true })
  eventName!: string;

  @Column({ nullable: true })
  segmentId!: string;

  @ManyToOne(() => Segment, { nullable: true })
  segment!: Segment;

  @Column({ type: 'jsonb', nullable: true })
  eventConditions!: Record<string, unknown>;
}
