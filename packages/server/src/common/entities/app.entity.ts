import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Campaign } from './campaign.entity';

@Entity('apps')
export class App {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  appKey!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => User, (user) => user.app)
  users!: User[];

  @OneToMany(() => Campaign, (campaign) => campaign.app)
  campaigns!: Campaign[];
}
