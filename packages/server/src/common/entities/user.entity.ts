import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, Index } from 'typeorm';
import { App } from './app.entity';
import { Event } from './event.entity';

@Entity('users')
@Index(['appId', 'externalId'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  externalId!: string;

  @Column()
  appId!: string;

  @ManyToOne(() => App, (app) => app.users)
  app!: App;

  @Column({ type: 'jsonb', default: {} })
  properties!: Record<string, unknown>;

  @Column({ type: 'timestamp', nullable: true })
  firstSeenAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastSeenAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Event, (event) => event.user)
  events!: Event[];
}
