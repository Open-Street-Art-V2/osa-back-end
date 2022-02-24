import { PropPicture } from 'src/proposition/proposition-picture/proposition-picture.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  Unique,
} from 'typeorm';

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
    eager: true,
  })
  user: User;

  @OneToMany(() => PropPicture, (picture) => picture.proposition, {
    eager: true,
  })
  pictures?: PropPicture[];

  @Column()
  index: number;

  public created_at?: Date;
}
