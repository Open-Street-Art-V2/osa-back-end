import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Picture } from './picture/picture.entity';

@Entity()
@Unique(['title'])
export class Art {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public title: string;

  @Column()
  public artist: string;

  @Column()
  public description: string;

  @Column('decimal', { precision: 10, scale: 5 })
  public latitude: number;

  @Column('decimal', { precision: 10, scale: 5 })
  public longitude: number;

  @Column()
  public address: string;

  @Column()
  public city: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @OneToMany(() => Picture, (picture) => picture.art)
  pictures?: Picture[];

  public created_at?: Date;
}
