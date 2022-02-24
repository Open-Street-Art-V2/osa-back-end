import { contrubArt } from 'src/contribution/contrub.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Proposition } from '../entities/proposition.entity';

@Entity()
export class PropPicture {
  @PrimaryColumn()
  public position: number;

  @Column()
  url: string;

  @ManyToOne(() => contrubArt, (proposition) => proposition.pictures, {
    primary: true,
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  proposition: Proposition;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at?: Date;
}
