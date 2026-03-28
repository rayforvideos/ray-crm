import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Campaign } from './campaign.entity';
import { CampaignAction } from './campaign-action.entity';
import { User } from './user.entity';
import { ActionType } from './campaign-action.entity';

export type ActionLogStatus = 'sent' | 'clicked' | 'dismissed' | 'failed';

@Entity('action_logs')
export class ActionLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  campaignId!: string;

  @ManyToOne(() => Campaign)
  campaign!: Campaign;

  @Column()
  actionId!: string;

  @ManyToOne(() => CampaignAction)
  action!: CampaignAction;

  @Column()
  userId!: string;

  @ManyToOne(() => User)
  user!: User;

  @Column({ type: 'varchar' })
  actionType!: ActionType;

  @Column({ type: 'varchar', default: 'sent' })
  status!: ActionLogStatus;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, unknown>;

  @CreateDateColumn()
  createdAt!: Date;
}
