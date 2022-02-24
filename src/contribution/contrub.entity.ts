import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { ContribPicture } from './contrib-picture/contrib-picture.entity';

@Entity()
@Unique(['title'])
export class contrubArt {
  @PrimaryColumn()
  public id: number;

  @Column()
  public title: string;

  @Column({ nullable: true })
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
  @ManyToOne(() => User, (user) => user.propositions, {
    nullable: true,
  })
  user: User;

  @OneToMany(() => ContribPicture, (picture) => picture.contribution, {
    eager: true,
  })
  pictures?: ContribPicture[];

  @Column()
  index: number;

  public created_at?: Date;
}
