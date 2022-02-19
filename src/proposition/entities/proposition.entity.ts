import { Art } from 'src/art/art.entity';
import { Picture } from 'src/art/picture/picture.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
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

  @OneToMany(() => Picture, (picture) => picture.art, { eager: true })
  pictures?: Picture[];

  @ManyToOne(() => User, (user) => user.arts, {
    nullable: true,
  })
  user: User;

  @OneToMany(() => Proposition, (proposition) => proposition.art)
  proposition?: Proposition[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at?: Date;
  @ManyToOne(() => Art, (art) => art.id, {
    eager: true,
  })
  art: Art;
}
