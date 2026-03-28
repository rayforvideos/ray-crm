import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { App } from './app.entity';

export interface SegmentCondition {
  field: string;
  op: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'not_contains';
  value: string | number | boolean;
}

export interface SegmentConditions {
  operator: 'AND' | 'OR';
  conditions: SegmentCondition[];
}

@Entity('segments')
export class Segment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  appId!: string;

  @ManyToOne(() => App)
  app!: App;

  @Column()
  name!: string;

  @Column({ type: 'jsonb' })
  conditions!: SegmentConditions;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
