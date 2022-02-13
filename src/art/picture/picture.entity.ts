import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { Art } from '../art.entity';

@Entity()
@Unique(['url'])
export class Picture {
  @PrimaryColumn()
  public position: number;

  @Column()
  url: string;

  @ManyToOne(() => Art, (art) => art.pictures, {
    primary: true,
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  art?: Art;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at?: Date;
}
