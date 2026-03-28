import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { App } from './app.entity';
import { CampaignTrigger } from './campaign-trigger.entity';
import { CampaignAction } from './campaign-action.entity';

export type CampaignStatus = 'draft' | 'active' | 'paused';

@Entity('campaigns')
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  appId!: string;

  @ManyToOne(() => App, (app) => app.campaigns)
  app!: App;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'varchar', default: 'draft' })
  status!: CampaignStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => CampaignTrigger, (trigger) => trigger.campaign, { cascade: true })
  triggers!: CampaignTrigger[];

  @OneToMany(() => CampaignAction, (action) => action.campaign, { cascade: true })
  actions!: CampaignAction[];
}
