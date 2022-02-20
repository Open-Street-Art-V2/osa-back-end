import { Art } from 'src/art/art.entity';
import { User } from 'src/users/user.entity';
import { PropPicture } from '../proposition-picture/proposition-picture.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['title'])
export class Proposition {
  @PrimaryGeneratedColumn()
  public id?: number;

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

  @OneToMany(() => PropPicture, (picture) => picture.proposition, {
    eager: true,
  })
  pictures?: PropPicture[];

  @ManyToOne(() => User, (user) => user.propositions, {
    nullable: true,
    eager: true,
  })
  user: User;

  @ManyToOne(() => Art, (art) => art.id, {
    eager: true,
  })
  art?: Art;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at?: Date;
}
