import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Index } from 'typeorm';
import { User } from './user.entity';
import { App } from './app.entity';

@Entity('events')
@Index(['appId', 'name'])
@Index(['userId'])
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => User, (user) => user.events)
  user!: User;

  @Column()
  appId!: string;

  @ManyToOne(() => App)
  app!: App;

  @Column()
  name!: string;

  @Column({ type: 'jsonb', default: {} })
  properties!: Record<string, unknown>;

  @Column({ type: 'timestamp' })
  timestamp!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}
