import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Art } from '../art.entity';

@Entity()
@Unique(['url'])
export class Picture {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  url: string;

  @ManyToOne(() => Art, (art) => art.pictures)
  art?: Art;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at?: Date;
}
